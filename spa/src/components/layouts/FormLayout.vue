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

    'area-form': () => import(/* webpackChunkName: "area.form" */'../forms/AreaForm.vue'),
    'route-form': () => import(/* webpackChunkName: "route.form" */'../forms/RouteForm.vue'),
    'image-upload-form': () => import(/* webpackChunkName: "image.upload" */'../forms/ImageUploadForm.vue'),
    'route-filters-form': () => import(/* webpackChunkName: "route.filters" */'../forms/RouteFiltersForm.vue'),
    'pitch-form': () => import(/* webpackChunkName: "pitch.form" */'../forms/PitchForm.vue'),
    'moderator-form': () => import(/* webpackChunkName: "moderator.form" */'../../admin/components/forms/ModeratorForm'),
    'login-form': () => import(/* webpackChunkName: "login.form" */'../auth/Login.vue'),
    'register-form': () => import(/* webpackChunkName: "register.form" */'../auth/Register.vue')
  }
}
</script>
