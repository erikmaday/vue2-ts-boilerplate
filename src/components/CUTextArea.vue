<template>
  <div>
    <label v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-textarea
      v-bind="$attrs"
      v-on="listeners"
      :label="undefined"
      solo
      flat
      outlined
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CUTextArea extends Vue {
  get listeners(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const vm = this
    return Object.assign({}, this.$listeners, {
      input: function (event: InputEvent) {
        vm.$emit('input', event)
      },
    })
  }
}
</script>
