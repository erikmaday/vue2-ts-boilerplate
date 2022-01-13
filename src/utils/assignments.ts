import { AssignmentStops, RequiredVehicleType, Trip, VehicleAssignment } from "@/models/dto"
import deepClone from "./deepClone"

export const emptyAssignmentObj: Record<string, unknown> = {
  vehicleAssignmentId: null,
  vehicle: {
    vehicleId: null,
    name: null,
    errors: [],
  },
  driverAssignments: [
    {
      tripAssignmentId: null,
      driver: {
        userId: null,
        name: null,
        errors: [],
      },
    },
  ],
}

export function buildModel(
  vehicleAssignments: VehicleAssignment[],
  requiredVehicles: RequiredVehicleType[],
  driverCount = 0
): any {
  const UNASSIGNED_VEHICLE_TYPE_ID = 99

  if (!requiredVehicles?.length) return []
  const model = []

  // Build the empty model, unpopulated with existing trip assignments
  requiredVehicles.map((vehicleType) => {
    for (let i = 0; i < vehicleType.quantity; i++) {
      const newEmptyAssignment = deepClone(emptyAssignmentObj)
      newEmptyAssignment.vehicleTypeId = vehicleType.vehicleType.id
      newEmptyAssignment.vehicleTypeLabel = vehicleType.vehicleType.label
      model.push(newEmptyAssignment)
    }
  })

  // For each existing assignment, find an
  // empty object in the model with the same vehicleType
  // to populate
  vehicleAssignments.map((assignment) => {
    let createNewAssignment = false
    let emptyAssignment

    if (
      assignment.vehicleTypeId === UNASSIGNED_VEHICLE_TYPE_ID ||
      (assignment?.vehicle?.vehicleName &&
        assignment?.vehicle?.vehicleName.toLowerCase() === 'vehicle unassigned')
    ) {
      emptyAssignment = model.find((obj) => !obj.vehicleAssignmentId)
    } else {
      emptyAssignment = model.find(
        (obj) =>
          Number(obj.vehicleTypeId) === Number(assignment.vehicleTypeId) &&
          !obj.vehicleAssignmentId
      )
    }

    if (!emptyAssignment) {
      emptyAssignment = deepClone(emptyAssignmentObj)
      emptyAssignment = {
        ...emptyAssignment,
        vehicleTypeId: assignment.vehicleTypeId,
        vehicleTypeLabel: assignment.vehicleTypeLabel,
      }
      createNewAssignment = true
    }

    emptyAssignment.vehicleAssignmentId = assignment.tripAssignmentId
    emptyAssignment.vehicle = assignment.vehicle
    emptyAssignment.vehicle.name = `${assignment.vehicle.vehicleName} ${assignment.vehicle.vehicleModel}`

    const driverAssignments = assignment.driverAssignments.map((driver) => {
      driver.driver.name =
        driver.driver.firstName + ' ' + driver.driver.lastName
      return driver
    })

    if (driverAssignments.length) {
      emptyAssignment.driverAssignments = driverAssignments
    }

    if (createNewAssignment) {
      model.push(emptyAssignment)
    }
  })

  const currentDriverCount = model.reduce(
    (prev, curr) => prev + curr.driverAssignments.length,
    0
  )
  const driversToAdd = driverCount - currentDriverCount
  if (driversToAdd > 0 && model.length) {
    for (let i = 0; i < driversToAdd; i++) {
      model[i % model.length].driverAssignments.push({
        tripAssignmentId: null,
        driver: {
          userId: null,
          name: null,
          errors: [],
        },
      })
    }
  }

  return model
}

export const buildFirstAndLastStops = (
  trip: Trip,
  reservationId: number
): AssignmentStops => {
  const { stops } = trip
  if (!stops?.length) return {}
  let payload: AssignmentStops = {
    reservationId,
  }

  const firstStop = stops[0]
  const lastStop = stops[stops.length - 1]

  if (firstStop?.address?.addressId) {
    firstStop.addressId = firstStop.address.addressId
  }

  if (lastStop?.address?.addressId) {
    lastStop.addressId = lastStop.address.addressId
  }

  const firstStopId = firstStop.stopId
  const lastStopId = lastStop.stopId
  const firstAddressId = trip.garageTimes?.garage?.address?.addressId
  const lastAddressId = trip.garageTimes?.returnGarage?.address?.addressId

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!firstAddressId) {
    payload = { ...payload, firstAddressId }
  } else {
    payload = { ...payload, firstStopId, firstStop }
  }

  // eslint-disable-next-line no-extra-boolean-cast
  if (!!lastAddressId) {
    payload = { ...payload, lastAddressId }
  } else {
    payload = { ...payload, lastStopId, lastStop }
  }

  return payload
}
