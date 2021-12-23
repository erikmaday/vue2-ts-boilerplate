<template>
  <v-row justify="center">
    <v-col>
      <v-form :disabled="!isModeEdit">
        <CUTextField
          v-model="currentGarage.garageName"
          :rules="[(val) => isNotEmpty(val) || 'Name is Required']"
          label="Name"
        />
        <AutocompleteAddress
          v-model="currentGarage.addressDTO"
          label="Address"
          :rules="[(val) => isNotEmpty(val) || 'Address is Required']"
        />
        <div
          class="
            border-solid border-gray-mid-light border-x-0 border-t-0 border-b-1
            margin-b-6
          "
        ></div>
        <!-- TODO: Add v-if for if no vehicles in garage yet  -->
        <template v-if="currentGarage && currentGarage.vehicleDTOs">
          <h4 class="margin-b-3">Vehicles In Garage</h4>
          <CUDataTable
            :columns="columns"
            :server-items-length="currentGarage.vehicleDTOs.length"
            :items="currentGarage.vehicleDTOs"
            item-key="vehicleId"
            :options="{}"
            is-detail-table
            detail-name="vehicles.view"
          />
        </template>
      </v-form>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Garage } from '@/models/dto/Garage'
import { Vue, Component, Prop } from 'vue-property-decorator'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import { isNotEmpty } from '@/utils/validators'
import { DataTableColumn } from '@/models/DataTableColumn'
import CUDataTable from '@/components/CUDataTable.vue'
import { TableViewParameters } from '@/models/dto'
import { RawLocation } from 'vue-router'

@Component({
  components: { AutocompleteAddress, CUDataTable },
})
export default class CompanyGaragesDetailEdit extends Vue {
  isNotEmpty = isNotEmpty

  @Prop({
    required: true,
  })
  mode!: string

  @Prop({
    required: true,
  })
  currentGarage!: Garage


  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  columns: DataTableColumn[] = [
    { text: 'Name', value: 'vehicleName' },
    { text: 'Type', value: 'vehicleTypeName' },
    { text: 'Detail', value: 'detail', type: 'details' },
  ]

  options: TableViewParameters = {}
}
</script>
