const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
const Schema = mongoose.Schema;

const attachmentsSchema = new Schema({
  text: String,
  link: String,
  imageLink: String,
  video: String,
  audio: String,
});

const eventSchema = new Schema({
  id: String,
  title: String,
  startTime: String,
  attachments: [attachmentsSchema]
});

const storySchema = new Schema({
  editor: { type: Schema.Types.ObjectId, ref: 'Editor' },
  title: String,
  map: String,
  tagLine: String,
  duration: String,
  events:[eventSchema],//[{ type: Schema.Types.ObjectId, ref: 'Event' }]
});

const Story = mongoose.model('Story', storySchema);



Story.getAllStories = () => {
  return Story
      .find()
      .populate({path: 'editor', select: 'name avatar'})
      .select('editor title tagLine'); //id is returned by default
};

Story.getStoriesByTitle = (query) => {
  return Story
    .find({'title' : new RegExp(query, 'gi')})
    .populate({path: 'editor', select: 'name avatar'})
    .select('editor title tagLine');
};


Story.getStoriesByEditor = (id) => {
  return Story
    .find({'editor' : new ObjectId(id)})
    .populate({path: 'editor', select: 'name avatar'})
    .select('editor title tagLine');
};


Story.findStory = (storyId) => {
  return Story.findOne({_id : storyId})
              .populate({path: 'editor', select: 'name avatar'});
};


Story.createStory = (newStory) => {
  return newStory.save();
};

Story.editStory = (storyId, updatedProps) => {
  return Story
    .findOneAndUpdate({_id : storyId}, {$set: updatedProps});
};


module.exports = Story;
