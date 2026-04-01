const bookingExpirationJob = require('./bookingExpiration.job');

const startJobs = () => {
  console.log("⏰ Starting background jobs...\n");

  bookingExpirationJob();
};

module.exports = startJobs;