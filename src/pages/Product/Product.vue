<script setup>
import { ref, onMounted } from "vue";
import { productStore } from "../../stores/product-store";
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

import 'vue-toast-notification/dist/theme-bootstrap.css'
import { useToast } from 'vue-toast-notification';

import AddProduct from "./addProduct.vue"

const productStorage = productStore()
const { t } = useI18n()
const toast = useToast()

const columns = ref([
   {
      name: 'name',
      required: true,
      label: 'name',
      align: 'left',
      field: 'name_uz',
      format: val => `${val}`,
       sortable: true
   },
   { name: 'cost', align: 'left', label: 'cost', field: 'cost', sortable: true },
   { name: 'created_at', align: 'left', label: 'created_date', field: 'created_date', sortable: true },
   { name: 'address', label: 'address', align: 'left', field: 'address', sortable: true },
   { name: 'actions', label: 'action', align: 'right', class: "actionClass", field: 'action', sortable: true },
  ])

productStorage.GET_PRODUCTS_ID()

const filter = ref('')
const filtering = ref('')

const editTypeProduct = ref('')
const toolbar = ref(false)
const loading = ref(false)
const confirm = ref(false)
const confirm_id = ref(null)

onMounted(async ()=>{
   loading.value = true
   await productStorage.GET_PRODUCTS()
   loading.value = false
})

function filterFun(){
   filtering.value = filter.value
}
function clearFilter(){
   filter.value = ''
   filtering.value = '' 
}
async function closeDialog(e){
   toolbar.value = false
   if(e?.getProduct){
      loading.value = true
      await productStorage.GET_PRODUCTS()
      loading.value = false
   }
}

function addProduct(){
   productStorage.GET_PRODUCTS_ID()
   toolbar.value = true
   editTypeProduct.value = {}
}

function editProduct(props){
   toolbar.value = true
   editTypeProduct.value = props
}

function confirmDelete(id){
   confirm.value = true
   confirm_id.value = id
}

async function delateProduct(){
   loading.value = true
   await productStorage.DELETE_PRODUCT(confirm_id.value).then(async res => {
      if(res?.name == "AxiosError"){
         toast.error(t('error'))
      }else{
         await productStorage.GET_PRODUCTS()
         toast.success(t('success'));
      }
   })
   loading.value = false
   confirm.value = false
   confirm_id.value = null 
}

</script>

<template>
   <div class="q-py-md" style="display: flex; justify-content:space-between;'">
      <div class="width: 300px; display: flex">
         <q-input outlined dense v-model="filter" input-class="filter-left" class="q-ml-md">
            <template v-slot:append>
            <q-icon v-if="filter === ''" name="search" />
            <q-icon v-else name="clear" class="cursor-pointer" @click="clearFilter" />
            </template>
         </q-input>
         <q-btn @click="filterFun" color="primary q-ml-md" :label="$t('search')" />
      </div>
      <q-btn @click="addProduct" color="positive q-mr-md" :label="$t('add')" />
   </div>
   <div class="q-pa-md">
    <q-table
      :title="t('products')"
      :rows="productStorage.products"
      :columns="columns"
      row-key="name"
      :filter="filtering"
      :loading="loading"
      style="font-size: 16px;"
    >
      <template v-slot:header-cell="props">
            <!-- color: #847F94 -->
        <q-th :props="props" style="font-size: 18px;">
          {{ $t(props.col.name) }}
        </q-th>
      </template>
      <template v-slot:body-cell-created_at="props">
        <q-td :props="props">
          <div style="min-width: 100px" class="text-bold q-pt-sm">
            {{dayjs(props.row.created_date).format('YYYY-MM-DD') }}
          </div>
          <p class="text-thin" color="grey">
            {{dayjs(props.row.created_date).format('HH:mm') }}
          </p>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn size="md" icon="delete" color="negative" class="q-mx-md"  @click="confirmDelete(props.row.id)" />
          <q-btn size="md" color="primary" icon="edit" @click="editProduct(props.row)" />
        </q-td>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
    </q-table>
  </div>


   <AddProduct @close="closeDialog" :editTypeProduct="editTypeProduct" :toolbar="toolbar"/>
   <!-- delete dialog -->
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">{{$t('do_really_want')}}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" @click="confirm_id = null" color="primary" v-close-popup />
          <q-btn flat :label="$t('delete')" @click="delateProduct()" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
   <!-- / delete dialog  -->
</template>

<style>
   .actionClass{
      padding-right: 50px
   }
</style>