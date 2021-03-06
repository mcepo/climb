<template>
  <div>
    <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        v-if="(!$refs.upload || !$refs.upload.active) && files.length "
        @click.prevent="$refs.upload.active = true"
      >Upload</v-btn>
    </v-toolbar>

    <v-card text flat>
      <v-container fluid grid-list-lg>
        <v-layout row wrap>
          <v-flex v-for="file in files" :key="file.id" xs12>
            <v-card>
              <v-img v-if="file.thumb" :src="file.thumb"></v-img>
              <v-card-text v-if='$refs.upload.active'>
                <v-progress-linear :value="file.progress + '%'"></v-progress-linear>
                <div>{{(file.speed/1000).toFixed(2)}} Kbit/s</div>
              </v-card-text>
              <v-card-text v-if='file.error' style='color:red'>
                An error occurred, unable to upload.
              </v-card-text>
              <v-card-actions>
                <v-btn title="Edit" icon @click.prevent="onEditFileShow(file)">
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn title="Remove" icon @click.prevent="$refs.upload.remove(file)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <file-upload
            class="ma-auto"
            :post-action="postAction"
            :extensions="extensions"
            :accept="accept"
            :multiple="multiple"
            :thread="thread"
            :add-index="addIndex"
            :headers='headers'
            v-model="files"
            @input-filter="inputFilter"
            @input-file="inputFile"
            name="image"
            ref="upload"
          >
            <v-card-text v-if='!online' style='color:red'>
              Can't upload images while offline,<br> please try again later!
            </v-card-text>
            <v-btn v-else color="info">Select photos</v-btn>
          </file-upload>
        </v-layout>
      </v-container>
    </v-card>

    <v-dialog v-model="editFile.show" max-width="900px">
      <v-card>
        <v-card-title class="headline">
          <v-spacer></v-spacer>
          <v-btn title="Close" icon @click.prevent="editFile.show = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <div
            v-if="editFile.show && editFile.blob && editFile.type && editFile.type.substr(0, 6) === 'image/'"
          >
            <img ref="editImage" :src="editFile.blob" style="max-width: 100%">
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn @click="editFile.cropper.rotate(-90)" title="Rotate counter clockwise">
            <v-icon>rotate_left</v-icon>
          </v-btn>
          <v-btn @click="editFile.cropper.rotate(90)" title="Rotate clockwise">
            <v-icon>rotate_right</v-icon>
          </v-btn>
          <v-btn @click="editFile.cropper.crop()" title="Crop">Crop</v-btn>
          <v-btn @click="editFile.cropper.clear()" title="Clear changes">Clear</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click.prevent="onEditorFile">Save</v-btn>
          <v-btn color="error" @click="close">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style>
</style>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import FileUpload from 'vue-upload-component'

export default {
  components: {
    FileUpload
  },
  props: ['type', 'id'],

  data () {
    return {
      files: [],
      accept: 'image/png,image/jpeg,image/webp',
      extensions: 'jpg,jpeg,png,webp',
      minSize: 1024 * 1024, // image min size is 1MB
      maxSize: 1024 * 1024 * 30, // image max size is 30MB
      multiple: true,
      addIndex: false,
      thread: 3,
      editFile: {
        show: false
      }
    }
  },
  computed: {
    postAction () {
      return '/api/' + this.type + '/' + this.id + '/image'
    },
    headers () {
      return {
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Bearer ' + this.$store.state.auth.token
      }
    },
    online () {
      return this.$store.state.online
    }
  },

  watch: {
    'editFile.show' (newValue, oldValue) {
      // error
      if (!newValue && oldValue) {
        this.$refs.upload.update(this.editFile.id, {
          error: this.editFile.error || ''
        })
      }

      if (newValue) {
        // the nextTick is required because i want to add cropper only after
        // the associated img tag is added to the DOM, else it won't work
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return
          }
          const cropper = new Cropper(this.$refs.editImage, {
            autoCrop: false
          })
          this.editFile = {
            ...this.editFile,
            cropper
          }
        })
      }
    }
  },

  methods: {
    close () {
      this.$store.dispatch('form/close')
    },
    inputFilter (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file

        // Filter system files or hide files
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          this.$store.dispatch('snackbar/error', 'Forbidden file type.')
          return prevent()
        }

        // Filter php html js file
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          this.$store.dispatch('snackbar/error', 'Forbidden file type.')
          return prevent()
        }

        if (newFile.size < this.minSize) {
          this.$store.dispatch('snackbar/error', 'Image low quality.')
          return prevent()
        }

        if (newFile.size > this.maxSize) {
          this.$store.dispatch('snackbar/error', 'Image too big, max 30MB.')
          return prevent()
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        // Create a blob field
        newFile.blob = ''
        const URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.blob = URL.createObjectURL(newFile.file)
        }

        // Thumbnails
        newFile.thumb = ''
        if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
          newFile.thumb = newFile.blob
        }
      }
    },

    // add, update, remove File Event
    inputFile (newFile, oldFile) {
      if (newFile && oldFile) {
        // update

        if (newFile.error && !oldFile.error) {
          // don't think this will ever run, because i'm not setting any errors anywhere
          this.$store.dispatch('snackbar/error', 'Error occurred while uploading one of the images')
        }

        if (newFile.success && !oldFile.success) {
          this.$store.commit('image/add', newFile.response)

          this.$store.commit(this.type + '/appendImage', { id: this.id, imageId: newFile.response.id })

          this.$store.dispatch('snackbar/success', 'Image uploaded.')

          this.$refs.upload.remove(newFile)
        }
      }
    },

    onEditFileShow (file) {
      this.editFile = { ...file, show: true }
    },

    onEditorFile () {
      if (!this.$refs.upload.features.html5) {
        this.$store.dispatch('snackbar/error', 'Your browser does not support this feature')
        this.editFile.show = false
        return
      }

      const data = {
        name: this.editFile.name
      }
      if (this.editFile.cropper) {
        const binStr = atob(
          this.editFile.cropper
            .getCroppedCanvas()
            .toDataURL(this.editFile.type)
            .split(',')[1]
        )
        const arr = new Uint8Array(binStr.length)
        for (let i = 0; i < binStr.length; i++) {
          arr[i] = binStr.charCodeAt(i)
        }
        data.file = new File([arr], data.name, { type: this.editFile.type })
        data.size = data.file.size
      }
      this.$refs.upload.update(this.editFile.id, data)
      this.editFile.error = ''
      this.editFile.show = false
    }
  }
}
</script>
