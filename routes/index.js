// IMPORT modules
const router = require('express').Router();
const apiRoutes = require('./api');

// MIDDLEWARE to use routes from ./api dir for path = .../api/
router.use('/api', apiRoutes);
// MIDDLEWARE to send res status 404 and message for all other routes
router.use((req, res) => {
  res.status(404).send('Oops! The requested route cannot be found.');
});

module.exports = router;
