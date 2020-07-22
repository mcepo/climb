
  <template>
  <popup :tag='tag' :item='item' type='image'>
    <template v-slot:header>
        <img :src="imageLink(item.id)" onerror="this.style.display='none'" width="100%" />
    </template>
  </popup>
</template>

<script>
import Vue from 'vue'
import Popup from './Popup.vue'

export default Vue.extend({
  props: ['item', 'tag'],
  components: {
    Popup
  },
  methods: {
    imageLink (id) {
      return '/api/image/' + id + '/thumbnail'
    }
  }
})
</script>
