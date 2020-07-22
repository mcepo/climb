<template>
  <v-card flat>
    <v-toolbar flat dense>
      <v-spacer></v-spacer>
      <v-btn v-if="formComponent" text icon title="Close" @click.stop="closeForm">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <component :is="formComponent" v-bind="formParams"></component>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      formComponent: s => s.form.component,
      formParams: s => s.form.params
    })
  },
  methods: {
    ...mapActions({
      closeForm: 'form/close'
    })
  },
  components: {

    'area-form': () => import('../forms/AreaForm.vue'),
    'route-form': () => import('../forms/RouteForm.vue'),
    'image-upload-form': () => import('../forms/ImageUploadForm.vue'),
    'route-filters-form': () => import('../forms/RouteFiltersForm.vue'),
    'pitch-form': () => import('../forms/PitchForm.vue'),
    'moderator-form': () => import('../../admin/components/forms/ModeratorForm'),
    'login-form': () => import('../auth/Login.vue'),
    'register-form': () => import('../auth/Register.vue')
  }
}
</script>
