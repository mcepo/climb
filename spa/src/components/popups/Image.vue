
  <template>
  <popup :tag='tag' :item='item' type='image'>
    <template v-slot:item>
      <v-img :src="imageLink(item.id)" onerror="this.style.display='none'" width="100%" >
        <v-overlay
          :absolute="true"
          :value="true"
        >
          Click me
        </v-overlay>
      </v-img>
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
