export interface VehicleDetailEntity {
  vehicleId: number
  vehicleName: string
  vehiclePhotoDTOs: VehiclePhotoDTO[]
  vehicleTypeName: string
  vehicleTypeId: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  passengerCapacity: number
  vinNumber: string
  licensePlate: string
  garageId: number
  garageName: string
  companyId: number
  vehicleAmenityDTOs: VehicleAmenityDTO[]
  active: boolean
}

export interface VehicleAmenityDTO {
  amenityId: number
  amenityName: string
  isSupported: boolean
}

export interface VehiclePhotoDTO {
  vehiclePhotoId: number
  vehicleId: number
  imagePath: string
  primaryImage: boolean
  active: boolean
}
