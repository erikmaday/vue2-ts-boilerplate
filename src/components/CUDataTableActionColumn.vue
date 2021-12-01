<template>
  <div class="cu-data-table--actionable-column flex-row">
    <div
      v-for="(action, actionIndex) in actions"
      :key="`action-${action.key}-${actionIndex}`"
    >
      <v-hover v-slot="{ hover }">
        <CUIcon
          v-if="action.icon"
          class="cu-data-table--actionable-icon"
          width="24px"
          height="24px"
          :color="hover ? action.color : 'gray-mid-light'"
          :ariaLabel="action.displayText"
        >
          {{ action.icon }}
        </CUIcon>
      </v-hover>
    </div>
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
}
</script>

<style lang="scss" scoped>
.cu-data-table--actionable-icon {
  transition: 0.1s all ease-in;
  cursor: pointer;
}
</style>
