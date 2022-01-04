import { CreateRatePayload } from '@/models/dto/Rate'

export const buildAddRatePayload = (
  row,
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
      marketplace: 0,
    }
  })
}