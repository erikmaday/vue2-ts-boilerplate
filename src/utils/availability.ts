import { AvailabilityBlock, VehicleBlockItem } from '@/models/dto/Availability'

export const sortAvailabilityBlocksByVehicle = (
  reservations: AvailabilityBlock[]
): Record<number, VehicleBlockItem> => {
  
  const reduceFn = (
    map: Record<number, VehicleBlockItem>,
    res: AvailabilityBlock
  ): Record<number, VehicleBlockItem> => {
    if (res.vehicleAssignments?.length) {
      for (const va of res.vehicleAssignments) {
        if (!map[va.vehicleId]) {
          const newVehicleItem: VehicleBlockItem = {
            blocks: [],
            vehicle: va.vehicle,
          }
          map[va.vehicleId] = newVehicleItem
        }
        map[va.vehicleId].blocks.push(res)
      }
    } else {
      if (!map[-1]) {
        map[-1] = {
          blocks: [],
          vehicle: 'unassigned',
        }
      }
      map[-1].blocks.push(res)
    }
    return map
  }

  const result = reservations.reduce(reduceFn, {})
  return result
}

export const AVAILABILITY_ROW_HEIGHT = 60
