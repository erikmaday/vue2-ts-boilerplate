<template>
  <Main>
    <v-row class="padding-b-6">
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
      <CUDataTableFilterButton v-model="isFilterDialogOpen" />
    </v-row>
    <CUCollectionTable
      :actions="actions"
      :columns="columns"
      item-key="userId"
      collection="users"
      :fetch-method="usersTableView"
      :is-filter-dialog-open.sync="isFilterDialogOpen"
      no-data-text="No users found"
    />
  </Main>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Main from '@/layouts/Main.vue'
import CUDataTable from '@/components/CUDataTable.vue'
import CUCollectionTable from '@/components/CUCollectionTable.vue'
import CUDataTableFilters from '@/components/CUDataTableFilters.vue'
import CUDataTableFilterButton from '@/components/CUDataTableFilterButton.vue'
import user from '@/services/user'
import { UserDetail } from '@/models/dto'
import { ActionColumn } from '@/models/ActionColumn'
import { DataTableColumn } from '@/models/DataTableColumn'
import { AxiosResponse } from 'axios'
import { RawLocation } from 'vue-router'
import { EventBus } from '@/utils/eventBus'

@Component({
  components: {
    Main,
    CUDataTable,
    CUCollectionTable,
    CUDataTableFilters,
    CUDataTableFilterButton,
  },
})
export default class Users extends Vue {
  isFilterDialogOpen = false

  columns: DataTableColumn[] = [
    {
      _t_id: '1067e952-2af3-42f6-8d1b-2357ce81faa3',
      text: 'Name',
      value: 'name',
      computedText: (row: UserDetail): string =>
        `${row.firstName} ${row.lastName}`,
      filterable: true,
      sortable: true,
      method: 'or',
      filterProp: ['firstName', 'lastName'],
      filterType: 'contains',
      sortProp: 'lastName',
    },
    {
      _t_id: 'f26fbb7d-25f4-4da1-8492-42906d7d2181',
      text: 'Email',
      value: 'email',
      type: 'email',
      filterable: true,
      sortable: true,
      filterProp: 'email',
      filterType: 'contains',
      sortProp: 'email',
    },
    {
      _t_id: '12722781-c0be-469b-aefd-82c6af43550a',
      text: 'Type',
      value: 'groupName',
      filterable: true,
      sortable: true,
      filterProp: 'groupName',
      filterType: 'contains',
      sortProp: 'groupName',
    },
    {
      _t_id: 'a46c5350-5c2e-4d34-867b-971ec2ec545e',
      text: 'Actions',
      value: 'actions',
      type: 'actions',
    },
  ]

  usersTableView = user.tableView

  actions: ActionColumn[] = [
    {
      displayText: 'Edit',
      key: 'edit',
      icon: 'edit',
      color: 'primary',
      ariaLabel: 'Edit User',
      action: (row: UserDetail): void => {
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
      confirmModalPrimaryActionText: 'Delete User',
      action: function (row: UserDetail): Promise<AxiosResponse> {
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
      detailRoute: (row: UserDetail): RawLocation => {
        return {
          name: 'users.view',
          params: { id: row?.userId.toString() },
        }
      },
    },
  ]
}
</script>
