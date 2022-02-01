import { Action, Module, Mutation, VuexModule } from 'vuex-class-modules'
import router from '@/router'
import {
  DeleteVehiclePhotoPayload,
  VehicleAmenityDTO,
  VehicleDetailEntity,
  VehiclePhotoDTO,
} from '@/models/dto'
import deepClone from '@/utils/deepClone'
import auth from './auth'
import vehicle from '@/services/vehicle'
import app from './app'
import { RawLocation } from 'vue-router'
import { removeItem } from '@/utils/array'

const NEW_VEHICLE: VehicleDetailEntity = {
  vehicleId: null,
  vehicleName: '',
  vehicleTypeName: '',
  vehicleTypeId: null,
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: null,
  passengerCapacity: null,
  vinNumber: '',
  licensePlate: '',
  garageId: null,
  garageName: '',
  companyId: null,
  vehicleAmenityDTOs: [],
  vehiclePhotoDTOs: [],
  active: false,
}

@Module({ generateMutationSetters: true })
class VehicleDetailModule extends VuexModule {
  // state
  routeName: string | null = null
  isModeAdd = false
  isModeEdit = false
  isModeView = false
  uploadPercentage = 0
  vehicleId: number | null = null
  vehicle: VehicleDetailEntity = NEW_VEHICLE
  notFound = false
  saving = false
  loading = true

  // getters
  get getRouteName(): string | null {
    return this.routeName
  }
  get getIsModeAdd(): boolean {
    return this.isModeAdd
  }
  get getIsModeEdit(): boolean {
    return this.isModeEdit
  }
  get getIsModeView(): boolean {
    return this.isModeView
  }
  get getUploadPercentage(): number {
    return this.uploadPercentage
  }
  get getVehicle(): VehicleDetailEntity {
    return this.vehicle
  }
  get getVehicleId(): number | null {
    return this.vehicleId
  }
  get getVehiclePhotos(): VehiclePhotoDTO[] {
    return this.vehicle?.vehiclePhotoDTOs || []
  }
  get getNotFound(): boolean {
    return this.notFound
  }
  get getSaving(): boolean {
    return this.saving
  }
  get getShowLoaders(): boolean {
    return this.loading && app.getAreLoadersEnabled
  }

  get getLastRoute(): RawLocation {
    const lastRoute = app.getLastRoute
    if (!app.getLastRoute?.name || app.getLastRoute?.name === 'vehicles.edit') {
      return { name: 'vehicles' }
    }
    return lastRoute
  }

  // mutations (mutations are autogenerated for each root level state field)
  @Mutation
  setVehicleAmenities(vehicleAmenities: VehicleAmenityDTO[]) {
    this.vehicle.vehicleAmenityDTOs = vehicleAmenities
  }
  @Mutation
  setVehiclePhotos(vehiclePhotos: VehiclePhotoDTO[]) {
    this.vehicle.vehiclePhotoDTOs = vehiclePhotos
  }
  @Mutation
  setPhotoDTOLabel(photo: VehiclePhotoDTO) {
    let foundPhoto = this.vehicle.vehiclePhotoDTOs.find(
      (p) => p.imagePath === photo.imagePath
    )
    if (foundPhoto) {
      foundPhoto = photo
    }
  }

  @Mutation
  setPhotoDTOPrimaryImage(photo: VehiclePhotoDTO) {
    for (const photo of this.vehicle.vehiclePhotoDTOs) {
      photo.primaryImage = false
    }

    const foundPhoto = this.vehicle.vehiclePhotoDTOs.find(
      (p) => p.imagePath === photo.imagePath
    )
    if (foundPhoto) {
      foundPhoto.primaryImage = true
    }
  }

