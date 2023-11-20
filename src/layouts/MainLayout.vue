<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <!-- <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-btn color="primary" :label="selectedLang">
              <q-menu
                transition-show="scale"
                transition-hide="scale"
                auto-close
              >
                <q-list v-for="item in langs" :key="item" style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section @click="selectLangFun(item)">{{item.name}}</q-item-section>
                  </q-item>
                  
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div> -->
          <q-select
            v-model="locale"
            :options="localeOptions"
            @update:model-value="selectedLang"
            dense
            borderless
            emit-value
            map-options
            options-dense
            style="min-width: 50px; margin-right: 10px;"
          />

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <q-item-label
          header
        >
          Pages
        </q-item-label>

        <PagesRoute
          v-for="page in pages"
          :key="page.title"
          v-bind="page"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import PagesRoute from 'components/PagesRoute.vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useI18n } from 'vue-i18n';


const pages = [
  {
    title: 'Product',
    // caption: 'quasar.dev',
    icon: 'style',
    route: '/product'
  }
]
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: '/product'
  },

]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    PagesRoute
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const { locale } = useI18n({ useScope: 'global' })

    locale.value = JSON.parse(localStorage.getItem('lang'))
    function selectedLang(item){
      localStorage.setItem('lang', JSON.stringify(locale.value))
    }

    return {
      essentialLinks: linksList,
      pages,
      leftDrawerOpen,
      selectedLang,
      locale,
      localeOptions: [
        { value: 'name_uz', label: 'UZ' },
        { value: 'name_uk', label: 'UK' },
        { value: 'name_ru', label: 'RU' },
      ],
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
