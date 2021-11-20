export enum VehicleTypeKeys {
  CHARTER_BUS = 'charter_bus',
  MINI_BUS = 'mini_bus',
  SPRINTER = 'sprinter',
  PARTY_BUS = 'party_bus',
  SEDAN = 'sedan',
  SUV = 'suv',
  LIMOUSINE = 'limousine',
  TROLLEY = 'Trolley',
  SCHOOL_BUS = 'school_bus',
}

export type VehicleType = {
  id: number
  key: VehicleTypeKeys
  label?: string
  description?: string
}
