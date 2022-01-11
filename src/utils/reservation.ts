import { Reservation } from "@/models/dto";
import dayjs from 'dayjs'

export const getReservationLocalStartDatetime = (
  reservation: Reservation
): string => {
  if (reservation.trip.garageTimes?.departureTime) {
    const garageTimeZone =
      reservation.trip.garageTimes.garage?.address?.timeZone
    return dayjs(reservation.trip.garageTimes.departureTime)
      .tz(garageTimeZone)
      .format('YYYY-MM-DD')
  } else if (reservation.trip.stops[0].pickupDatetime) {
    const pickupDatetime = reservation.trip.stops[0].pickupDatetime
    const localTimeZone = reservation.trip.stops[0].address.timeZone
    return dayjs(pickupDatetime).tz(localTimeZone).format('YYYY-MM-DD')
  } else {
    const localTimeZone = reservation.trip.stops[0].address.timeZone
    return dayjs(reservation.trip.startDate)
      .tz(localTimeZone)
      .format('YYYY-MM-DD')
  }
}

export const getReservationLocalEndDatetime = (reservation: Reservation): string => {
  const firstStopTimeZone = reservation.trip.stops[0].address.timeZone
  if (reservation.trip.garageTimes?.returnTime) {
    const returnGarageTimeZone = reservation.trip.garageTimes.returnGarage?.address?.timeZone
    return dayjs(reservation.trip.garageTimes.departureTime)
      .tz(returnGarageTimeZone)
      .format('YYYY-MM-DD')
  } else if (
    reservation.trip.stops[reservation.trip.stops.length - 1].dropoffDatetime
  ) {
    const lastStop = reservation.trip.stops[reservation.trip.stops.length - 1]
    const dropoffDatetime = lastStop.dropoffDatetime
    const timeZone = lastStop.address.timeZone
    return dayjs(dropoffDatetime).tz(timeZone).format('YYYY-MM-DD')
  } else if (reservation.trip.endDate) {
    return dayjs(reservation.trip.endDate)
      .tz(firstStopTimeZone)
      .format('YYYY-MM-DD')
  } else {
    return dayjs(reservation.trip.startDate)
      .tz(firstStopTimeZone)
      .format('YYYY-MM-DD')
  }
}

export const getReservationFirstStopCity = (reservation: Reservation): string => {
  const { city } = reservation.trip.stops[0].address
  return city
}

export const getReservationLastStopCity = (reservation: Reservation): string => {
  const { city } = reservation.trip.stops[reservation.trip.stops.length - 1].address
  return city
}
