import { VehicleType } from '@/models/dto'
import { CreateRatePayload, RateTableRow } from '@/models/dto/Rate'
import deepClone from './deepClone'

export const buildAddRatePayload = (
  row: RateTableRow,
  companyId: number,
  marketId: number
): CreateRatePayload[] => {
  const newRates = [
    {
      lowRate: row.dailyRate.value,
      highRate: row.dailyRate.value,
      marketRateType: 'Daily Rate',
      marketRateTypeKey: 'daily_rate',
    },
    {
      lowRate: row.hourlyRate.value,
      highRate: row.hourlyRate.value,
      hourlyMinimum: row.hourlyMinimum.value,
      marketRateType: 'Hourly Rate',
      marketRateTypeKey: 'hourly_rate',
    },
    {
      lowRate: row.mileageRate.value,
      highRate: row.mileageRate.value,
      marketRateType: 'Mileage Rate',
      marketRateTypeKey: 'mileage',
    },
    {
      lowRate: row.deadMileRate.value,
      highRate: row.deadMileRate.value,
      marketRateType: 'Dead Mile Rate',
      marketRateTypeKey: 'deadmile',
    },
    {
      lowRate: row.transferRate.value,
      highRate: row.transferRate.value,
      marketRateType: 'Transfer Rate',
      marketRateTypeKey: 'transfer_rate',
    },
  ]

  return newRates.map((newRate) => {
    return {
      ...newRate,
      vehicleTypeKey: row.vehicleType,
      marketId,
      companyId,
      marketplace: 1,
      vehicleId: null,
    }
  })
}

export const getMarketRateIdsForRow = (row: RateTableRow): number[] => {
  if (!row || typeof row !== 'object') return []
  let ids = Object.values(row)
    .filter((r) => typeof r === 'object')
    .filter((r) => !!r.marketRateId)
    .map((r) => r.marketRateId)
  ids = [...new Set(ids)] // Remove duplicates
  return ids
}

export const buildUpdateRatePayload = (
  row: RateTableRow,
  companyId: number,
  marketId: number,
  vehicleTypeKey: string
): CreateRatePayload[] => {
  const newRates = [
    {
      lowRate: row.dailyRate.value,
      highRate: row.dailyRate.value,
      marketRateId: row.dailyRate.marketRateId,
      marketRateType: 'Daily Rate',
      marketRateTypeKey: 'daily_rate',
    },
    {
      lowRate: row.hourlyRate.value,
      highRate: row.hourlyRate.value,
      hourlyMinimum: row.hourlyMinimum.value,
      marketRateId: row.hourlyRate.marketRateId,
      marketRateType: 'Hourly Rate',
      marketRateTypeKey: 'hourly_rate',
    },
    {
      lowRate: row.mileageRate.value,
      highRate: row.mileageRate.value,
      marketRateId: row.mileageRate.marketRateId,
      marketRateType: 'Mileage Rate',
      marketRateTypeKey: 'mileage',
    },
    {
      lowRate: row.deadMileRate.value,
      highRate: row.deadMileRate.value,
      marketRateId: row.deadMileRate.marketRateId,
      marketRateType: 'Dead Mile Rate',
      marketRateTypeKey: 'deadmile',
    },
    {
      lowRate: row.transferRate.value,
      highRate: row.transferRate.value,
      marketRateId: row.transferRate.marketRateId,
      marketRateType: 'Transfer Rate',
      marketRateTypeKey: 'transfer_rate',
    },
  ]

  return newRates.map((newRate) => {
    return {
      ...newRate,
      vehicleTypeKey,
      marketId,
      companyId,
      marketplace: 1,
      vehicleId: null,
    }
  })
}

export function buildEmptyRateRow(
  vehicleTypes: VehicleType[]
): Record<string, any> {
  const item = {
    vehicleType: undefined,
    mileageRate: {
      value: 0,
    },
    dailyRate: {
      value: 0,
    },
    deadMileRate: {
      value: 0,
    },
    transferRate: {
      value: 0,
    },
    hourlyRate: {
      value: 0,
    },
    hourlyMinimum: {
      value: 0,
    },
    isEditable: true,
    isNewRow: true,
    items: deepClone(vehicleTypes),
  }
  return item
}

export function getVehicleTypeKeyForLabel(
  label: string,
  vehicleTypes: VehicleType[]
): string | null {
  const vehicleType: VehicleType | undefined = vehicleTypes.find(
    (vt: VehicleType) => vt.label === label || vt.key === label
  )
  if (vehicleType) {
    return vehicleType.key
  }
  return null
}
