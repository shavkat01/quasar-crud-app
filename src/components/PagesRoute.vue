<template>
    <q-item
      clickable
      tag="a"
      @click="router.push(route)"
    >
        <q-item-section
          v-if="icon"
          avatar
        >
          <q-icon :name="icon" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>{{ caption }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script>
import {useRouter} from "vue-router"
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PagesRoute',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    route: {
      type: String,
      // default: '#'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  setup(){
    const router = useRouter()

    return{
      router
    }
  }
})
</script>
