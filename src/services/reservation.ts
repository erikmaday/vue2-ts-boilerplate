import { apiBaseUrl } from '@/utils/env'
import {
  ReservationTableViewResult,
  Reservation,
  ReservationDetailCommentPayload,
  ApiResult,
  ReservationDetail,
} from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'
import { TableViewParameters } from '@/models/TableView'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<ReservationTableViewResult>> {
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
    const url = `https://${host}/tables/reservations?${query}`
    return httpService.get(url)
  },
  byId(id: number): Promise<AxiosResponse<ReservationDetail>> {
    const host = apiBaseUrl()
    const url = `https://${host}/reservations/v2/${id}`
    return httpService.get(url)
  },
  addComment(
    payload: ReservationDetailCommentPayload
  ): Promise<AxiosResponse<number>> {
    const host = apiBaseUrl()
    const url = `https://${host}/reservations/${payload.reservation.id}/comments`
    return httpService.post<number, ReservationDetailCommentPayload>(
      url,
      payload
    )
  },
  accept(reservationId: number): Promise<AxiosResponse<ApiResult>> {
    const host = apiBaseUrl()
    const query = '?referralAcceptanceESignature='
    const url = `https://${host}/reservations/acceptReferral/${reservationId}${query}`
    return httpService.get(url)
  },
  reject(
    reservationId: number,
    rejectNote: string
  ): Promise<AxiosResponse<ApiResult>> {
    const host = apiBaseUrl()
    let query = `?notes=${rejectNote}`
    query = encodeURI(query)
    const url = `https://${host}/reservations/rejectReferral/${reservationId}${query}`
    return httpService.get(url)
  },

  sortForAvailability(
    reservations: Array<Reservation>
  ): Map<number, Array<Reservation>> {
    const result = reservations.reduce((map, res) => {
      if (res?.vehicleAssignments?.length) {
        for (const va of res.vehicleAssignments) {
          if (map.has(va.vehicleId)) {
            map.get(va.vehicleId).push(res)
          } else {
            map.set(va.vehicleId, [res])
          }
        }
      } else if (map.has(-1)) {
        map.get(-1).push(res)
      } else {
        map.set(-1, [res])
      }
      return map
    }, new Map())
    return result
  },
}
