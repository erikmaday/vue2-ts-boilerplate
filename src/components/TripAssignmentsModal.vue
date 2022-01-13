<template>
  <CUModal v-model="value" v-on="$listeners">
    <template #title>Assign Drivers and Vehicles</template>
    <template #text>
      <div v-for="(assignment, vi) in model" :key="`assignment-group-${vi}`">
        <v-row>
          <v-col cols="6">
            <div
              v-for="(driverAssignment, di) in assignment.driverAssignments"
              :key="`driver-assignment-select-${vi}-${di}`"
            >
              <div class="d-flex flex-row justify-space-between">
                <label>Drivers</label>
                <a
                  :key="`driver-assignment-clear-link-${vi}-${di}`"
                  class="font-12"
                  @click="clearDriver(vi, di)"
                >
                  Clear Driver
                </a>
              </div>
              <CUSelect
                :key="`driver-assignment-select-${vi}-${di}`"
                placeholder="Select Drivers"
                :items="drivers"
                item-text="fullName"
                :error-messages="driverAssignment.driver.errors"
                item-value="userId"
                dense
                :value="driverAssignment.driver.userId"
                @input="updateDriverId(vi, di, $event)"
              />
            </div>
          </v-col>
          <v-col cols="6">
            <div class="d-flex flex-row justify-space-between">
              <label>{{ assignment.vehicleTypeLabel }}</label>
              <a class="font-12" @click="clearVehicle(vi)">Clear Vehicle</a>
            </div>
            <CUSelect
              :error-messages="assignment.vehicle.errors"
              placeholder="Select Vehicles"
              :items="
                vehicles.filter(
                  (v) => v.vehicleTypeId === assignment.vehicleTypeId
                )
              "
              item-text="vehicleName"
              item-value="vehicleId"
              dense
              :value="assignment.vehicle.vehicleId"
              @input="updateVehicleId(vi, $event)"
            />
          </v-col>
        </v-row>
      </div>
    </template>
    <template #actions>
      <v-spacer />
      <v-btn small color="primary" text @click="$emit('input', false)">
        Cancel
      </v-btn>
      <v-btn
        style="margin-right: 10px"
        small
        color="primary"
        :disabled="loading"
        @click="submit"
      >
        <template v-if="!loading">Update Assignments</template>
        <span class="padding-x-15" v-else>
          <v-progress-circular indeterminate color="white" :size="20" />
        </span>
      </v-btn>
    </template>
  </CUModal>
</template>
<script lang="ts">
import {
  DriverAssignment,
  RequiredVehicleType,
  Trip,
  Vehicle,
  VehicleAssignment,
} from '@/models/dto'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { buildFirstAndLastStops, buildModel } from '@/utils/assignments'
import { Driver } from '@/models/dto/Driver'
import deepClone from '@/utils/deepClone'
import vehicle from '@/services/vehicle'
import driver from '@/services/driver'
import reservation from '@/services/reservation'

@Component({})
export default class TripAssignmentsModal extends Vue {
  @Prop({ required: true }) readonly requiredVehicles!: RequiredVehicleType[]
  @Prop({ required: true }) readonly requiredDrivers!: number
  @Prop({ required: true }) readonly tripAssignments!: VehicleAssignment[]
  @Prop({ required: true }) readonly reservationId!: number
  @Prop({ required: true }) readonly value!: boolean
  @Prop({ required: true }) readonly trip!: Trip

  model: any = []
  vehicles: Vehicle[] = []
  drivers: Driver[] = []
  loading = false

  @Watch('tripAssignments', { deep: true })
  onTripAssignmentsChange(): void {
    this.resetModel()
  }

  mounted(): void {
    this.resetModel()
    this.getVehicles()
    this.getDrivers()
  }

  resetModel(): void {
    this.model = buildModel(
      this.tripAssignments,
      this.requiredVehicles,
      this.requiredDrivers
    )
  }

  updateVehicleId(vehicleIndex: number, vehicleId: number): void {
    this.model[vehicleIndex].vehicle.vehicleId = vehicleId
    this.model[vehicleIndex].vehicle.errors = []
  }

  updateDriverId(
    vehicleIndex: number,
    driverIndex: number,
    userId: number
  ): void {
    this.model[vehicleIndex].driverAssignments[driverIndex].driver.userId =
      userId
    this.model[vehicleIndex].driverAssignments[driverIndex].driver.errors = []
  }

  clearDriver(vehicleIndex: number, driverIndex: number): void {
    if (this.model[vehicleIndex]?.driverAssignments?.[driverIndex]) {
      this.model[vehicleIndex].driverAssignments[driverIndex].driver.userId =
        undefined
      this.model[vehicleIndex].driverAssignments[driverIndex].driver.errors = []
    }
  }

