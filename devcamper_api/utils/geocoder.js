const NodeGeocoder = require('node-geocoder');

/* Я хуй знает почему без этого
 * нормально не робят process.env.* */
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const options = {
    provider: process.env.GEOCODER_PROVIDER,
    hhtpAdapter: 'https',

    // Optional depending on the providers
    apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
