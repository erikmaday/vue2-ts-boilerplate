<template>
  <CUTextField
    :type="isShowingPassword ? 'text' : 'password'"
    v-bind="$attrs"
    v-on="$listeners"
    :append-icon="isShowingPassword ? 'mdi-eye' : 'mdi-eye-off'"
    @click:append="isShowingPassword = !isShowingPassword"
  />
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({})
export default class CUPasswordField extends Vue {
  isShowingPassword = false
}
</script>
