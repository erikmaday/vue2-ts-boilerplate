<template>
  <div v-if="$vuetify.breakpoint.smAndUp">
    <v-row
      class="margin-y-0"
      justify="space-around"
      align="center"
      style="height: 59px"
    >
      <template v-for="n in 7">
        <CUSkeletonLoader :key="`header-cell-${n}`" type="table-header" />
      </template>
    </v-row>
    <CUSkeletonLoader type="divider" />

    <div v-for="n in 10" :key="`table-loader-${n}`">
      <v-row
        class="margin-y-0"
        justify="space-around"
        align="center"
        style="height: 79px"
      >
        <template v-for="n in 7">
          <CUSkeletonLoader :key="`cell-${n}`" type="table-cell" />
        </template>
      </v-row>
      <CUSkeletonLoader v-if="n !== 10" type="divider" />
    </div>
    <div class="padding-a-4 d-flex align-center">
      <v-spacer />
      <CUSkeletonLoader
        type="detail-text"
        width="64px"
        classes="margin-l-6 margin-r-8"
      />
      <CUSkeletonLoader type="avatar" height="52px" classes="margin-l-2" />
      <CUSkeletonLoader type="avatar" height="52px" classes="margin-l-2" />
    </div>
  </div>
  <div v-else>
    <CUSkeletonLoader
      v-for="n in 3"
      :key="`skeleton-loader-card-${n}`"
      class="margin-y-4"
      type="mobile-table-cell"
    />
  </div>
</template>
