import { Address, VehicleDetailEntity } from '.'

export interface Journey {
  journeyId: number
  driver: JourneyDriver
  vehicle: VehicleDetailEntity
  stops: JourneyStopStop[]
  journeyStops: JourneyStop[]
  odometryReadingAtStart: null
  odometryReadingAtFinish: null
  startDatetime: string
  finishDatetime: string
  startLat: number
  startLng: number
  finishLat: number
  finishLng: number
  switched: boolean
  started: boolean
  finished: boolean
  onRoad: boolean
  reservationId: number
}

export interface JourneyDriver {
  firstName: string
  lastName: string
  email: string
  groupName: null
  companyName: null
  groupId: number
  companyId: number
  linkedAccountProfileId: null
  applicationId: number
  locale: string
  driverInfoDTO: null
  driverInfo: JourneyDriverInfo
  userPhotoDTOs: null
  active: boolean
  isSDR: boolean
  isRA: boolean
}

export interface JourneyDriverInfo {
  phoneNumber: number
  licenseNumber: number
  licensState: string
  licenseExpirationMonth: number
  licenseExpirationYear: number
  drugTestNumber: null
  drugTestExpiration: string
  notes: string
  driverSupportedVehiclesDTO: null
  driverSupportedVehicles: any[]
  phone: number
}

export interface JourneyStop {
  journeyStopId: number
  stop: JourneyStopStop
  reached: boolean
  appVersion: string
  automatedCompletion: boolean
}

export interface JourneyStopStop {
  stopId: number
  tripId: number
  orderIndex: number
  notes: null
  address: Address
  pickUpDateTime: null | string
  dropOffDateTime: null | string
  active?: boolean
  reached?: boolean
  reachedTimeStamp?: string
}
