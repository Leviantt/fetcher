# fetcher
## Запуск*
* - при произедении запросов будут выходить ошибки, так как ссылка не рабочая
Для запуска проекта нужно следовать следующим шагам:
1. Создать .env файл с DATABASE_URL для подключения к PostgreSQL
2. Загрузить зависимости
```
npm install
```
3. Создать базу данных в PostgreSQL (если DATABASE_URL такой же как в .env.example, то ее название - fetcher)
4. Инициализировать призму
```
npx prisma generate --schema ./src/prisma/schema.prisma
```
```
npx prisma migrate dev --name init --schema ./src/prisma/schema.prisma
```
5. Сгенерировать 50 прокси
```
npm run generate-seeds
```
Проект можно запускать через
```
npm run dev
```
или
```
npm start
```
