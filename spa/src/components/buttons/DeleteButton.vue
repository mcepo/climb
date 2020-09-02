<template>
  <div style="display: inline;">
    <v-btn text :icon='!showText' @click.stop="showDialog()" :title="'Delete ' + type"  :block='showText' :class="{'menu-button': showText}">
      <v-icon>delete</v-icon>
      <div v-if='showText'>Delete</div>
    </v-btn>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title>Are you sure ?</v-card-title>
        <v-card-text
          >Deleting this {{ type }} will remove all refrences to it as well as
          all depended items.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text icon title="Dismiss action" @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn text icon title="Confirm delete" @click="confirmDelete()">
            <v-icon>check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import api from '../../store/api'
import { getUrl } from '../../router'

export default Vue.extend({
  props: {
    type: String,
    item: Object,
    returnBack: Boolean,
    showText: Boolean
  },
  data: () => {
    return {
      dialog: false
    }
  },
  methods: {
    showDialog () {
      this.$store.dispatch('auth/authorize', this.item).then(
        () => {
          this.dialog = true
        },
        () => {
          /* so the error won't get dumped in the console */
        }
      )
    },
    confirmDelete () {
      // area, route, trail, pitch, tag, image

      // if tag then take tagged_type and tagged_id and image_id
      // and remove it from there

      api.delete(this.type + '/' + this.item.id).then(() => {
        // if a tag is being deleted

        const imageId = this.$store.getters.openImage

        if (this.type === 'tag') {
          // if tag is on a image or map
          if (imageId) {
            this.$store.commit('image/removeImageTag', {
              imageId: imageId,
              tag: this.item
            })
          } else {
            // eslint-disable-next-line @typescript-eslint/camelcase
            this.$store.commit(
              this.item.tagged_type + '/removeMapTag',
              this.item.tagged_id
            )
          }
        } else {
          if (this.type === 'image' && parseInt(imageId) === this.item.id) {
            // the image that is being deleted is currently open
            // close the image when deleted
            this.$router.push(getUrl('image', null))
          }

          this.returnBack && this.$router.back()
          this.$store.commit(this.type + '/remove', this.item)
        }

        this.$store.commit('snackbar/success', 'Deleted!')
      })
      this.dialog = false
    }
  }
})
</script>
