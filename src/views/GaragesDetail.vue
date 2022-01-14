<template>
  <div>
    <v-container class="position-relative">
      <div
        :class="{
          'position-absolute top-4': $vuetify.breakpoint.mdAndUp,
          'd-flex justify-center align-center': $vuetify.breakpoint.smAndDown,
        }"
      >
        <v-btn
          plain
          :icon="$vuetify.breakpoint.mdAndUp"
          :x-small="$vuetify.breakpoint.mdAndUp"
          :small="$vuetify.breakpoint.smAndDown"
          @click="pushLastRoute"
        >
          <CUIcon color="primary">arrow_left</CUIcon>
          <span
            v-if="$vuetify.breakpoint.smAndDown"
            class="margin-l-1 text-primary"
          >
            Back
          </span>
        </v-btn>
      </div>
      <v-row justify="center">
        <v-col cols="12" sm="8">
          <v-row
            class="padding-b-8"
            align="center"
            justify-md="space-between"
            justify="center"
          >
            <v-col cols="12" md="auto">
              <h1
                class="margin-a-0"
                :class="{
                  'text-center': $vuetify.breakpoint.smAndDown,
                }"
              >
                {{ headerTitle }}
              </h1>
            </v-col>
            <div
              :class="{
                'w-full margin-x-3': $vuetify.breakpoint.xs,
              }"
            >
              <v-btn
                v-show="isModeView"
                :class="{
                  'w-full margin-y-2': $vuetify.breakpoint.xs,
                  'margin-l-4': $vuetify.breakpoint.smAndUp,
                }"
                small
                :text="$vuetify.breakpoint.smAndUp"
                :outlined="$vuetify.breakpoint.xs"
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
                :text="$vuetify.breakpoint.smAndUp"
                :outlined="$vuetify.breakpoint.xs"
                small
                color="primary"
                @click="cancelUpdate"
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
            </div>
          </v-row>
        </v-col>
      </v-row>
      <v-row justify="center" no-gutters>
        <v-col cols="12" sm="8">
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
    </v-container>
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
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import { Garage } from '@/models/dto/Garage'
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
      icon: 'view',
      ariaLabel: 'View Vehicle Detail',
      isDetail: true,
      detailRoute: (row): RawLocation => ({
        name: 'vehicles.view',
        params: { id: row.vehicleId },
      }),
    }
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
      text: 'Details',
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

  pushLastRoute(): void {
    if (
      !app.getLastRoute?.name ||
      app.getLastRoute.name === 'garages.view' ||
      app.getLastRoute.name === 'garages.add'
    ) {
      this.$router.push({ name: 'garages' })
    } else {
      this.$router.push(app.getLastRoute)
    }
  }

  cancelUpdate(): void {
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
