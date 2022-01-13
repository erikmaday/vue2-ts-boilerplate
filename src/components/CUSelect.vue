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
      :items="items"
      :rules="rules"
      solo
      flat
      :value="value"
      append-icon="mdi-chevron-down"
    >
      <template v-if="displaySelectAll" #prepend-item>
        <div
          class="v-list-item primary--text v-list-item--link theme--light v-list-item--highlighted"
          :class="{
            'v-list-item--active': isAllToggled,
          }"
          @click="toggleAllFilters"
        >
          <v-simple-checkbox
            hide-details
            style="flex-basis: 13.5%"
            color="primary"
            class="margin-y-0 padding-a-0 w-full"
            :value="isAllToggled"
            :ripple="false"
            @click="toggleAllFilters"
          />
          <span class="text-black">All</span>
        </div>
      </template>
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
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class CUSelect extends Vue {
  @Prop({
    required: false,
    type: Boolean,
  })
  displaySelectAll: boolean

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
  })
  items!: any

  @Prop({
    required: false,
    default: () => [],
  })
  value!: string | unknown[]

  @Prop({
    required: false,
  })
  rules!: unknown[]

  isAllToggled = true

  @Watch('value', { immediate: true })
  onValueChange(newVal: unknown[]): void {
    if (newVal.length === this.items.length) {
      this.isAllToggled = true
    } else {
      this.isAllToggled = false
    }
  }

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

  toggleAllFilters(): void {
    if (!this.isAllToggled) {
      if (this.itemValue) {
        this.$emit(
          'input',
          this.items.map((item) => item[this.itemValue])
        )
      } else {
        this.$emit('input', this.items)
      }
    } else {
      this.$emit('input', [])
    }
  }
}
</script>
