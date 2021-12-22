<template>
  <div>
    <label v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-text-field
      v-bind="$attrs"
      solo
      :label="null"
      v-on="listeners"
      flat
      outlined
    />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CUTextField extends Vue {
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