  // actions  @Action
  @Action
  initialize(): void {
    this.vehicle = NEW_VEHICLE
    this.uploadPercentage = 0
    this.vehicleId = null
  }
  @Action
  async load(): Promise<void> {
    this.setUploadPercentage(0)
    if (this.isModeAdd) {
      this.initialize()
      const vehicle = deepClone(this.vehicle)
      if (vehicle) {
        vehicle.active = true
        vehicle.companyId = auth.getUser?.companyId || null
        this.setVehicle(vehicle)
      }
    } else {
      await this.fetchVehicle()
    }
  }
  @Action
  async fetchVehicle(): Promise<void> {
    this.loading = true
    try {
      if (this.vehicleId) {
        const response = await vehicle.byId(Number(this.vehicleId))
        const vehicleData = await processVehicle(response.data)
        this.setVehicle(vehicleData)
      } else {
        this.notFound = true
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
    }
    this.loading = false
  }
  @Action
  setRouteName(routeName: string): void {
    this.routeName = routeName
    this.isModeAdd = routeName === 'vehicles.add'
    this.isModeEdit = routeName === 'vehicles.edit'
    this.isModeView = routeName === 'vehicles.view'
  }
  @Action
  setUploadPercentage(percent: number) {
    this.uploadPercentage = percent
  }
  @Action
  setVehicle(vehicle: VehicleDetailEntity) {
    this.vehicle = vehicle
  }
  @Action
  setVehicleId(vehicleId: number | string | null) {
    if (typeof vehicleId === 'string') {
      vehicleId = parseInt(vehicleId)
    }
    this.vehicleId = vehicleId
  }
  @Action
  setSaving(saving: boolean) {
    this.saving = saving
  }
  @Action
  setAmenities(vehicleAmenities: VehicleAmenityDTO[]) {
    this.setVehicleAmenities(vehicleAmenities)
  }
  @Action
  setPhotos(vehiclePhotos: VehiclePhotoDTO[]) {
    this.setVehiclePhotos(vehiclePhotos)
  }
  @Action
  goBack(): void {
    if (!app.getLastRoute?.name || app.getLastRoute?.name === 'vehicles.edit') {
      router.push({ name: 'vehicles' })
    } else {
      router.push(app.getLastRoute)
    }
  }
  @Action
  beginEdit(): void {
    if (this.vehicleId) {
      router.push({
        name: 'vehicles.edit',
        params: { id: this.vehicleId.toString() },
      })
    }
  }
  @Action
  async setPhotoLabel(obj: {
    photo: VehiclePhotoDTO
    label: string
  }): Promise<void> {
    const photo = obj.photo
    photo.label = obj.label
    this.setPhotoDTOLabel(photo)
  }

  @Action
  async setPhotoAsPrimaryImage(photo: VehiclePhotoDTO): Promise<void> {
    this.setPhotoDTOPrimaryImage(photo)
  }

  @Action
  async uploadPhotos(): Promise<void> {
    if (this.vehicleId) {
      const newVehiclePhotos = buildNewPhotosPayload(
        this.vehicle.vehiclePhotoDTOs
      )
      if (newVehiclePhotos) {
        for (const form of newVehiclePhotos) {
          await vehicle.uploadPhotos(this.vehicleId, form)
        }
      }
    }
  }

  @Action
  async updateDefaultPhoto(): Promise<void> {
    if (!this.vehicleId) {
      return
    }
    const defaultPhoto = this.vehicle.vehiclePhotoDTOs.find(
      (p) => p.primaryImage
    )

    // If the defaultPhoto is a photo which still needs to be uploaded
    if (!defaultPhoto || defaultPhoto?.file || !defaultPhoto.active) {
      return
    }
    await vehicle.makeVehiclePhotoDefault(this.vehicleId, defaultPhoto)
  }

  @Action
  addPhotos(photos: VehiclePhotoDTO[]): void {
    const newPhotosList = deepClone(this.vehicle.vehiclePhotoDTOs)
    for (const photo of photos) {
      newPhotosList.push(photo)
    }
    this.setVehiclePhotos(newPhotosList)
  }
  @Action
  removePhoto(photo: VehiclePhotoDTO): void {
    photo.active = false
    if (photo.file) {
      let vehiclePhotoList = deepClone(this.getVehiclePhotos)
      vehiclePhotoList = removeItem(vehiclePhotoList, photo)
      this.setVehiclePhotos(vehiclePhotoList)
    }
  }
  @Action
  async updateVehicle(): Promise<void> {
    if (this.vehicleId) {
      try {
        const deletedPhotos = buildDeletePhotosPayload(this.vehicle)
        if (deletedPhotos.vehiclePhotoIds.length) {
          await vehicle.deleteVehiclePhotos(this.vehicleId, deletedPhotos)
        }
        await vehicle.update(this.vehicle)
        await this.updateDefaultPhoto()
        await this.uploadPhotos()
        router.push({
          name: 'vehicles.view',
          params: { id: this.vehicleId.toString() },
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
  @Action
  async addVehicle(): Promise<void> {
    try {
      // If there are vehiclePhotoDTOs and no primary image
      // is set, set the first photo to be the primary image.
      if (this.vehicle.vehiclePhotoDTOs?.length) {
        if (
          !this.vehicle.vehiclePhotoDTOs.filter((p) => p.primaryImage).length
        ) {
          this.vehicle.vehiclePhotoDTOs[0].primaryImage = true
        }
      }

      const vehicleResponse = await vehicle.create(this.vehicle)
      const vehicleId = vehicleResponse.data
      this.setVehicleId(vehicleId)
      await this.uploadPhotos()
      router.push({
        name: 'vehicles.view',
        params: { id: vehicleId.toString() },
      })
    } catch (e) {
      console.error(e)
    }
  }
}

//private helpers
const processVehicle = (vehicle: VehicleDetailEntity): VehicleDetailEntity => {
  if (vehicle && typeof vehicle.vehicleTypeId === 'string') {
    vehicle.vehicleTypeId = parseInt(vehicle.vehicleTypeId)
  }
  vehicle.vehicleAmenityDTOs = vehicle.vehicleAmenityDTOs.sort(
    (a, b) => a.amenityId - b.amenityId
  )
  return vehicle
}

const buildNewPhotosPayload = (
  vehiclePhotoDTOs: VehiclePhotoDTO[]
): FormData[] | null => {
  const forms = []
  for (const photo of vehiclePhotoDTOs) {
    if (photo?.file) {
      const form = new FormData()
      form.append('file', photo.file)
      form.append('label', photo.label)
      form.append('primaryImage', String(photo.primaryImage))
      forms.push(form)
    }
  }
  return forms.length ? forms : null
}

const buildDeletePhotosPayload = (
  vehicle: VehicleDetailEntity
): DeleteVehiclePhotoPayload => {
  const deletedPhotos = vehicle.vehiclePhotoDTOs
    .filter((photo) => !photo.active)
    .map((photo) => {
      return photo.vehiclePhotoId
    })
  return { vehiclePhotoIds: deletedPhotos }
}

// register module (could be in any file)
import store from '@/store/index'
export default new VehicleDetailModule({ store, name: 'vehicleDetail' })
