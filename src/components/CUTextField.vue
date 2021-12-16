<template>
    <div>
      <label v-if="$attrs.label">{{ $attrs.label }}</label>
      <v-text-field 
        v-bind="$attrs"
        solo
        :label="null"
        flat
        outlined
      />
    </div>
</template>