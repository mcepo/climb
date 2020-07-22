<template>
  <v-btn
    text
    title="Upload photo"
    icon
    @click.stop="openForm({component: 'image-upload-form', params})"
  >
    <v-icon>add_photo_alternate</v-icon>
  </v-btn>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['params'],
  methods: {
    ...mapActions({
      openForm: 'form/open'
    })
  }
}
</script>
