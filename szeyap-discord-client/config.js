
// This file is used to store configuration data for the application.
// This can include things like API keys, configuration settings, and more.
API_ENDPOINT = (process.env.NODE_ENV == "DEVELOPMENT" ? 'http://szeyap-api:8000' : 'https://szeyap-api-production.up.railway.app') + '/api';
RESULTS_PER_PAGE = 5;

module.exports = {
  API_ENDPOINT,
  RESULTS_PER_PAGE
}