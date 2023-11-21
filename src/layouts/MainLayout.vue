<template>
  <q-layout style="background: #F8F7FA" view="lHh Lpr lFf">
    <div class="header-box">
      <div :style="toggleLeftDrawer ? 'width: calc(100% - 280px); transition: width 0.3s;' : ''" class="header-style">
        <q-toolbar>
          <q-toolbar-title>
            Quasar App
          </q-toolbar-title>
            <!-- <q-select
              v-model="locale"
              :options="localeOptions"
              @update:model-value="selectedLang"
              dense
              borderless
              emit-value
              map-options
              options-dense
              color="negative"
              style="min-width: 50px; margin-right: 10px;"
            /> -->

             <q-btn icon="translate" dense flat>
              <q-menu
                transition-show="jump-down"
                transition-hide="jump-up"
              >
                <q-list style="min-width: 70px; text-align: center">
                  <q-item class="bg-primary" @click="selectedLang({ value: 'name_uz', label: 'UZ' })" clickable v-close-popup>
                    <q-item-section>UZ</q-item-section>
                  </q-item>
                  <q-item class="" @click="selectedLang({ value: 'name_uk', label: 'UK' })" clickable v-close-popup>
                    <q-item-section>UK</q-item-section>
                  </q-item>
                  <q-item class="" @click="selectedLang({ value: 'name_ru', label: 'RU' })" clickable v-close-popup>
                    <q-item-section>RU</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>

          <div>Quasar v{{ $q.version }}</div>
        </q-toolbar>
      </div>
    </div>



    <div class="sidebar" :class="toggleLeftDrawer ? 'sidebar-full': '' ">
      <q-list>
        <q-item>
          <q-item-section>
            <q-icon
              size="sm"
              name="menu"
              style="cursor:pointer"
              v-if="!toggleLeftDrawer"
              @click="toggleLeftDrawer = !toggleLeftDrawer"
            />
            <div style="display:flex; justify-content:space-between" v-else>
              <p style="color: #fff; font-size: 20px; margin: 0">Quasar</p>
              <q-icon
                size="sm"
                name="menu"
                style="cursor:pointer"
                @click="toggleLeftDrawer = !toggleLeftDrawer"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <q-list
          v-for="page in pages"
          :key="page.title"
      >
         <q-item
            clickable
            tag="a"
            class="page-data"
            :class="route.path == page.route ? 'active-menu': ''"
            @click="router.push(page.route)"
            :style="!toggleLeftDrawer ? 'padding-left:16px' : ''"
          >
            <q-item-section
              v-if="page.icon"
              avatar
            >
              <q-icon :name="page.icon" />
            </q-item-section>

            
            <q-item-section v-if="toggleLeftDrawer">
              <q-item-label >{{ $t(page.title) }}</q-item-label>
              <q-item-label>{{ page.caption }}</q-item-label>
            </q-item-section>
        </q-item>
      </q-list>

    </div>


    <q-page-container style="margin-top: 80px" :style="!toggleLeftDrawer ? 'margin-left:60px; transition: margin-left 0.3s;' : 'margin-left:250px; transition: margin-left 0.3s;'">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n';
import {useRouter, useRoute} from "vue-router"


const pages = [
  {
    title: 'product',
    // caption: 'quasar.dev',
    icon: 'style',
    route: '/product'
  },
  {
    title: 'kanban',
    // caption: 'quasar.dev',
    icon: 'view_kanban',
    route: '/product-kanban'
  },
]


export default defineComponent({
  name: 'MainLayout',

  setup () {
    const toggleLeftDrawer = ref(false)
    const { locale } = useI18n({ useScope: 'global' })
    const router = useRouter()
    const route = useRoute()

    locale.value = JSON.parse(localStorage.getItem('lang'))
    function selectedLang(item){
      locale.value = item.value
      localStorage.setItem('lang', JSON.stringify(locale.value))
    }

    return {
      pages,
      router,
      route,
      selectedLang,
      locale,
      localeOptions: [
        { value: 'name_uz', label: 'UZ' },
        { value: 'name_uk', label: 'UK' },
        { value: 'name_ru', label: 'RU' },
      ],
      toggleLeftDrawer
    }
  }
})
</script>
<style lang="scss">

// .header-style .q-field__native > span{
//   color: #fff;
// }
.header-style .q-select__dropdown-icon{
  color: #fff;
}



</style>