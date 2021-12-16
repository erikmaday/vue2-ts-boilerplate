import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

interface TimeObject {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const timeDifferenceToObject = (
  time1: dayjs.Dayjs,
  time2: dayjs.Dayjs
): TimeObject => {
  dayjs.extend(duration)
  let diff = time2.diff(time1)
  const multiplier = diff / Math.abs(diff)
  diff = diff * multiplier

  const days = dayjs.duration({ milliseconds: diff }).asDays()
  const hours = dayjs.duration({ days: days - Math.floor(days) }).asHours()
  const minutes = dayjs
    .duration({ hours: hours - Math.floor(hours) })
    .asMinutes()
  const seconds = dayjs
    .duration({ minutes: minutes - Math.floor(minutes) })
    .asSeconds()

  return {
    days: Math.floor(days) * multiplier,
    hours: Math.floor(hours) * multiplier,
    minutes: Math.floor(minutes) * multiplier,
    seconds: Math.floor(seconds) * multiplier,
  }
}

export const timeObjectToString = (timeObj: TimeObject): string => {
  let timeString = `${timeObj.hours}h ${timeObj.minutes}m`
  if (timeObj.days > 0) {
    timeString = `${timeObj.days}d ${timeString}`
  } else {
    timeString = `${timeString} ${timeObj.seconds}s`
  }
  return timeString
}
