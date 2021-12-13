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
import CompanyUsers from '@/components/CompanyUsers.vue'
import CompanyVehicles from '@/components/CompanyVehicles.vue'
import CompanyGarages from '@/components/CompanyGarages.vue'
import CompanyRates from '@/components/CompanyRates.vue'
import CompanySettings from '@/components/CompanySettings.vue'
import CompanyAvailability from '@/components/CompanyAvailability.vue'
import CompanyUsersEdit from '@/components/CompanyUsersEdit.vue'
import { toTitle } from '@/utils/string'
import { Component as VueComponent } from 'vue'

@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    TheAppBar,
    TheSideBar,
    CompanyUsers,
    CompanyGarages,
    CompanyRates,
    CompanySettings,
    CompanyAvailability,
    CompanyVehicles,
    CompanyUsersEdit,
  },
})
export default class Company extends Vue {
  links: SidebarLink[] = [
    {
      label: 'Users',
      href: 'users',
      name: 'users',
      component: CompanyUsers,
      icon: 'users',
      visible: true,
    },
    {
      label: 'Edit User',
      href: 'users/edit',
      name: 'users.edit',
      component: CompanyUsersEdit,
      visible: false,
    },
    {
      label: 'Vehicles',
      href: 'vehicles',
      name: 'vehicles',
      component: CompanyVehicles,
      icon: 'directions_bus',
      visible: true,
    },
    {
      label: 'Garages',
      href: 'garages',
      name: 'garages',
      component: CompanyGarages,
      icon: 'garages',
      visible: true,
    },
    {
      label: 'Rates',
      href: 'rates',
      name: 'rates',
      component: CompanyRates,
      icon: 'rates',
      visible: true,
    },
    {
      label: 'Availability',
      href: 'availability',
      name: 'availability',
      component: CompanyAvailability,
      icon: 'event_available',
      visible: true,
    },
    {
      label: 'Rates',
      href: 'settings',
      name: 'settings',
      component: CompanySettings,
      icon: 'settings',
      visible: true,
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
      (link) => link.name === this.mode
    )
    if (link) {
      return link.component
    }
    return CompanyUsers
  }

  toTitle = toTitle
}
</script>
