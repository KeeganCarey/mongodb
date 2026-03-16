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
