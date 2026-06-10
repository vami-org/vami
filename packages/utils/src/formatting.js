/**
 * Truncates text to a specified length and adds ellipses.
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text || "";
  return text.substring(0, length).trim() + "...";
}
