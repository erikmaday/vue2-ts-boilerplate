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
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <p class="wb-break-word font-22 font-medium padding-x-6 padding-y-2">
          Are you sure you want to delete this
          {{ collectionNameSingular || 'item' }}?
        </p>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="primary" @click="deleteItemConfirm">OK</v-btn>
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

  deleteDialog = false

  async deleteItemConfirm(): Promise<void> {
    const deleteAction = this.actions.find((action) => action.key === 'delete')
    if (deleteAction) {
      await deleteAction.action(this.row)
      this.$emit('refresh')
    }
    this.deleteDialog = false
  }

  closeDelete(): void {
    this.deleteDialog = false
  }

  handleAction(action: ActionColumn): void {
    if (action.key === 'delete') {
      this.deleteDialog = true
    } else if (action.action) {
      action.action(this.row)
    }
  }
}
</script>
