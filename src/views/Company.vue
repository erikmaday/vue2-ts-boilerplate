<template>
  <MainWithNavigation :sidebarWidth="278">
    <template v-slot:navigation>
      <CompanySidebar :links="links" :mode="mode" />
    </template>
    <template v-slot:top-bar-content>
      <TheAppBar />
    </template>
    <template v-slot:default>
      <component :is="companyComponent" />
    </template>
  </MainWithNavigation>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { SidebarLink } from '@/models/SidebarLink'
import CompanySidebar from '@/components/CompanySidebar.vue'
import MainWithNavigation from '@/layouts/MainWithNavigation.vue'
import TheAppBar from '@/components/TheAppBar.vue'
import TheSideBar from '@/components/TheSideBar.vue'
import Users from '@/views/Users.vue'
import Vehicles from '@/views/Vehicles.vue'
import Garages from '@/views/Garages.vue'
import Rates from '@/views/Rates.vue'
import Settings from '@/views/Settings.vue'
import Availability from '@/views/Availability.vue'

@Component({
  components: {
    CompanySidebar,
    MainWithNavigation,
    TheAppBar,
    TheSideBar,
    Users,
    Garages,
    Rates,
    Settings,
    Availability,
    Vehicles,
  },
})
export default class Company extends Vue {
  links: Array<SidebarLink> = [
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
      component: Rates,
      icon: 'rates',
    },
    {
      label: 'Availability',
      href: 'availability',
      name: 'availability',
      component: Availability,
      icon: 'event_available',
    },
    {
      label: 'Rates',
      href: 'settings',
      name: 'settings',
      component: Settings,
      icon: 'settings',
    },
  ]

  get mode(): string {
    if (this.$route.name) {
      return this.$route.name
    }
    return ''
  }

  get companyComponent() {
    const link: SidebarLink | undefined = this.links.find(
      (link) => link.name === this.mode
    )
    if (link) {
      return link.component
    }
    return null
  }
}
</script>
