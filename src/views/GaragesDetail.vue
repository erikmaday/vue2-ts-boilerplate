<template>
  <Detail>
    <template #back>
      <router-link :to="lastRoute">
        <v-btn
          :icon="$vuetify.breakpoint.mdAndUp"
          :x-small="$vuetify.breakpoint.mdAndUp"
          :small="$vuetify.breakpoint.smAndDown"
          plain
          color="primary"
        >
          <CUIcon>arrow_left</CUIcon>
          <span v-if="$vuetify.breakpoint.xs" class="margin-l-1">Back</span>
        </v-btn>
      </router-link>
    </template>
    <template #title>{{ headerTitle }}</template>
    <template #buttons>
      <v-btn
        v-show="isModeView"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        :text="$vuetify.breakpoint.mdAndUp"
        :outlined="$vuetify.breakpoint.smAndDown"
        color="error"
        @click="deleteModalIsOpen = true"
      >
        Delete
      </v-btn>
      <v-btn
        v-show="isModeEdit || isModeAdd"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        :text="$vuetify.breakpoint.mdAndUp"
        :outlined="$vuetify.breakpoint.smAndDown"
        small
        color="primary"
        @click="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        v-show="isModeView"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        outlined
        color="primary"
        @click="
          $router.push({
            name: 'garages.edit',
            params: { id: $route.params.id },
          })
        "
      >
        Edit Garage
      </v-btn>
      <v-btn
        v-show="isModeEdit"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        color="primary"
        @click="updateGarage"
      >
        Save
      </v-btn>
      <v-btn
        v-show="isModeAdd"
        :class="{
          'w-full margin-y-2': $vuetify.breakpoint.xs,
          'margin-l-4': $vuetify.breakpoint.smAndUp,
        }"
        small
        color="primary"
        @click="addGarage"
      >
        Add
      </v-btn>
    </template>
    <v-row justify="center">
      <v-col cols="12">
        <GaragesDetailForm
          ref="form"
          :mode="mode"
          :current-garage.sync="currentGarage"
          :garage-id="garageId"
          @refresh="getCurrentGarage"
        />
        <template
          v-if="!isModeAdd && currentGarage && currentGarage.vehicleDTOs"
        >
          <div
            class="border-solid border-gray-mid-light border-x-0 border-t-0 border-b-1 margin-y-6"
          ></div>
          <h4 class="margin-b-3">Vehicles In Garage</h4>
          <CUDataTable
            :actions="actions"
            :columns="columns"
            :server-items-length="currentGarage.vehicleDTOs.length"
            :items="currentGarage.vehicleDTOs"
            item-key="vehicleId"
            :options="{}"
            is-detail-table
            detail-name="vehicles.view"
            no-data-text="No vehicles are in this garage"
          />
        </template>
      </v-col>
    </v-row>
    <CUModal v-model="deleteModalIsOpen">
      <template #title>Delete Garage</template>
      <template #text>Are you sure you want to delete this garage?</template>
      <template #actions>
        <v-spacer />
        <v-btn
          color="primary"
          outlined
          small
          text
          @click="deleteModalIsOpen = false"
        >
          Cancel
        </v-btn>
        <v-btn color="error" small @click="deleteGarage">Delete</v-btn>
        <v-spacer />
      </template>
    </CUModal>
  </Detail>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import { Garage } from '@/models/dto/Garage'
import Detail from '@/layouts/Detail.vue'
import GaragesDetailForm from '@/components/GaragesDetailForm.vue'
import AutocompleteAddress from '@/components/AutocompleteAddress.vue'
import { isNotEmpty } from '@/utils/validators'
import { ApiResult } from '@/models/dto'
import { DataTableColumn } from '@/models/DataTableColumn'
import app from '@/store/modules/app'
import { TableViewParameters } from '@/models/TableView'
import { ActionColumn } from '@/models/ActionColumn'
import { RawLocation } from 'vue-router'

@Component({
  components: {
    Detail,
    GaragesDetailForm,
    AutocompleteAddress,
  },
})
export default class GaragesDetail extends Vue {
  notFound = false
  isNotEmpty = isNotEmpty
  currentGarage: Garage | Record<string, never> = {}

  actions: ActionColumn[] = [
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      confirmModal: false,
      ariaLabel: 'View Vehicle Details',
      isDetail: true,
      detailRoute: (row): RawLocation => {
        return {
          name: 'vehicles.view',
          params: { id: String(row.vehicleId) },
        }
      },
    },
  ]

  columns: DataTableColumn[] = [
    {
      _t_id: 'd863456c-8159-4bc5-8b95-fc2950029d9a',
      text: 'Name',
      value: 'vehicleName',
    },
    {
      _t_id: '4653dc8d-c905-4e26-86ac-2dc4541d6b75',
      text: 'Type',
      value: 'vehicleTypeName',
    },
    {
      _t_id: 'b296e307-906a-49ce-9c91-56ed58d21e62',
      text: '',
      value: 'actions',
      type: 'actions',
    },
  ]
  options: TableViewParameters = {}
  deleteModalIsOpen = false
  app = app

  get mode(): string {
    switch (this.$route.name) {
      case 'garages.edit':
        return 'edit'
      case 'garages.view':
        return 'view'
      default:
        return 'add'
    }
  }

  get headerTitle(): string {
    switch (this.mode) {
      case 'add':
        return 'Add Garage'
      case 'edit':
        return `Edit ${this.currentGarage.garageName}`
      default:
        return this.currentGarage.garageName
    }
  }

  get isModeView(): boolean {
    return this.mode === 'view'
  }

  get isModeEdit(): boolean {
    return this.mode === 'edit'
  }

  get isModeAdd(): boolean {
    return this.mode === 'add'
  }

  get garageId(): number | undefined {
    if (this.$route.params.id) {
      return Number(this.$route.params.id)
    }
    return undefined
  }

  mounted(): void {
    this.getCurrentGarage()
  }

  async getCurrentGarage(): Promise<void> {
    if (this.isModeAdd) {
      return
    }

    let response: AxiosResponse
    try {
      if (this.$route.params.id) {
        response = await garage.byId(Number(this.$route.params.id))
        const { data } = response
        this.currentGarage = data
      } else {
        this.notFound = true
        return
      }
    } catch (e) {
      this.notFound = true
      console.error(e)
      return
    }
  }

  async deleteGarage(): Promise<void> {
    if (!this.garageId) {
      return
    }

    const res: AxiosResponse<ApiResult> = await garage.delete(this.garageId)
    if (res.data.successful) {
      this.deleteModalIsOpen = false
      this.$router.push({ name: 'garages' })
    }
  }

  get lastRoute(): RawLocation {
    const lastRoute = app.getLastRoute
    if (
      !app.getLastRoute?.name ||
      app.getLastRoute.name === 'garages.edit' ||
      app.getLastRoute.name === 'garages.add' ||
      app.getLastRoute.name === 'vehicles.view'
    ) {
      return { name: 'garages' }
    }
    return lastRoute
  }

  cancel(): void {
    if (this.isModeAdd) {
      if (app.getLastRoute?.name) {
        this.$router.push(app.getLastRoute)
      } else {
        this.$router.push({ name: 'garages' })
      }
      return
    }

    this.$router.push({
      name: 'garages.view',
      params: { id: this.$route.params.id },
    })
    this.getCurrentGarage()
  }

  updateGarage(): void {
    const form: any = this.$refs['form']
    if (form) {
      form.updateGarage()
    }
  }

  addGarage(): void {
    const form: any = this.$refs['form']
    if (form) {
      form.addGarage()
    }
  }
}
</script>
