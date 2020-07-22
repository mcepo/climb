<template>
  <div style='display:flex; flex-wrap:wrap;'>
    <v-card v-for="image in images" :key="image.id" class='image-list-item'>
      <image-list-item :image='image' ></image-list-item>
      <v-card-title>
        Dimensions: {{image.size[0]}}x{{image.size[1]}}
      </v-card-title>

      <v-card-subtitle>
        Added by: <router-link :to='"/admin/user/" + image.owner.id' >{{image.owner.name}}</router-link>
        <br>Added at: {{new Date(image.created_at).toLocaleString()}}
      </v-card-subtitle>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon title='Verify image' @click='verifyImage(image)'>
          <v-icon>done</v-icon>
        </v-btn>
   </v-card-actions>
    </v-card>
  </div>
</template>

<style>

.image-list-item {
  background-color: lightgray;
  margin: 5px;
  width: 400px;
}

</style>
<script>
import ImageListItem from '../../../components/listItems/ImageListItem'
import api from '../../../store/api'

export default {
  props: {
    images: Array
  },
  components: {
    ImageListItem
  },
  methods: {
    verifyImage (image) {
      this.$store.commit('snackbar/show', 'Updating image ... ', { root: true })

      api
        .get('imageReviewed/' + image.id)
        .then(() => {
          // eslint-disable-next-line @typescript-eslint/camelcase
          image.reviewer_id = this.$store.state.auth.user.id
          this.$store.commit('image/add', image, { root: true })
          this.$store.commit('snackbar/success', 'Image approved!', { root: true })
        })

      // update image reviewer_id in image object
      // send changes to server
      // update changes in store
    }
  }
}
</script>
