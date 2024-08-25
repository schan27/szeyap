
// This file is used to store configuration data for the application.
// This can include things like API keys, configuration settings, and more.
API_ENDPOINT = (process.env.NODE_ENV == "DEVELOPMENT" ? 'http://szeyap-api:8000' : 'https://szeyap-api-production.up.railway.app') + '/api';
RESULTS_PER_PAGE = 5;

ROMANIZATION_SYSTEMS = {
  "HSR": "Hoisan Sauce",
  "SL": "Stephen Li",
  "GC": "Gene Chin",
  "DJ": "Deng Jun",
  "JW": "Jade Wu"
}

module.exports = {
  API_ENDPOINT,
  RESULTS_PER_PAGE,
  ROMANIZATION_SYSTEMS
}