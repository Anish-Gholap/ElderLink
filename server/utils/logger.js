/**
 * Log informational messages to the console.
 * @param {...any} params - The messages or data to log.
 */
const info = (...params) => {
    console.log(...params)
}

/**
 * Log error messages to the console.
 * @param {...any} params - The error messages or data to log.
 */
const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info,
    error
}