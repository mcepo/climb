<template>
    <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left"></th>
          <th class="text-left">Link</th>
          <th class="text-left"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(link, index) in links" :key="link.id">
          <td>{{ index + 1 }}</td>
          <td><a :href=link.href target="_blank">{{ link.name }}</a></td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: ['links']
}
</script>
