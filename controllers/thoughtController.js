// IMPORT User and Thought models
const { User, Thought } = require('../models');

// EXPORT object with methods for thoughtRoutes

module.exports = {
  // METHODS for /api/thoughts
  // GET all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  async getOneThought(req, res) {
    // (/api/thoughts/:thoughtId)
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      res.json(thought);
    } catch (error) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // POST to create a new thought
  async createThought(req, res) {
    try {
      // create new thought
      const thought = await Thought.create(req.body);
      // find user with matching userId in req body and push thought to that user's array of thoughts
      await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        // return updated data
        { new: true }
      );
      // return status 201 to indicate resource (thought) was "created"
      res.status(201).json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // PUT to update a thought by its _id
  async updateThought(req, res) {
    // (/api/thoughts/:thoughtId)
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        req.body,
        // Return new data and run validation on update
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought was found with that ID' });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // DELETE to remove a thought by its _id
  async deleteThought(req, res) {
    // (/api/thoughts/:thoughtId)
    try {
      // find relevant thought
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought was found with that ID' });
      }
      // find the user who the thought belonged to, remove same thought from the user's array of thoughts
      // I suppose  this extra step is one of the downsides of NoSQL DB?
      await User.findOneAndUpdate(
        { _id: thought.userId },
        { $pull: { thoughts: thought._id } },
        // Return new/updated data - don't need validation was we are simply pulling from an array
        { new: true }
      );
      res.json({ message: 'Thought deleted.' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // POST to create a reaction stored in a single thought's reactions array field
  async createReaction(req, res) {
    ///api/thoughts/:thoughtId/reactions
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought was found with that ID' });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // DELETE to pull and remove a reaction by the reaction's reactionId value
  async removeReaction(req, res) {
    // /api/thoughts/:thoughtId/reactions
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        // return updated document
        { new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought was found with that ID' });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
