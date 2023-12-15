import { TruncateParams } from './type.dt'

export function getExpiryDate(timestamp: number) {
  const currentDate = Date.now()
  const diffInMilliseconds = timestamp - currentDate
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return diffInDays
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

export function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  }
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
  return formattedDate
}

export function calculateDateDifference(startTimestamp: number, endTimestamp: number) {
  const diffInMs = Math.abs(endTimestamp - startTimestamp)

  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  if (diffInDays > 0) {
    return `${diffInDays} day(s)`
  }

  const diffInHours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24)
  const diffInMinutes = Math.floor((diffInMs / (1000 * 60)) % 60)
  const diffInSeconds = Math.floor((diffInMs / 1000) % 60)

  return `${diffInHours} hour(s), ${diffInMinutes} minute(s), ${diffInSeconds} second(s)`
}

export function timestampToDatetimeLocal(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // months are 0-indexed in JavaScript
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}
