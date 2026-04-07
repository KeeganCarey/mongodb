// RedisQuery1: How many tweets are there?
const { MongoClient } = require("mongodb");
const { createClient } = require("redis");

async function main() {
  // connect to the db
  const mongoClient = new MongoClient("mongodb://localhost:27017");
  await mongoClient.connect(); // asyncio await
  const db = mongoClient.db("ieeevis2020");
  const tweets = db.collection("tweets");

  // connect to redis
  const redisClient = createClient();
  await redisClient.connect();


  // initialize tweetCount to 0 in redis
  await redisClient.set("tweetCount", 0);

  // go through all the tweets and increment tweetCount for each one
  const cursor = tweets.find({});
  for await (const tweet of cursor) {
    await redisClient.incr("tweetCount"); // INCR adds 1 each time
  }

  // get the final value from redis and print it
  const count = await redisClient.get("tweetCount");
  console.log(`There were ${count} tweets`);

  // close the connections
  await redisClient.quit();
  await mongoClient.close();
}


//run main function

main();
