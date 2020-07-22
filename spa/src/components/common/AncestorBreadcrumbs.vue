<template>
  <v-breadcrumbs :items="ancestors" divider="/">
    <template v-slot:item="props">
      <router-link
        :to="props.item.id ? '/area/'+props.item.id : '/'"
      >{{ props.item.name }}</router-link>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: {
    ancestorIds: Array
  },
  computed: {
    ancestors () {
      if (!this.ancestorIds) return []

      const ancestors = []

      ancestors.push({
        id: 0,
        name: 'Home'
      })

      this.ancestorIds.forEach((id) => {
        const ancestor = this.$store.state.area.byIds[id]

        ancestor && ancestors.push(ancestor)
      })

      return ancestors
    }
  }
}
</script>
