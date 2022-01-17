<template>
  <div class="align-center d-flex flex-grow-1" :class="{ 'w-full': isMobile }">
    <template v-if="detailAction">
      <template v-if="!isDetailTable">
        <v-btn
          v-if="!isMobile"
          text
          x-small
          color="primary"
          class="font-medium font-14"
          @click="pushDetailRoute"
        >
          Details
        </v-btn>
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
      <template v-else>
        <v-btn small icon @click="pushDetailRoute">
          <CUIcon color="primary">view</CUIcon>
        </v-btn>
      </template>
    </template>
    <v-menu v-if="!isMobile && visibleActionsList.length" offset-x left>
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
          v-for="(action, actionIndex) in visibleActionsList"
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
          <span
            class="ml-2"
            :class="action.textClasses ? action.textClasses : ''"
          >
            {{ action.displayText }}
          </span>
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
    <CUModal v-model="dialogOpen">
      <template #title>
        <span class="wb-break-word">{{ dialogText }}</span>
      </template>
      <template #actions>
        <v-spacer />
        <v-btn color="primary" small text @click="closeDialog">{{ dialogSecondaryActionText }}</v-btn>
        <v-btn color="primary" small @click="confirmAction">{{ dialogPrimaryActionText }}</v-btn>
      </template>
    </CUModal>
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

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  isDetailTable!: boolean

  dialogOpen = false
  dialogText: string | undefined = ''
  dialogPrimaryActionText = ''
  dialogSecondaryActionText = ''

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
      this.dialogPrimaryActionText = action.confirmModalPrimaryActionText || 'OK'
      this.dialogSecondaryActionText = action.confirmModalSecondaryActionText || 'Cancel'
      this.currentAction = action
    } else if (action.action) {
      action.action(this.row, this.rowIndex)
    }
  }

  get detailAction(): ActionColumn | undefined {
    return this.actions.find((action) => action.isDetail)
  }

  get isActionsListEmpty(): boolean {
    return (
      this.actions.filter((action) => !action.isDetail).length <
      1
    )
  }

  get visibleActionsList() {
    let visibleActions = this.actions.filter(action => !action.isDetail)
    visibleActions = visibleActions.filter(action => {
      if (!action.hideOn) {
        return true
      }
      return !action.hideOn(this.row)
    })
    return visibleActions
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
