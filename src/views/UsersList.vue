<template>
  <div>
    <v-row class="padding-b-6 padding-x-3">
      <v-col class="shrink">
        <h1>Team</h1>
      </v-col>
      <v-spacer />
      <v-col class="shrink">
        <v-btn
          primary
          small
          color="primary"
          @click="$router.push({ name: 'users.add' })"
        >
          Add New
        </v-btn>
      </v-col>
      <v-col class="shrink">
        <v-btn color="primary" small @click="isFilterDialogOpen = true">
          <CUIcon color="white" class="margin-r-2">filter</CUIcon>
          Filter
        </v-btn>
      </v-col>
    </v-row>

    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="userId"
      collection="users"
      :fetch-method="usersTableView"
    />
    <CUDataTableFilters v-model="isFilterDialogOpen" :columns="columns" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import user from '@/services/user'
import { User } from '@/models/dto'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { AxiosResponse } from 'axios'
import { Location } from 'vue-router'

@Component({
  components: { CUDataTable, CUCollectionTable, CUDataTableFilters },
})
export default class Users extends Vue {
  isFilterDialogOpen = false
  columns: DataTableColumn[] = [
    {
      text: 'Name',
      value: 'name',
      computedText: (row: User): string => `${row.firstName} ${row.lastName}`,
    },
    {
      text: 'Email',
      value: 'email',
      type: 'email',
    },
    { text: 'Type', value: 'groupName' },
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
      action: function (row: User): Promise<AxiosResponse> {
        return user.delete(row.userId)
      },
    },
    {
      displayText: 'Details',
      key: 'details',
      color: 'primary',
      icon: '',
      confirmModal: false,
      ariaLabel: 'View User Details',
      isDetail: true,
      detailRoute: (row: User): Location => {
        return {
          name: 'users.view',
          params: { id: row?.userId },
        }
      },
    },
  ]
}
</script>
