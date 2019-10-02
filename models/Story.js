const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  objectID: String,
  created_at: Date,
  story_title: String,
  title: String,
  story_url: String,
  url: String,
  author: String,
  deleted: Boolean
});

module.exports = Story = mongoose.model('story', ItemSchema);
