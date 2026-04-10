**todo:** test - tesztek irása a flow-hoz
**todo:** db - rate limiting implementálása, hogy megvédjük a végpontot a brute-force támadásoktól
**todo:** email - email validáció implementálása, hogy a regisztráció során megadott email cím valódi legyen, és a felhasználó hozzáférjen
**todo:** log - log rotáció implementálása, hogy a log fájlok ne nőjenek túl nagyra, és könnyebben kezelhető legyen a logok archiválása és törlése
**todo:** log - async queue implementálása a logoláshoz, hogy elkerüljük a fájl írásával kapcsolatos versenyhelyzeteket, és biztosítsuk a logok sorrendjét
**todo:** log - váltás majd winston vagy pino loggerre, hogy strukturáltabb logokat kapjunk, és könnyebben kezelhető legyen a logolás különböző szinteken (info, warn, error)
**todo** zod - validációt külön finkcióba kirakni hogy mokolható és tesztelhető legyen

**todo** route - a routok legyenek egységes response-al és helyes kóddal és message-vel

**todo** pizzas - pizza skeleton a loading állapothoz
**todo** pizzas - pizza képek a cloudinary-ből beállítani a default helyett ha van kép a list komponensben

**todo** OrderAddress - change to Google Places API to form fill

**todo** prisma séma - összekötni hogy amikor a user törölve van ne maradjon árván a db-ben a cím

**todo** prisma séma - isStillWorkingHere Boolean @default(true) legyen false hogy a frissen regisztrált user ne legyen egyből dolgozó
