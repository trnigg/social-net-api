// IMPORT modules
const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');

// SET PORT to env variable (for productions), if not, then 3001 for dev env.
const PORT = process.env.PORT || 3001;
// INSTANTIATE express app
const app = express();

// MIDDLEWARE functions
// PARSE payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// USE routes defined in ./routes
app.use(routes);

// EVENT LISTENER for db connection - once connected => start server => log status and location
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server live at http://localhost:${PORT}/`);
  });
});
