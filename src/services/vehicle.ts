import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Vehicle } from '@/models/dto/Vehicle'
import { VehicleResult } from '@/models/dto/VehicleResult'
import { ApiResult, VehicleDetailEntity } from '@/models/dto'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Vehicle>>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params
    return httpService.get(
      `https://${apiBaseUrl()}/tables/vehicles?${
        (pageSize ? `pageSize=${pageSize}` : '') +
        (page ? `&page=${page}` : '') +
        (sorts ? `&${sorts}` : '') +
        (filters ? `&${filters}` : '')
      }`
    )
  },
  byId(vehicleId: number): Promise<AxiosResponse<VehicleResult>> {
    return httpService.get(`https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`)
  },
  create(vehicle: VehicleDetailEntity): Promise<AxiosResponse<number>> {
    return httpService.post(`https://${apiBaseUrl()}/v2/vehicles`, vehicle)
  },
  update(vehicle: VehicleDetailEntity): Promise<AxiosResponse<void>> {
    return httpService.put(
      `https://${apiBaseUrl()}/v2/vehicles/${vehicle.vehicleId}`,
      vehicle
    )
  },
  delete(vehicleId: number): Promise<AxiosResponse<ApiResult>> {
    return httpService.delete(
      `https://${apiBaseUrl()}/v2/vehicles/${vehicleId}`
    )
  },
  uploadPhotos(
    vehicleId: number,
    form: FormData,
    boundObject: any = {}
  ): Promise<AxiosResponse<boolean>> {
    const url = `https://${apiBaseUrl()}/v2/photos/vehicles/${vehicleId}/vehiclePhotos`
    const uploadProgressFunction = (progressEvent: any): void => {
      const uploadPercentage = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      )
      console.log(uploadPercentage)
      return
    }
    const config = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const uploadPercentage = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        boundObject.uploadPercentage = uploadPercentage
      },
      onUploadSuccess: (progressEvent: ProgressEvent) {
        console.log(progressEvent)
      }
    }
    return httpService.post<boolean, FormData>(url, form, config)
  },

  deletePhotos(
    vehicleId: number,
    vehiclePhotos: { vehiclePhotoId: number }[]
  ): Promise<AxiosResponse<boolean>> {
    const url = `https://${apiBaseUrl()}/v2/photos/vehicles/${vehicleId}/vehiclePhotos/remove`
    return httpService.post<boolean, { vehiclePhotoId: number }[]>(
      url,
      vehiclePhotos
    )
  },
}
