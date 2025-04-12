require('dotenv').config()
/**
 * The port number on which the server will run.
 * Retrieved from the environment variables.
 * @type {string|undefined}
 */
const PORT = process.env.PORT
/**
 * The MongoDB connection URI.
 * Uses a different URI for the test environment if `NODE_ENV` is set to 'test'.
 * @type {string|undefined}
 */
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI

module.exports = {
    MONGODB_URI,
    PORT
}