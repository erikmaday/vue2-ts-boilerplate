<template>
  <MainWithSidebar>
    <template #navigation>
      <MainWithSidebarNavigation :links="links" :mode="mode" />
    </template>
    <template v-slot:section-title>
      {{ toTitle(mode) }}
    </template>
    <template v-slot:default>
      <component :is="companyComponent" />
    </template>
  </MainWithSidebar>
</template>
<script lang="ts">
import MainWithSidebar from '@/layouts/MainWithSidebar.vue'

import { Vue, Component, Prop } from 'vue-property-decorator'
import MainWithSidebarNavigation from '@/components/MainWithSidebarNavigation.vue'
import CompanyRatesList from '@/components/CompanyRatesList.vue'
import CompanyRatesAdjustments from '@/components/CompanyRatesAdjustments.vue'
import CompanyRatesCalculator from '@/components/CompanyRatesCalculator.vue'
import { SidebarLink } from '@/models/SidebarLink'
import { toTitle } from '@/utils/string'
@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    CompanyRatesList,
    CompanyRatesAdjustments,
    CompanyRatesCalculator,
  },
})
export default class CompanyRates extends Vue {
  toTitle = toTitle
  links: SidebarLink[] = [
    {
      label: 'Rates',
      href: '',
      name: 'rates',
      component: CompanyRatesList,
      icon: 'rates',
    },
    {
      label: 'Adjustments',
      href: 'adjustments',
      name: 'rates.adjustments',
      component: CompanyRatesAdjustments,
      icon: 'swap_vert',
    },
    {
      label: 'Calculator',
      href: 'calculator',
      name: 'rates.calculator',
      component: CompanyRatesCalculator,
      icon: 'calculate',
    },
  ]

  get mode(): string {
    if (this.$route.name) {
      return this.$route.name
    }
    return ''
  }

  get companyComponent(): any {
    const link: SidebarLink | undefined = this.links.find(
      (link) => link.name && link.name.includes(this.mode)
    )
    if (link) {
      return link.component
    }
    return CompanyRatesList
  }
}
</script>