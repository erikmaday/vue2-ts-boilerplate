<template>
  <MainWithSidebar
    :mobile-view-on-breakpoint="mode === 'rates' ? undefined : 'md'"
  >
    <template #navigation>
      <MainWithSidebarNavigation :links="links" :mode="mode" />
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
import RatesList from '@/views/RatesList.vue'
import { SidebarLink } from '@/models/SidebarLink'
import { toTitle } from '@/utils/string'
import AdjustmentDetail from './AdjustmentDetail.vue'
import AdjustmentsList from './AdjustmentsList.vue'

@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    RatesList,
    AdjustmentDetail,
  },
})
export default class CompanyRates extends Vue {
  toTitle = toTitle
  links: SidebarLink[] = [
    {
      label: 'Rates',
      href: '',
      name: 'rates',
      component: RatesList,
      icon: 'rates',
    },
    {
      label: 'Adjustments',
      href: '/adjustments',
      name: 'rates.adjustments',
      component: AdjustmentsList,
      icon: 'swapVert',
    },
    {
      label: 'Adjustments',
      href: '/adjustments/edit/:id',
      name: 'rates.adjustments.edit',
      component: AdjustmentDetail,
      hide: true,
    },
    {
      label: 'Adjustments',
      href: '/adjustments/add',
      name: 'rates.adjustments.add',
      component: AdjustmentDetail,
      hide: true,
    },
    {
      label: 'Adjustments',
      href: '/adjustments/view/:id',
      name: 'rates.adjustments.view',
      component: AdjustmentDetail,
      hide: true,
    },
  ]

  get mode(): string {
    if (this.$route.name.includes('adjustments')) {
      return 'rates.adjustments'
    }
    return 'rates'
  }

  get companyComponent(): any {
    const link: SidebarLink | undefined = this.links.find(
      (link) => link.name && link.name.includes(this.$route.name)
    )
    if (link) {
      return link.component
    }
    return RatesList
  }
}
</script>
