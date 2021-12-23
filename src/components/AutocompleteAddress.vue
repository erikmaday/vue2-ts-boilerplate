<template>
<div>
    <label v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-menu
      v-model="isFocused"
      :open-on-click="false"
      :close-on-click="false"
      content-class="elevation-0"
      nudge-bottom="50"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          ref="autoCompleteTextField"
          v-bind="$attrs"
          :label="undefined"
          :autofocus="autoFocus"
          :value="search"
          :disabled="disabled"
          clearable
          flat
          solo
          autocomplete="off"
          outlined
          :tabindex="tabIndex"
          v-on="on"
          @blur="blur"
          @input="addressAutoComplete"
          @keyup.native="handleKeyEvent($event.keyCode)"
          @focus="focus"
        />
        <div v-if="loading">
          <v-progress-linear :indeterminate="true" height="1" />
        </div>
      </template>
      <v-card v-if="autocompleteItems.length && !hideOptions">
        <v-list>
          <v-list-item
            v-for="(item, index) in autocompleteItems"
            :id="`address-autocomplete-item-${index}`"
            :key="`address-autocomplete-item-${index}`"
            class="cursor-pointer hover:background-black-5"
            :class="{ 'background-black-5': arrowPosition === index }"
            @mouseover="arrowPosition = index"
            @mousedown="() => selectPlace(item)"
          >
            <CUIcon class="text-primary margin-r-2">place</CUIcon>
            <v-list-item-title>
              {{ item.description }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
import places from '@/services/places'
import { KeyCode } from '@/utils/enum'
import { Address, PlaceSearch } from '@/models/dto'
@Component
export default class AutocompleteAddress extends Vue {
  @Model('change') readonly value!: Address | null
  @Prop({ default: false }) readonly autoFocus!: boolean
  @Prop({ default: false }) readonly disabled!: boolean
  @Prop({ default: false }) readonly hideOptions!: boolean
  @Prop({ default: null }) readonly tabIndex!: number
  @Prop({ default: '' }) readonly identifier!: string
  @Prop({ default: null }) readonly initialSearch!: string | null
  @Prop({ default: null }) readonly appendIcon!: string | null

  loading = false
  search: string | null = null
  debounce: number | null = null
  autocompleteItems: PlaceSearch[] = []
  arrowPosition: number | null = null
  isFocused = false

  created(): void {
    if (this.value?.addressName) {
      this.search = this.value.addressName
    }
  }

  @Watch('search')
  searchChanged(value: string): void {
    if (value === this.value?.addressName) {
      this.addressAutoComplete(value)
    }
  }
  @Watch('value.addressName')
  addressNameChanged(addressName: string): void {
    this.search = addressName
  }

  focus(): void {
    this.isFocused = true
  }

  blur(): void {
    this.isFocused = false
  }

  async addressAutoComplete(input: string): Promise<void> {
    if (!input) {
      this.clearPlace()
      return
    }
    if (this.debounce) {
      window.clearTimeout(this.debounce)
    }
    this.debounce = window.setTimeout(async () => {
      this.loading = true
      this.arrowPosition = null
      const placeSearchResponse = await places.bySearchTerm(input)
      this.autocompleteItems = placeSearchResponse.data || []
      this.loading = false
    }, 250)
  }

  async selectPlace(placeItem: PlaceSearch): Promise<void> {
    if (!placeItem) {
      return
    }
    const placeResponse = await places.byId(placeItem.place_id)
    const place = placeResponse.data
    this.$nextTick(() => {
      this.$emit('change', place)
    })

    this.search = place.completeAddress || null
  }

  clearPlace(): void {
    this.autocompleteItems = []
    this.$emit('change', null)
  }

  handleKeyEvent(keyCode: number): void {
    const maxPosition = this.autocompleteItems.length
    if (keyCode === KeyCode.UpArrow) {
      if (this.arrowPosition === null) {
        this.arrowPosition = maxPosition
      } else if (this.arrowPosition && this.arrowPosition >= 0) {
        this.arrowPosition--
      }
      return
    }
    if (keyCode === KeyCode.DownArrow) {
      if (this.arrowPosition === null) {
        this.arrowPosition = 0
      } else if (this.arrowPosition + 1 === maxPosition) {
        this.arrowPosition = 0
      } else {
        this.arrowPosition++
      }
      return
    }
    if (keyCode === KeyCode.Enter) {
      if (
        this.arrowPosition !== null &&
        this.autocompleteItems[this.arrowPosition]
      ) {
        this.selectPlace(this.autocompleteItems[this.arrowPosition])
        this.blur()
      }
      return
    }
  }
}
</script>
