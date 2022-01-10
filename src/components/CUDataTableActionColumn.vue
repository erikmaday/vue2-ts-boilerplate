<template>
  <div class="align-center d-flex flex-grow-1">
    <template v-if="detailAction">
      <a v-if="!isMobile" class="font-medium font-14" @click="pushDetailRoute">
        Details
      </a>
      <v-btn
        v-else
        color="primary"
        small
        class="w-full margin-t-4"
        @click="pushDetailRoute"
      >
        Details
      </v-btn>
    </template>
    <v-menu v-if="!isMobile" offset-x left>
      <template v-slot:activator="{ on }">
        <CUIcon
          width="20px"
          height="20px"
          color="primary"
          class="cursor-pointer"
          aria-label="More Actions"
          v-on="on"
        >
          more_vert
        </CUIcon>
      </template>
      <v-list>
        <v-list-item
          v-for="(action, actionIndex) in actions.filter(
            (action) => !action.isDetail && !action.hide
          )"
          :key="`action-${action.key}-${actionIndex}`"
          @click="handleAction(action, row)"
        >
          <CUIcon
            v-if="action.icon"
            class="cu-data-table--actionable-icon"
            width="24px"
            height="24px"
            :color="action.color || 'gray-mid-light'"
            decorative
            @click.native="() => action.action(row, rowIndex)"
          >
            {{ action.icon }}
          </CUIcon>
          <span class="ml-2">{{ action.displayText }}</span>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-col v-else-if="isMobile && displayActionsOnMobile">
      <template
        v-for="(action, actionIndex) in actions.filter(
          (action) => !action.isDetail && !action.hide
        )"
      >
        <v-btn
          :key="`action-btn-${actionIndex}`"
          :color="action.color"
          small
          class="w-full margin-t-4"
          @click="handleAction(action, row)"
        >
          <CUIcon v-if="action.icon" width="24px" height="24px" decorative>
            {{ action.icon }}
          </CUIcon>
          <span class="ml-2">{{ action.displayText }}</span>
        </v-btn>
      </template>
    </v-col>
    <v-dialog v-model="dialogOpen" max-width="500px">
      <v-card>
        <p class="wb-break-word font-22 font-medium padding-x-6 padding-y-2">
          {{ dialogText }}
        </p>
        <v-card-actions class="d-flex justify-center">
          <v-btn color="primary" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="confirmAction">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ActionColumn } from '@/models/ActionColumn'
import { AxiosResponse } from 'axios'

@Component
export default class CUDataTableActionColumn extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => {
      return []
    },
  })
  actions!: ActionColumn[]

  @Prop({
    required: false,
    default: undefined,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row!: any

  @Prop({
    type: Number,
    required: true,
  })
  rowIndex!: number

  @Prop({
    type: Boolean,
    required: true,
  })
  isMobile!: boolean

  @Prop({
    type: Boolean,
    required: false,
  })
  displayActionsOnMobile!: boolean

  dialogOpen = false
  dialogText: string | undefined = ''
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  dialogConfirmFn = () => ({})
  currentAction: ActionColumn | undefined = undefined

  async confirmAction(): Promise<void> {
    const action = this.currentAction
    if (action) {
      const res: AxiosResponse = await action.action(this.row)
      if (res && res.status === 200) {
        this.$emit('refresh')
      }
    }
    this.closeDialog()
  }

  closeDialog(): void {
    this.dialogOpen = false
  }

  handleAction(action: ActionColumn): void {
    if (action.confirmModal) {
      this.dialogOpen = true
      this.dialogText = action.confirmModalText
      this.currentAction = action
    } else if (action.action) {
      action.action(this.row, this.rowIndex)
    }
  }

  get detailAction(): ActionColumn | undefined {
    return this.actions.find((action) => action.isDetail)
  }

  pushDetailRoute(): void {
    const detailAction = this.actions.find((action) => action.key === 'details')

    if (detailAction?.detailRoute) {
      this.$router.push(detailAction.detailRoute(this.row))
      return
    }
    this.$router.push({ path: `view/${this.row[this.row.id]}` })
  }
}
</script>
