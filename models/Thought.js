// IMPORT Schema and model constructor method from mongoose
const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
// UTIL for formatting date:
const { formatTimestamp } = require('./helpers');

// SCHEMA to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date, // TODO: Contemplate using a helper or util/library
      default: Date.now,
      // Getter method to format timestamp on query
      // https://mongoosejs.com/docs/tutorials/getters-setters.html
      get: formatTimestamp, // TODO: confirm this work?
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;