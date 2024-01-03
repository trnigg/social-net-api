// SCHEMA ONLY
// IMPORT Types for additional schema types
const { Schema, Types } = require('mongoose');
const { formatTimestamp } = require('./helpers');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      // Default to create a new ObjectId
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date, // TODO: Contemplate using a helper or util/library
      default: Date.now,
      // Getter method to format timestamp on query
      // https://mongoosejs.com/docs/tutorials/getters-setters.html
      get: formatTimestamp, // TODO: confirm this work?
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

module.exports = reactionSchema;
