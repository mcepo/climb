<template>
  <v-data-table
    :headers="headers"
    :items="activities"
  >

    <template v-slot:item.created="{ item }">
      <div style='display:flex; flex-direction:column'>
        <span>{{new Date(item.created_at).toLocaleString()}}</span>
        <router-link v-if='item.causer' :to='"/admin/user/" + item.causer.id' >{{item.causer.name}}</router-link>
        <div>{{getDescription(item)}}</div>
        <a @click.stop='showItem(item)'>View item</a>
        <a @click.stop='approveActivity(item)'>Approve</a>
        <a @click.stop='revertActivity(item)'>Revert</a>
      </div>
    </template>
    <template v-slot:item.new="{ item }">
      <pre>{{JSON.stringify(item.properties.attributes, null, 2) }}</pre>
    </template>

    <template v-slot:item.properties="{ item }">
      <pre>{{JSON.stringify(item.properties.old, null, 2) }}</pre>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: ['activities'],
  data () {
    return {
      headers: [
        { text: 'Created', value: 'created' },
        { text: 'New', value: 'new' },
        { text: 'Old', value: 'old' }
      ]
    }
  },
  methods: {
    getDescription (item) {
      return item.description + ' ' + item.subject_type
    },
    approveActivity (item) {
      this.$store.dispatch('activity/approveActivity', item.id)
    },
    revertActivity (item) {
      this.$store.dispatch('activity/revertActivity', item.id)
    },
    showItem (item) {
      switch (item.subject_type) {
        case 'tag': this.processTagActivity(item.properties.attributes); break
        case 'pitch': this.$router.push('/route/' + item.subject.route_id); break
        case 'trail': this.$router.push('/area/' + item.subject.area_id); break
        default: this.$router.push('/' + item.subject_type + '/' + item.subject.id)
      }
    },
    processTagActivity (tag) {
      if (tag.image_id) {
        this.$router.push('/image/' + tag.image_id)
      } else {
        const areaId = tag.path.split('.').pop()
        this.$router.push('/area/' + areaId)
      }
    }
  }
}
</script>
