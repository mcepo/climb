<template>
  <table class='pitch_table'>
      <thead>
        <tr>
          <th class="text-left">Pitch</th>
          <th class="text-left">Grade</th>
          <th class="text-left">Length</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(pitch, index) in pitches"
          :key="index"
          @mouseenter="onMouseEnter(type + pitch.id)"
          @mouseleave="onMouseLeave()"
          :class="{pitch_row_hover: highlighted(type + pitch.id)}"
          >
          <td>{{ index + 1 }}</td>
          <td>{{ forgeGrade(pitch.grades) }}</td>
          <td>{{ pitch.length ? pitch.length + 'm' : ''}}</td>
          <td>
            <tag-control v-if="notMap" type="pitch" :item="pitch"></tag-control>
            <v-btn text icon @click.stop="openAuthorizedForm({form: {component: 'pitch-form', params: {pitch, route}}, item:pitch})">
              <v-icon>edit</v-icon>
            </v-btn>
            <delete-button type="pitch" :item="pitch"></delete-button>
          </td>
        </tr>
      </tbody>
  </table>
</template>
<style lang='scss'>
.pitch_row_hover {
  background-color: lightgray;
}
.pitch_table {
  cursor: pointer;
  border-spacing: 0px;
  tr > td:first-child, th:first-child {
    padding-left:20px;
    }
}
</style>
<script>
import TagControl from '../buttons/TagControl'
import DeleteButton from '../buttons/DeleteButton'
import gradeService from '../../services/grade.service'
import { mapActions } from 'vuex'

import { ItemType } from '../../services/type.service'

import highlight from '../../services/highlight.service'

export default {
  props: ['route'],
  computed: {
    type () {
      return ItemType.Pitch
    },
    notMap () {
      return !!this.$route.params.imageId
    },
    pitches () {
      const pitches = []

      this.route.pitches && this.route.pitches.forEach((id) => {
        const pitch = this.$store.state.pitch.byIds[id]

        pitch && pitches.push(pitch)
      })

      return pitches
    }
  },
  methods: {
    ...mapActions({
      openAuthorizedForm: 'form/authorizeAndOpen'
    }),
    onMouseEnter (key) {
      highlight.key = key
    },
    onMouseLeave () {
      highlight.key = null
    },
    forgeGrade (grades) {
      return grades ? gradeService.forge(grades) : ''
    },
    highlighted (key) {
      return key === highlight.key
    }
  },
  components: {
    TagControl,
    DeleteButton
  }
}
</script>
