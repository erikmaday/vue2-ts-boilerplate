<template>
  <MainWithSidebar>
    <template v-slot:navigation>
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
import { Vue, Component } from 'vue-property-decorator'
import { SidebarLink } from '@/models/SidebarLink'
import MainWithSidebarNavigation from '@/components/MainWithSidebarNavigation.vue'
import MainWithSidebar from '@/layouts/MainWithSidebar.vue'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideBar from '@/components/TheSideBar.vue'
import Users from '@/components/Users.vue'
import Vehicles from '@/components/Vehicles.vue'
import Garages from '@/views/Garages.vue'
import CompanyRates from '@/components/Rates.vue'
import CompanySettings from '@/components/Settings.vue'
import CompanyAvailability from '@/components/Availability.vue'
import { toTitle } from '@/utils/string'
import { Component as VueComponent } from 'vue'

@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    TheAppBar,
    TheSideBar,
    Users,
    Garages,
    CompanyRates,
    CompanySettings,
    CompanyAvailability,
    Vehicles,
  },
})
export default class Company extends Vue {
  links: SidebarLink[] = [
    {
      label: 'Users',
      href: 'users',
      name: 'users',
      component: Users,
      icon: 'users',
    },
    {
      label: 'Vehicles',
      href: 'vehicles',
      name: 'vehicles',
      component: Vehicles,
      icon: 'directions_bus',
    },
    {
      label: 'Garages',
      href: 'garages',
      name: 'garages',
      component: Garages,
      icon: 'garages',
    },
    {
      label: 'Rates',
      href: 'rates',
      name: 'rates',
      component: CompanyRates,
      icon: 'rates',
    },
    {
      label: 'Availability',
      href: 'availability',
      name: 'availability',
      component: CompanyAvailability,
      icon: 'event_available',
    },
    {
      label: 'Rates',
      href: 'settings',
      name: 'settings',
      component: CompanySettings,
      icon: 'settings',
    },
  ]

  get mode(): string {
    if (this.$route.name) {
      return this.$route.name
    }
    return ''
  }

  get companyComponent(): VueComponent {
    const link: SidebarLink | undefined = this.links.find(
      (link) => link.name && link.name.includes(this.mode)
    )
    if (link) {
      return link.component
    }
    return Users
  }

  toTitle = toTitle
}
</script>
