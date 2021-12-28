import { apiBaseUrl } from '@/utils/env'
import {
  TableViewParameters,
  ReservationTableViewResult,
  Reservation,
  ReservationDetailCommentPayload,
  ApiResult,
} from '@/models/dto'
import { HttpService } from '@/services/common/HttpService'
import { AxiosResponse } from 'axios'

const httpService: HttpService = new HttpService()

export default {
  tableView(
    params: TableViewParameters
  ): Promise<AxiosResponse<ReservationTableViewResult>> {
    const { sorts, filters, pageSize = 10, page = 1 } = params

    let query = `page=${page}&pageSize=${pageSize}`
    if (sorts) {
      query += `&${sorts}`
    }
    if (filters) {
      query += `&${filters}`
    }
    query = encodeURI(query)
    const host = apiBaseUrl()
    const url = `https://${host}/tables/referrals?${query}`
    return httpService.get(url)
  },
  byId(id: number): Promise<AxiosResponse<Reservation>> {
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
  reject(reservationId: number): Promise<AxiosResponse<ApiResult>> {
    const host = apiBaseUrl()
    let query = '?notes='
    query = encodeURI(query)
    const url = `https://${host}/reservations/rejectReferral/${reservationId}${query}`
    return httpService.get(url)
  },

  sortForAvailability(
    reservations: Array<Reservation>
  ): Map<any, Array<Reservation>> {
    const result = reservations.reduce(function (map, obj) {
      if (obj?.vehicleAssignments?.length) {
        obj.vehicleAssignments.forEach(va => {
          if (map.has(va.vehicleId)) {
            map.get(va.vehicleId).push(obj)
          } else {
            map.set(va.vehicleId, [obj])
          }
        })
      } else {
        if (map.has('unassigned')) {
          map.get('unassigned').push(obj)
        } else {
          map.set('unassigned', [obj])
        }
      }
      return map
    }, new Map())
    return result
  },
}
