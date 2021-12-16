<template>
  <div>
    <label v-if="$attrs.label">{{ $attrs.label }}</label>
    <v-select v-bind="$attrs" :label="null" outlined solo flat />
  </div>
</template>
