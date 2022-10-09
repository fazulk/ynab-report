export function formatAsDollars(number) {
  return Math.round((number / 100).toFixed(2))
}
