// RedisQuery5: Create a structure that lets you get all the tweets for a specific user

// uses lists for each screen_name and hashes for each tweets data

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


  // go through all tweets
  const cursor = tweets.find({});
  for await (const tweet of cursor) {
    const screenName = tweet.user.screen_name;
    const tweetId = tweet.id_str; // use id_str to avoid javascript precision issues with big numbers

    // add the tweet id to the users list
    await redisClient.rPush(`tweets:${screenName}`, tweetId);

    // create a hash for each tweet with its attributes
    await redisClient.hSet(`tweet:${tweetId}`, {
      user_name: screenName,
      text: tweet.text || "", // fallback to empty string if text is missing
      created_at: tweet.created_at || "",
      retweet_count: String(tweet.retweet_count || 0), // redis hash values are strings
      favorite_count: String(tweet.favorite_count || 0), //do 0 if missing
    });
  }

  console.log("Done creating tweet lists and hashes.");


  // demonstrate by looking up a sample user
  const sampleUser = "duto_guerra";
  const tweetIds = await redisClient.lRange(`tweets:${sampleUser}`, 0, -1); // lRangegets all elements in the list
  console.log(`\nTweets for ${sampleUser}: ${tweetIds.length} tweet(s)`);
  console.log("Tweet IDs:", tweetIds);

  // show the first tweets data from the hash
  if (tweetIds.length > 0) {
    const tweetData = await redisClient.hGetAll(`tweet:${tweetIds[0]}`); // hGetAll gets all fields in the hash
    console.log(`\nTweet data for tweet:${tweetIds[0]}:`);
    console.log(tweetData);
  }

  // close the connections
  await redisClient.quit();
  await mongoClient.close();
}


//run main function
main();
