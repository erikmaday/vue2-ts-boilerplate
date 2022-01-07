<template>
  <MainWithSidebar>
    <template #navigation>
      <MainWithSidebarNavigation :links="links" :mode="mode" />
    </template>

    <template v-slot:default>
      <component :is="profileComponent" />
    </template>
  </MainWithSidebar>
</template>

<script lang="ts">
import MainWithSidebar from '@/layouts/MainWithSidebar.vue'
import { Vue, Component } from 'vue-property-decorator'
import MainWithSidebarNavigation from '@/components/MainWithSidebarNavigation.vue'
import UsersDetail from '@/views/UsersDetail.vue'
import ProfilePassword from '@/views/ProfilePassword.vue'
import { SidebarLink } from '@/models/SidebarLink'
import { toTitle } from '@/utils/string'

@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    UsersDetail,
    ProfilePassword,
  },
})
export default class CompanyRates extends Vue {
  toTitle = toTitle
  links: SidebarLink[] = [
    {
      label: 'Profile',
      href: '',
      name: 'profile',
      component: UsersDetail,
      icon: 'person',
    },
    {
      label: 'Password',
      href: 'password',
      name: 'profile.password',
      component: ProfilePassword,
      icon: 'lock',
    },
  ]

  get mode(): string {
    if (this.$route.name) {
      return this.$route.name
    }
    return ''
  }

  get profileComponent(): any {
    const link: SidebarLink | undefined = this.links.find(
      (link) => link.name && link.name.includes(this.mode)
    )
    if (link) {
      return link.component
    }
    return UsersDetail
  }
}
</script>
