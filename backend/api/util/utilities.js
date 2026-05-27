/**
 * Converts a duration in seconds to a human-readable `M:SS` string.
 *
 * @param {number} duration - Track duration in seconds.
 * @returns {string} Formatted time string (e.g. `3:07`).
 */
function secondsToMinutesFormatted(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = String(duration % 60).padStart(2, '0');

    const formattedTime = `${minutes}:${seconds}`;
    return formattedTime;
}

/**
 * Converts the duration in milliseconds to minutes in the 'M:SS' format
 * @param {number} duration - Track duration in milliseconds
 * @returns {string} Formatted time string (e.g '3:07')
 */
function millisecondsToMinutesFormatted(duration) {
    const totalSeconds = Math.floor(Number(duration) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}

export { secondsToMinutesFormatted, millisecondsToMinutesFormatted };