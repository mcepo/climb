<template>
  <v-expansion-panels flat v-if='hasAnyModerators'>
    <v-expansion-panel>
      <v-expansion-panel-header>Moderators</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list>

          <v-list-item
            v-for="moderator in moderators"
            :key="moderator.id"
          >

            <v-list-item-content>
              <v-list-item-title v-text="moderator.name"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-action >
              <div>
                <v-btn icon @click.stop="remove(moderator)"><v-icon>delete</v-icon></v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>

import api from '../../store/api'

export default {
  props: ['moderators', 'area'],
  computed: {
    hasAnyModerators () {
      return this.moderators.length !== 0
    }
  },
  methods: {
    remove (moderator) {
      api.get('/user/' + moderator.id + '/removeArea/' + this.area.id)
        .then(() => {
          this.$store.commit('area/removeModerator', { area: this.area, moderator })
          this.$store.commit('snackbar/success', moderator.name + ' removed as moderator to ' + this.area.name)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
