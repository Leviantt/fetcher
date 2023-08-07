import { PrismaClient, Proxy } from '@prisma/client';
import axios from 'axios';
import {
  BASE_URL,
  MAX_CONCURRENT_REQUESTS,
  MAX_REQUEST_ERRORS,
  REQUEST_TIME_LIMIT,
  PAUSE_TIME,
  PRODUCT_IDS_COUNT,
} from './constants';
import { delay, generateRange, makeBatches } from './utils';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const productIds = generateRange(PRODUCT_IDS_COUNT);
  const proxies: Proxy[] = await prisma.proxy.findMany({ take: 50 });

  const result = await fetchProducts(productIds, proxies);

  console.log(result);
}

async function fetchProducts(
  productIds: number[],
  proxies: Proxy[],
): Promise<unknown[]> {
  if (proxies.length === 0) throw Error('You must provide at least one proxy.');

  const batches = makeBatches(productIds, MAX_CONCURRENT_REQUESTS);
  const allRequests = [];
  let proxyIndex = 0;

  for (const batch of batches) {
    allRequests.push(makeRequestsWithOneProxy(batch, proxies[proxyIndex]));
    proxyIndex = (proxyIndex + 1) % proxies.length;

    // so that next time we request with this proxy PAUSE_TIME will have passed,
    // and we will be able to make new requests
    await delay(PAUSE_TIME / proxies.length);
  }

  const result = await Promise.all(allRequests);
  return result.flat();
}

async function makeRequestsWithOneProxy(
  batch: number[],
  proxy: Proxy,
): Promise<unknown[]> {
  const requests = [];

  for (const productId of batch) {
    requests.push(makeRequest(productId, proxy));
  }

  const result = await Promise.all(requests);
  return result;
}

async function makeRequest(
  productId: number,
  proxy: Proxy,
): Promise<unknown | null> {
  let attempts = 0;

  while (attempts < MAX_REQUEST_ERRORS) {
    try {
      const axiosConfig = {
        proxy: {
          host: proxy.ip,
          port: proxy.port,
          auth: {
            username: proxy.login,
            password: proxy.password,
          },
        },
        timeout: REQUEST_TIME_LIMIT,
      };

      const response = await axios.post(
        `${BASE_URL}/${productId}`,
        {},
        axiosConfig,
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${productId}`, error);

      attempts++;
    }
  }

  return null;
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
