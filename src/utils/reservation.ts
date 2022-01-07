import { AvailabilityBlock } from "@/models/Availability";
import { Reservation } from "@/models/dto";

export const getReservationStartDatetime = (
  reservation: Reservation
): string => {
  if (reservation.trip.garageTimes?.departureTime) {
    return String(reservation.trip.garageTimes?.departureTime)
  } else if (reservation.trip.stops[0].pickupDatetime) {
    return reservation.trip.stops[0].pickupDatetime
  } else {
    return reservation.trip.startDate
  }
}

export const getReservationEndDatetime = (reservation: Reservation): string => {
  if (reservation.trip.garageTimes?.returnTime) {
    return String(reservation.trip.garageTimes?.returnTime)
  } else if (
    reservation.trip.stops[reservation.trip.stops.length - 1].dropoffDatetime
  ) {
    return reservation.trip.stops[reservation.trip.stops.length - 1].dropoffDatetime
  } else if (reservation.trip.endDate) {
    return reservation.trip.endDate
  } else {
    return reservation.trip.startDate
  }
}

export const getReservationFirstStopCityState = (reservation: Reservation): string => {
  const { city, state } = reservation.trip.stops[0].address
  return `${city}, ${state}`
}

export const getReservationLastStopCityState = (reservation: Reservation): string => {
  const { city, state } = reservation.trip.stops[reservation.trip.stops.length - 1].address
  return `${city}, ${state}`
}

export const convertReservationToAvailabilityBlock = (reservation: Reservation): AvailabilityBlock => {
  const startDatetime = getReservationStartDatetime(reservation)
  const endDatetime = getReservationEndDatetime(reservation)
  const firstStop = getReservationFirstStopCityState(reservation)
  const lastStop = getReservationLastStopCityState(reservation)
  const isMultiStop = reservation.trip.stops.length > 1

  const availabilityReservation: AvailabilityBlock = {
    reservationId: reservation.reservationId,
    vehicleAssignments: reservation.vehicleAssignments || [],
    startDatetime,
    endDatetime,
    firstStop,
    lastStop,
    isMultiStop,
  }

  return availabilityReservation
}
