<template>
  <div>
    <label v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-select
      v-bind="$attrs"
      :label="null"
      v-on="listeners"
      outlined
      solo
      flat
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CUSelect extends Vue {
  get listeners(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this
    return Object.assign({}, this.$listeners, {
      input: function (event: InputEvent) {
        vm.$emit('input', event)
      },
      change: function (event: InputEvent) {
        vm.$emit('change', event)
      },
    })
  }
}
</script>
