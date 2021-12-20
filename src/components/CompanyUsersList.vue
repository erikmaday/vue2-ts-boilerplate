<template>
  <div>
    <v-row justify="space-between" class="padding-b-6 padding-x-3">
      <h1>Team</h1>
      <v-btn primary small color="primary" @click="$router.push({ name: 'users.add' })">Add New</v-btn>
    </v-row>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="userId"
      collection="users"
      :fetch-method="usersTableView"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import user from '@/services/user'
import { User } from '@/models/dto'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { AxiosResponse } from 'axios'

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
    { text: 'Email', value: 'email', type: 'email' },
    { text: 'Type', value: 'groupName' },
    { text: 'Details', value: 'details', type: 'details' },
    { text: 'Actions', value: 'actions', type: 'actions' },
  ]

  usersTableView = user.tableView

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
      action: (row: User) => {
        return user.delete(row.userId)
      },
    },
  ]
}
</script>