  clearVehicle(rowIndex: number): void {
    if (this.model[rowIndex]) {
      this.model[rowIndex].vehicle.vehicleId = undefined
      this.model[rowIndex].vehicle.errors = []
    }
  }

  clearValidationErrors(): void {
    for (const vehicleAssignment of this.model) {
      vehicleAssignment.vehicle.errors = []
      for (const driverAssignment of vehicleAssignment.driverAssignments) {
        driverAssignment.driver.errors = []
      }
    }
  }

  validate(): boolean {
    this.clearValidationErrors()
    let isValid = true

    // Check for drivers assigned without vehicles
    for (const vehicleAssignment of this.model) {
      const hasDriverIds = vehicleAssignment.driverAssignments.reduce(
        (hasDriverIds, da) => hasDriverIds || !!da.driver.userId,
        false
      )

      if (hasDriverIds && !vehicleAssignment.vehicle.vehicleId) {
        vehicleAssignment.vehicle.errors = ['Vehicle assignment required']
        isValid = false
      }
    }

    // Check for duplicate vehicles
    const vehicleIds = this.model
      .map((va) => va.vehicle.vehicleId)
      .filter((id) => !!id)
    for (const vehicleAssignment of this.model) {
      const vehicleId = vehicleAssignment.vehicle.vehicleId
      if (vehicleId) {
        if (vehicleIds.filter((id) => id === vehicleId).length > 1) {
          vehicleAssignment.vehicle.errors = ['Duplicate vehicle']
          isValid = false
        }
      }
    }

    // Check for duplicate drivers
    const driverIdsOnModel = []
    this.model.reduce((ids, vehicleAssignment) => {
      const driverIdsOnAssignment = vehicleAssignment.driverAssignments
        .reduce((dIds, driverAssignment) => {
          return [...dIds, driverAssignment.driver.userId]
        }, [])
        .filter((id) => !!id)

      ids.push(...driverIdsOnAssignment)
      return ids
    }, driverIdsOnModel)

    for (const vehicleAssignment of this.model) {
      for (const driverAssignment of vehicleAssignment.driverAssignments) {
        const userId = driverAssignment.driver.userId
        if (
          userId &&
          driverIdsOnModel.filter((id) => id === userId).length > 1
        ) {
          driverAssignment.driver.errors = ['Duplicate driver']
          isValid = false
        }
      }
    }

    return isValid
  }

  // Validate the model
  // Delete all existing assignments, and then
  // create new assignments based on the model
  async submit(): Promise<void> {
    this.loading = true
    const stopInfo = buildFirstAndLastStops(this.trip, this.reservationId)

    if (!this.validate()) {
      this.loading = false
      return
    }

    // Delete all existing assignments
    const existingAssignmentIds = this.model.reduce(
      (ids, vehicleAssignment) => {
        if (vehicleAssignment.vehicleAssignmentId) {
          ids.push(vehicleAssignment.vehicleAssignmentId)
        }

        for (const da of vehicleAssignment.driverAssignments) {
          if (da.tripAssignmentId) {
            ids.push(da.tripAssignmentId)
          }
        }
        return ids
      },
      []
    )

    if (existingAssignmentIds.length) {
      await reservation.deleteAssignment(existingAssignmentIds)
    }

    // For each row on the model, create a new assignment
    const assignmentsToBuild = this.model.filter(
      (assignment) => !!assignment.vehicle.vehicleId
    )

    for (const assignment of assignmentsToBuild) {
      const payload = {
        ...stopInfo,
        vehicleId: assignment.vehicle.vehicleId,
        vehicleTypeId: assignment.vehicleTypeId,
        hardConflictOverride: true,
        driverAssignments: [],
      }

      const driverAssignmentsToCreate = assignment.driverAssignments
        .filter((da: DriverAssignment) => !!da.driver.userId)
        .map((da: DriverAssignment) => ({
          userId: da.driver.userId,
          hardConflictOverride: true,
          ...stopInfo,
        }))

      if (driverAssignmentsToCreate.length) {
        payload.driverAssignments = driverAssignmentsToCreate
      }
      await reservation.createAssignment(payload)
    }

    this.$emit('refresh')
    this.$emit('input', false)
    this.loading = false
  }

  async getVehicles(): Promise<void> {
    const vehiclesListRes = await vehicle.tableView({ pageSize: -1, page: 1 })
    this.vehicles = deepClone(vehiclesListRes.data.resultList)
  }

  async getDrivers(): Promise<void> {
    const driversListRes = await driver.tableView({ pageSize: -1, page: 1 })
    const mappedDrivers = driversListRes.data.resultList.map((d) => ({
      ...d,
      fullName: `${d.firstName} ${d.lastName}`,
    }))
    this.drivers = deepClone(mappedDrivers)
  }
}
</script>
