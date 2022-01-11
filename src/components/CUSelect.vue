<template>
  <div>
    <label class="font-14" v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-select
      v-bind="$attrs"
      :label="null"
      v-on="listeners"
      outlined
      :item-text="itemText"
      :item-value="itemValue"
      solo
      flat
      :value="value"
      append-icon="mdi-chevron-down"
    >
      <!-- TODO: Add option for `All` slot to select all/none -->
      <template
        v-if="this.aggregateSelectionIndex"
        #selection="{ item, index }"
      >
        <span class="margin-l-1" v-if="index < aggregateSelectionIndex">
          {{
            `${item[itemText]}${
              index !== aggregateSelectionIndex - 1 && value.length - 1 > index
                ? ', '
                : ''
            }`
          }}
        </span>
        <span
          v-if="index === aggregateSelectionIndex && value.length"
          class="text-gray-mid-light margin-l-1"
        >
          (+{{ value.length - aggregateSelectionIndex }} others)
        </span>
      </template>
      <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
        <slot :name="name" v-bind="data"></slot>
      </template>
    </v-select>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class CUSelect extends Vue {
  // For selects with the `multiple` prop.
  // When selecting more than this index, display just (+# others)
  @Prop({
    required: false,
    type: Number,
  })
  aggregateSelectionIndex: number

  @Prop({
    required: false,
    default: 'text',
    type: String,
  })
  itemText!: string

  @Prop({
    required: false,
    default: 'value',
    type: String,
  })
  itemValue!: string

  @Prop({
    required: false,
    default: () => [],
    type: [String, Array],
  })
  value!: string | unknown[]

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
