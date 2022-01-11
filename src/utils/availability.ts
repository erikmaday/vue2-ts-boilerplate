import {
  AvailabilityBlock,
  DriverBlockItem,
  VehicleBlockItem,
} from '@/models/dto/Availability'
import dayjs from 'dayjs';
import Quadtree from '@timohausmann/quadtree-js';
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

export const sortAvailabilityBlocksByDriver = (
  reservations: AvailabilityBlock[]
): Record<number, DriverBlockItem> => {
  
  const reduceFn = (
    map: Record<number, DriverBlockItem>,
    res: AvailabilityBlock
  ): Record<number, DriverBlockItem> => {
    if (res.vehicleAssignments?.length) {
      for (const va of res.vehicleAssignments) {
        if (va.driverAssignments) {
          for (const da of va.driverAssignments) {
            if (!map[da.userId]) {
              const newDriverItem: DriverBlockItem = {
                blocks: [],
                driver: da.driver,
              }
              map[da.userId] = newDriverItem
            }
            map[da.userId].blocks.push(res)
          }
        }
      }
    } else {
      if (!map[-1]) {
        map[-1] = {
          blocks: [],
          driver: {
            firstName: 'Unassigned', 
            lastName: '', 
            userId: -1
          },
        }
      }
      map[-1].blocks.push(res)
    }
    return map
  }

  const result = reservations.reduce(reduceFn, {})
  return result
}

const getCoordinatesForBlocks = (blocks, startOfWeek, endOfWeek) => {
  // const boundingArea = new Box(0, 0, 1000, 1000)
  // const quadtree = new QuadTree(boundingArea)


  for (const block of blocks) {
    // let startDate = dayjs(block.startDate)
    // let endDate = dayjs(block.endDate)
    // if (startDate.isBefore(startOfWeek, 'day')) {
    //   startDate = startOfWeek
    // }
    // if (endDate.isAfter(endOfWeek, 'day')) {
    //   endDate = endOfWeek
    // }


    // let attemptedRow = 0
    // const startDay: number = startDate.day()
    // const endDay: number = endDate.day()
    // let width = startDay - endDay + 1

    // const attemptedBox = new Box(startDay, attemptedRow, width, 1)

    


  }
}

export const AVAILABILITY_ROW_HEIGHT = 60
