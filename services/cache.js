const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl)

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function() {
  console.log('About to run a query');
  const query = this.getQuery();
  const cachedQuery = Object.assign({}, query, { collection: this.mongooseCollection.name })

  // const cachedResult = client.get(cachedQuery);
  // if (cachedResult) {
  //   return cachedResult;
  // }

  // client.selected_db()
  return exec.apply(this, arguments);
}
