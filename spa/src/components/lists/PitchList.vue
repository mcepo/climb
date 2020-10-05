<template>
  <v-simple-table>
    <template v-slot:default>
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
          @mouseenter="onMouseEnter('pitch' + pitch.id)"
          @mouseleave="onMouseLeave()">
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
    </template>
  </v-simple-table>
</template>

<script>
import TagControl from '../buttons/TagControl'
import DeleteButton from '../buttons/DeleteButton'
import gradeService from '../../services/grade.service'
import { mapActions, mapMutations } from 'vuex'

export default {
  props: ['route'],
  computed: {
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
    ...mapMutations({
      onMouseEnter: 'highlight/set',
      onMouseLeave: 'highlight/set'
    }),
    forgeGrade (grades) {
      return grades ? gradeService.forge(grades) : ''
    },
    highlight (item) {
      return (
        this.$store.getters['highlight/id'] === 'pitch' + item.id
      )
    }
  },
  components: {
    TagControl,
    DeleteButton
  }
}
</script>
