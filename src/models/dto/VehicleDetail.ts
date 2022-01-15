export interface VehicleDetailEntity {
  vehicleId: number | null
  vehicleName: string
  vehiclePhotoDTOs: VehiclePhotoDTO[]
  vehicleTypeName: string
  vehicleTypeId: string | number | null
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number | null
  passengerCapacity: number | null
  vinNumber: string
  licensePlate: string
  garageId: number | null
  garageName: string
  companyId: number | null
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
  file?: File
  label: string
}

export interface DeleteVehiclePhotoPayload {
  vehiclePhotoIds: number[]
}
