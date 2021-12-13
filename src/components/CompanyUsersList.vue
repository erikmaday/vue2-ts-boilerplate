<template>
  <div>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="userId"
      collection-name-singular="user"
      collection="users"
      :fetchMethod="usersTableView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import { usersTableView, deleteUser } from '@/services/users'
import { User } from '@/models/dto'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'

@Component({
  components: { CUDataTable, CUCollectionTable },
})
export default class CompanyUsers extends Vue {
  columns: DataTableColumn[] = [
    {
      text: 'Name',
      value: 'name',
      computedText: (row: User): string => `${row.firstName} ${row.lastName}`,
    },
    { text: 'Email', value: 'email' },
    { text: 'Type', value: 'groupName' },
    { text: 'Details', value: 'details' },
    { text: 'Actions', value: 'actions' },
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
      confirmModal: true,
      confirmModalText: 'Are you sure you want to delete this user?',
      action: (row: User): void => {
        deleteUser(row.userId)
      },
    },
  ]
}
</script>
