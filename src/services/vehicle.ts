import { apiBaseUrl } from '@/utils/env'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters, TableViewResult } from '@/models/TableView'
import { Vehicle } from '@/models/dto/Vehicle'
import {
  ApiResult,
  DeleteVehiclePhotoPayload,
  VehicleDetailEntity,
} from '@/models/dto'
import vehicleDetail from '@/store/modules/vehicleDetail'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<TableViewResult<Vehicle>>> {
    const { sorts = null, filters = null, pageSize = 10, page = 1 } = params
    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query += `&${sorts}`
    }
    if (filters) {
      query += `&${filters}`
    }
    query = encodeURI(query)
    const host = apiBaseUrl()

    return httpService.get(`https://${host}/tables/vehicles?${query}`)
  },
  byId(vehicleId: number): Promise<AxiosResponse<VehicleDetailEntity>> {
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
    form: FormData
  ): Promise<AxiosResponse<boolean>> {
    const url = `https://${apiBaseUrl()}/v2/photos/vehicles/${vehicleId}/vehiclePhotos`
    const config = {
      onUploadProgress: (progressEvent: ProgressEvent) => {
        const uploadPercentage = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        )
        vehicleDetail.setUploadPercentage(uploadPercentage)
      },
    }
    return httpService.post<boolean, FormData>(url, form, config)
  },

  deletePhotos(
    vehicleId: number,
    vehiclePhotos: DeleteVehiclePhotoPayload
  ): Promise<AxiosResponse<boolean>> {
    const url = `https://${apiBaseUrl()}/v2/photos/vehicles/${vehicleId}/vehiclePhotos/remove`
    return httpService.post<boolean, DeleteVehiclePhotoPayload>(
      url,
      vehiclePhotos
    )
  },
}
