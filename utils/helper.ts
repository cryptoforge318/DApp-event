export function getExpiryDate(timestamp: number) {
  const currentDate = Date.now()
  const diffInMilliseconds = timestamp - currentDate
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return `Expires in ${diffInDays} days`
}
