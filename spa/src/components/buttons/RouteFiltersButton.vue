<template>
  <v-btn text title="Filters" :icon='icon' @click.stop="openAuthorizedForm({form: {component: 'route-filters-form'}})">
    <v-icon>filter_list</v-icon> <slot></slot>
  </v-btn>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  props: {
    icon: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen'
    })
  }
}
</script>
