-- CreateTable
CREATE TABLE "Proxy" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Proxy_pkey" PRIMARY KEY ("id")
);
