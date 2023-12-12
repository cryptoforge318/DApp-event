import { TruncateParams } from './type.dt'

export function getExpiryDate(timestamp: number) {
  const currentDate = Date.now()
  const diffInMilliseconds = timestamp - currentDate
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return `Expires in ${diffInDays} days`
}

export const truncate = ({ text, startChars, endChars, maxLength }: TruncateParams): string => {
  if (text.length > maxLength) {
    let start = text.substring(0, startChars)
    let end = text.substring(text.length - endChars, text.length)
    while (start.length + end.length < maxLength) {
      start = start + '.'
    }
    return start + end
  }
  return text
}
