<template>
  <div class="cu-data-table--actionable-column d-flex align-center">
    <v-menu offset-x left>
      <template v-slot:activator="{ on }">
        <CUIcon
          width="20px"
          height="20px"
          color="primary"
          class="cursor-pointer"
          ariaLabel="More Actions"
          v-on="on"
        >
          more_vert
        </CUIcon>
      </template>
      <v-list>
        <v-list-item
          v-for="(action, actionIndex) in actions"
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
            @click.native="() => action.action(row)"
          >
            {{ action.icon }}
          </CUIcon>
          <span class="ml-2">{{ action.displayText }}</span>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="dialogOpen" max-width="500px">
      <v-card>
        <p class="wb-break-word font-22 font-medium padding-x-6 padding-y-2">
          {{ dialogText }}
        </p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="confirmAction">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { ActionColumn } from '@/models/ActionColumn'
import CUIcon from '@/components/CUIcon.vue'
@Component({
  components: { CUIcon },
})
export default class CUDataTableActionColumn extends Vue {
  @Prop({
    type: Array,
    required: true,
    default: () => {
      return []
    },
  })
  actions!: Array<ActionColumn>

  @Prop({
    required: false,
    default: undefined,
  })
  row!: any

  @Prop({
    type: String,
    required: false,
  })
  collectionNameSingular!: string

  dialogOpen = false
  dialogText: string | undefined = ''
  dialogConfirmFn = () => ({})
  currentAction: ActionColumn | undefined = undefined

  async confirmAction(): Promise<void> {
    const action = this.currentAction
    if (action) {
      await action.action(this.row)
      this.$emit('refresh')
    }
    this.dialogOpen = false
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
      action.action(this.row)
    }
  }
}
</script>
