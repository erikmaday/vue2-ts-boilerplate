<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          src="https://c.tenor.com/igRLRCPgjvEAAAAC/its-happening-michael-scott.gif"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          The Future Home of CharterUp for Operators
        </h1>
        <v-text-field outlined>Test Button</v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "HelloWorld",

  data: () => ({}),
});
</script>
