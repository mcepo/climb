<template>
    <activity-list :activities='activities' style='height:95vh; overflow:auto'></activity-list>
</template>

<script>

import ActivityList from '../components/lists/ActivityList'

export default {
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Role', value: 'role_id' }
      ]
    }
  },
  computed: {
    activities () {
      return this.$store.getters['activity/notApproved']
    }
  },
  created () {
    this.$store.dispatch('activity/fetchNotApproved')
  },
  components: {
    ActivityList
  }
}
</script>
