<template>
  <div>
    <v-container>
      <v-row
        class="padding-b-8"
        align="center"
        justify-sm="space-between"
        justify="center"
      >
        <v-col cols="12" sm="auto">
          <h1
            class="margin-a-0"
            :class="{
              'text-center': $vuetify.breakpoint.xs,
            }"
          >
            {{ headerTitle }}
          </h1>
        </v-col>
        <span>
          <v-btn
            class="margin-l-4"
            primary
            outlined
            small
            color="primary"
            @click="
              $router.push({
                name: 'garages',
              })
            "
          >
            All Garages
          </v-btn>
          <v-btn
            v-show="isModeEdit"
            class="margin-l-4"
            outlined
            small
            color="primary"
            @click="
              $router.push({
                name: 'garages.view',
                params: { id: $route.params.id },
              })
            "
          >
            Cancel
          </v-btn>
          <v-btn
            v-show="isModeView"
            class="margin-l-4"
            small
            color="primary"
            @click="
              $router.push({
                name: 'garages.edit',
                params: { id: $route.params.id },
              })
            "
          >
            Edit
          </v-btn>
        </span>
      </v-row>
      <v-row justify="center">
        <v-col cols="8">
          <CompanyGaragesAddNew v-if="isModeAdd" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import garage from '@/services/garage'
import { AxiosResponse } from 'axios'
import { Garage } from '@/models/dto/Garage'
import CompanyGaragesAddNew from '@/components/CompanyGaragesAddNew.vue'

@Component({
  components: { CompanyGaragesAddNew },
})
export default class CompanyGaragesEdit extends Vue {
  notFound = false

  currentGarage: Garage | null = null

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
        return 'Edit Garage'
      default:
        return 'View Garage'
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

  mounted(): void {
    this.getCurrentGarage()
  }

  async getCurrentGarage(): Promise<void> {
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
}
</script>