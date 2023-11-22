<template>
  <q-layout style="background: #F8F7FA" view="lHh Lpr lFf">
    <div class="header-box">
      <div :style="toggleLeftDrawer ? 'width: calc(100% - 280px); transition: width 0.3s;' : ''" class="header-style">
        <q-toolbar>
          <q-toolbar-title>
            Quasar App
          </q-toolbar-title>
            <div style='display: flex; gap:5px'>

              <q-btn icon="translate" dense flat>
                <q-menu
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  :offset="[50, 10]"
                  auto-close
                >
                  
                  <q-list dense class="q-pa-sm" style="box-shadow: 0 4px 24px 0 rgba(34,41,47,.1); min-width: 70px; text-align: center">
                    <q-item class="rounded-borders " :class="locale == 'name_uz' ? 'bg-primary text-grey-1': ''" @click="selectedLang({ value: 'name_uz', label: 'UZ' })" clickable>
                      <q-item-section>Uz</q-item-section>
                    </q-item>
                    <q-item class="rounded-borders q-mt-xs" :class="locale == 'name_uk' ? 'bg-primary text-grey-1': ''" @click="selectedLang({ value: 'name_uk', label: 'UK' })" clickable>
                      <q-item-section>UK</q-item-section>
                    </q-item>
                    <q-item class="rounded-borders q-mt-xs" :class="locale == 'name_ru' ? 'bg-primary text-grey-1': ''" @click="selectedLang({ value: 'name_ru', label: 'RU' })" clickable>
                      <q-item-section>RU</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>

              <q-btn :icon="theme_mode" dense flat>
                <q-menu
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  :offset="[70, 10]"
                  auto-close
                >
                  
                  <q-list dense class="q-pa-sm" style="box-shadow: 0 4px 24px 0 rgba(34,41,47,.1); min-width: 70px; text-align: center">
                    <q-item class="rounded-borders " :class="theme_mode == 'light_mode' ? 'bg-primary text-grey-1': ''" 
                    @click="changeTheme('light_mode')" clickable>
                      <q-item-section>
                        <div style="display:flex; align-items:center; gap:6px">
                          <q-icon size="xs" name="light_mode"></q-icon> <div> Light </div>  
                        </div>
                        </q-item-section>
                    </q-item>
                    <q-item class="rounded-borders q-mt-xs" :class="theme_mode == 'mode_night' ? 'bg-primary text-grey-1': ''" 
                    @click="changeTheme('mode_night')" clickable>
                      <q-item-section>
                        <div style="display:flex; align-items:center; gap: 6px">
                            <q-icon size="xs" name="mode_night"></q-icon> <div style="margin-top: 1px;">Dark</div> 
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>

              <q-btn dense flat>
                <q-avatar>
                  <img :src="`https://cdn.quasar.dev/img/avatar4.jpg`">
                </q-avatar>



                <q-menu
                  transition-show="jump-down"
                  transition-hide="jump-up"
                  :offset="[243, 10]"
                  auto-close
                >
                  <div class="row no-wrap q-pa-md">
                    <div class="column">
                      <div class="text-h6 q-mb-md">Settings</div>
                      <q-toggle v-model="mobileData" label="Use Mobile Data" />
                      <q-toggle v-model="bluetooth" label="Bluetooth" />
                    </div>

                    <q-separator vertical inset class="q-mx-lg" />

                    <div class="column items-center">
                      <q-avatar size="72px">
                        <img src="https://cdn.quasar.dev/img/avatar4.jpg">
                      </q-avatar>

                      <div class="text-subtitle1 q-mt-md q-mb-xs">John Doe</div>

                      <q-btn
                        color="primary"
                        label="Logout"
                        push
                        size="sm"
                        v-close-popup
                      />
                    </div>
                  </div>
                </q-menu>
              </q-btn>
            </div>

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
      <div class="footer">
        <div>
          © 2023 , made with ❤️ by Quasar app
        </div>
        <div>
          <a href="https://quasar.dev/docs">Documentation</a>
        </div>
      </div>
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
    let theme_mode = ref('light_mode')
    const { locale } = useI18n({ useScope: 'global' })
    const router = useRouter()
    const route = useRoute()

    locale.value = JSON.parse(localStorage.getItem('lang'))
    function selectedLang(item){
      locale.value = item.value
      localStorage.setItem('lang', JSON.stringify(locale.value))
    }
      function changeTheme(mode){
        theme_mode.value = mode
      }

    return {
      pages,
      router,
      route,
      selectedLang,
      changeTheme,
      locale,
      localeOptions: [
        { value: 'name_uz', label: 'UZ' },
        { value: 'name_uk', label: 'UK' },
        { value: 'name_ru', label: 'RU' },
      ],
      toggleLeftDrawer,
      theme_mode,
      mobileData: ref(true),
      bluetooth: ref(false)
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