<template>
  <div>
    <CUCollectionTable
      :actions="actions"
      :headers="headers"
      item-key="userId"
      collectionNameSingular="user"
      collection="users"
      :fetchMethod="usersTableView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import { usersTableView, deleteUser } from '@/services/users'
import { User } from '@/models/dto'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableHeader } from '@/models/DataTableHeader'

@Component({
  components: { CUDataTable, CUCollectionTable },
})
export default class CompanyUsers extends Vue {
  headers: DataTableHeader[] = [
    {
      text: 'Name',
      value: 'name',
      computedText: (row: User): string => `${row.firstName} ${row.lastName}`,
    },
    { text: 'Email', value: 'email' },
    { text: 'Type', value: 'groupName' },
    { value: 'details' },
    { value: 'actions' },
  ]

  usersTableView = usersTableView

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit User',
      action: (row: User): void => {
        this.$router.push({
          name: 'users.edit',
          params: { id: String(row.userId) },
        })
      },
    },
    {
      displayText: 'Delete User',
      key: 'delete',
      color: 'error',
      icon: 'trash',
      action: (row: User): void => {
        deleteUser(row.userId)
      },
    },
  ]
}
</script>
