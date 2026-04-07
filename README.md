# IEEE VIS 2020 Tweets - MongoDB Queries

## Loading the Data

1. Make sure MongoDB is running on port 27017.
2. Open a terminal and run this to import the data:

```bash
mongoimport --db ieeevis2020 --collection tweets --file ieeevis2020Tweets.dump
```

This will import the database called `ieeevis2020` with a collection called `tweets`.

## Running the Queries 

Make sure you have Node.js installed, then install dependencies:

```bash
npm install mongodb
```

Run each query:

```bash
node Query1.js   
node Query2.js 
node Query3.js 
node Query4.js
node Query5.js
```

## Redis Queries

This uses redis to cache the database in memory for faster manipulation

### Setup

1. Make sure Docker is installed.
2. Start a Redis container:

```bash
docker run -d --name redis -p 6379:6379 redis:latest
```

3. Install dependencies:

```bash
npm install
```

### Running the Redis Queries

Make sure both MongoDB and Redis are running, then run each query:

```bash
node RedisQuery1.js 
node RedisQuery2.js 
node RedisQuery3.js
node RedisQuery4.js   
node RedisQuery5.js  
```
