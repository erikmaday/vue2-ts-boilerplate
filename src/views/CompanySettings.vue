<template>
  <MainWithSidebar>
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
import { Vue, Component } from 'vue-property-decorator'
import MainWithSidebarNavigation from '@/components/MainWithSidebarNavigation.vue'
import CompaniesDetail from '@/views/CompaniesDetail.vue'
import { SidebarLink } from '@/models/SidebarLink'
import { toTitle } from '@/utils/string'

@Component({
  components: {
    MainWithSidebarNavigation,
    MainWithSidebar,
    CompaniesDetail,
  },
})
export default class Profile extends Vue {
  toTitle = toTitle
  links: SidebarLink[] = [
    {
      label: 'Information',
      href: '',
      name: 'settings',
      component: CompaniesDetail,
      icon: 'business',
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
    return CompaniesDetail
  }
}
</script>
