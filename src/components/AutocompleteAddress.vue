<template>
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
        :autofocus="autoFocus"
        :value="search"
        :disabled="disabled"
        :error-messages="errorMessages"
        :rules="rules"
        clearable
        flat
        autocomplete="off"
        outlined
        :tabindex="tabIndex"
        v-on="on"
        @blur="onBlur"
        @input="addressAutoComplete"
        @keyup.native="handleKeyEvent($event.keyCode)"
        @focus="onFocus"
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
          <CUIcon class="text-primary">place</CUIcon>
          <v-list-item-title>
            {{ item.description }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from 'vue-property-decorator'
import places from '@/services/places'
import { Address, PlaceSearch } from '@/models/dto'
import CUIcon from '@/components/CUIcon.vue'
@Component({
  components: {
    CUIcon,
  },
})
export default class AutocompleteAddress extends Vue {
  @Model('change') readonly value!: Address | null
  @Prop({ default: false }) readonly autoFocus!: boolean
  @Prop({ default: [] }) readonly rules!: []
  @Prop({ default: false }) readonly disabled!: boolean
  @Prop({ default: false }) readonly hideOptions!: boolean
  @Prop({ default: null }) readonly tabIndex!: number
  @Prop({ default: '' }) readonly identifier!: string
  @Prop({ default: null }) readonly initialSearch!: string | null
  @Prop({ default: null }) readonly appendIcon!: string | null

  loading = false
  search: string | null = null
  debounce: number | null = null
  addressSearchText = null
  autocompleteItems: PlaceSearch[] = []
  arrowPosition: number | null = null
  errorMessages = []
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

  onFocus(): void {
    this.isFocused = true
  }

  onBlur(): void {
    this.isFocused = false
  }

  async addressAutoComplete(input: string): Promise<void> {
    if (typeof input === 'undefined' || input === null || input.length === 0) {
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

    this.search = place.completeAddress
  }

  clearPlace(): void {
    this.autocompleteItems = []
    this.$emit('change', null)
  }

  handleKeyEvent(keyCode: number): void {
    const UP_ARROW = 38
    const DOWN_ARROW = 40
    const ENTER = 13

    const maxPosition = this.autocompleteItems.length
    if (keyCode === UP_ARROW) {
      if (this.arrowPosition === null) {
        this.arrowPosition = maxPosition
      } else if (this.arrowPosition && this.arrowPosition >= 0) {
        this.arrowPosition--
      }
      return
    }
    if (keyCode === DOWN_ARROW) {
      if (this.arrowPosition === null) {
        this.arrowPosition = 0
      } else if (this.arrowPosition + 1 === maxPosition) {
        this.arrowPosition = 0
      } else {
        this.arrowPosition++
      }
      return
    }
    if (keyCode === ENTER) {
      if (this.arrowPosition && this.autocompleteItems[this.arrowPosition]) {
        this.selectPlace(this.autocompleteItems[this.arrowPosition])
      }
      return
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep button.v-icon.notranslate.v-icon--link.mdi.mdi-close.theme--light {
  margin-top: -7px;
}
</style>
