// IMPORT User and Thought models
const { User, Thought } = require('../models');

// EXPORT an object with methods for  userRoutes to use
module.exports = {
  // METHODS for /api/users
  // GET all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // GET a single user by its _id and populated thought and friend data
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }) // (/api/users/:userId)
        .populate({
          path: 'thoughts',
          // Note below field is excluded from the response - only serves for optimisticConcurrency / versioning
          select: '-__v',
        })
        .populate({
          path: 'friends',
          select: '-__v',
        })
        .select('-__v');
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user was found with that ID' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // PUT to update a user by its _id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user was found with that ID' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // DELETE to remove user by its _id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user was found with that ID' });
      }
      // Remove a user's associated thoughts when deleted - BONUS
      await Thought.deleteMany({ _id: { $in: user.thoughts } });

      res.json({ message: 'User and associated thoughts deleted.' });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // METHODS ofr /api/users/:userId/friends/:friendId

  // POST to add a new friend to a user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // $addToSet adds data to an array if it doesn't already exist
        { $addToSet: { friends: req.params.friendId } },
        // Return updated doc and run validation on update
        { new: true, runValidators: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user was found with that ID' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // DELETE to remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        // $pull removes instances of data from an array
        { $pull: { friends: req.params.friendId } },
        // return updated doc
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user was found with that ID' });
      }
      res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
