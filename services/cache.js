const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get)

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {

  const key = JSON.stringify(Object.assign({}, this.getQuery(), 
    { collection: this.mongooseCollection.name }
  ));
  
  const cachedResult = await client.get(key);
  
  if (cachedResult) {
    const doc = JSON.parse(cachedResult);

    return Array.isArray(doc) ? 
      doc.map(d => new this.model(d)) :
      new this.model(doc)
  }

  const result = await exec.apply(this, arguments);
  await client.set(key, JSON.stringify(result));
  return result;
}
