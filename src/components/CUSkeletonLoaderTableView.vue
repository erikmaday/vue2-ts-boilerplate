<template>
  <div v-if="$vuetify.breakpoint.smAndUp">
    <div v-for="n in 10" :key="`table-loader-${n}`">
      <v-row class="h-100" justify="space-around" align="center">
        <template v-for="n in 7">
          <v-skeleton-loader
            :key="`cell-${n}`"
            type="table-cell"
          />
        </template>
      </v-row>
      <v-skeleton-loader
        type="divider"
      />
    </div>
    <v-skeleton-loader type="table-tfoot" />
  </div>
  <div v-else>
    <v-skeleton-loader
      v-for="n in 3"
      :key="`skeleton-loader-card-${n}`"
      class="margin-y-4"
      min-width="100%"
      type="image"
    />
  </div>
</template>
