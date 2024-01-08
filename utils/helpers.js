// REQUIRED third-party module
const { format } = require('date-fns');

// https://date-fns.org/v3.1.0/docs/format
// FOR GETTERS
module.exports = {
  formatTimestamp: (timestamp) => {
    return format(timestamp, "do 'of' MMM, yyyy 'at' hh:mm a");
  },
};
