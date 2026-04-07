// RedisQuery2: Compute and print the total number of favorites in the dataset
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


  // start favoritesSum at 0 in redis
  await redisClient.set("favoritesSum", 0);

  // loop through every tweet and add its favorite_count to the sum
  const cursor = tweets.find({}); // empty query to get all tweets
  for await (const tweet of cursor) {
    await redisClient.incrBy("favoritesSum", tweet.favorite_count || 0); // INCRBY adds the favorite count
  }

  // get the total from redis
  const total = await redisClient.get("favoritesSum");
  console.log(`Total number of favorites: ${total}`);

  // close the connections
  await redisClient.quit();
  await mongoClient.close();
}

//run main function
main();
