<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { productStore } from "../../stores/product-store";
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

import draggable from 'vuedraggable'

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

const thumbStyle = ref({
                        right: '5px',
                        borderRadius: '7px',
                        backgroundColor: 'rgb(197,201,209)',
                        width: '5px',
                        opacity: 0.75
                    })
const barStyle = ref({
                        right: '5px',
                        borderRadius: '9px',
                        backgroundColor: 'rgb(228,230,234)',
                        width: '5px',
                        opacity: 0.2
                    })

const cardDragging = ref(true)

const list1 = ref([])
const list2 = ref([])
const list3 = ref([])


const listFiltered1 = ref([])
const listFiltered2 = ref([])
const listFiltered3 = ref([])

onMounted(async ()=>{
    loading.value = true
    await productStorage.GET_PRODUCTS()
    productStorage.products.forEach(item=>{
        if(item.product_type_id == 1){
            list1.value.push(item)
        }else if(item.product_type_id == 2){
            list2.value.push(item)
        }else if(item.product_type_id == 3){
            list3.value.push(item)
        }
    })
    loading.value = false
})

productStorage.GET_PRODUCTS_ID()

const filter = ref('')
const filtering = ref(null)

const indexCol = ref(null)


const editTypeProduct = ref('')
const toolbar = ref(false)
const loading = ref(false)
const confirm = ref(false)
let confirm_item = reactive({})



function filterFun(){
   filtering.value = filter.value

   listFiltered1.value = list1.value.filter(item=>item.name_uz.includes(filter.value))
   listFiltered2.value = list2.value.filter(item=>item.name_uz.includes(filter.value))
   listFiltered3.value = list3.value.filter(item=>item.name_uz.includes(filter.value))

}
function clearFilter(){
   filter.value = ''
   filtering.value = null
}
async function closeDialog(e){
   toolbar.value = false
   if(e?.getProduct){
      loading.value = true
      await productStorage.GET_PRODUCTS()
    
        list1.value = []
        list2.value = []
        list3.value = []
        productStorage.products.forEach(item=>{
            if(item.product_type_id == 1){
                list1.value.push(item)
            }else if(item.product_type_id == 2){
                list2.value.push(item)
            
            }else if(item.product_type_id == 3){
                list3.value.push(item)
                
            }
        })

      loading.value = false
   }
}

function addProduct(){
   productStorage.GET_PRODUCTS_ID()
   toolbar.value = true
   editTypeProduct.value = {}
   clearFilter()
}

function editProduct(props){
   toolbar.value = true
   editTypeProduct.value = props
   clearFilter()
}

function start(){
    // cardDragging.value = true
}
function add(index){
    indexCol.value = index
    // cardDragging.value = false
}
async function log(e){
    if(e.removed){
        e.removed.element.product_type_id = indexCol.value
        await productStorage.UPDATE_PRODUCT(e.removed.element).then((res)=>{
            if(res?.name == "AxiosError"){
                toast.error(t('error'))
            }else{
                toast.success(t('success'))
            }
        })
    }
}


// function onScrollFirst(event){
//     console.log(event);
// }
function confirmDelete(elem){
   confirm.value = true
   confirm_item = elem
}

async function delateProduct(){
   loading.value = true
   await productStorage.DELETE_PRODUCT(confirm_item.id).then(async res => {
      if(res?.name == "AxiosError"){
         toast.error(t('error'))
      }else{
        //  await productStorage.GET_PRODUCTS()

        if(confirm_item.product_type_id == 1){
            list1.value.shift(confirm_item)
        }else if(confirm_item.product_type_id == 2){
            list2.value.shift(confirm_item)
           
        }else if(confirm_item.product_type_id == 3){
            list3.value.shift(confirm_item)
            
        }

        toast.success(t('success'));
      }
   })
   loading.value = false
   confirm.value = false
   confirm_item = null 
}

</script>

<template>
<div class="kanban-background">

<!-- {{ productStorage.products}} -->
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

    <div style="width: 100%; gap:10px; display: flex; justify-content:space-between">
            <div class="column-kanban">
                <p class="list-group-header">{{$t('grass')}} </p>
                <q-scroll-area
                    visible
                    :thumb-style="thumbStyle"
                    :bar-style="barStyle"
                    class="list-group"
                    ref="firstRef"
                    @scroll="onScrollFirst"
                >
                    <draggable
                        :list="!filtering ? list1 : listFiltered1"
                        style="height: calc(100vh - 100px); display: flex; flex-direction: column; gap: 10px;"
                        @change="log"
                        @add="add(1)"
                        @start="start()"
                        itemKey="name"
                        group="people"
                        class="dragbble"

                    >
                        <!-- :style="cardDragging ? 'height: 100vh' : ''" -->
                        <template #item="{ element }">
                            <div class="list-group-item">
                                <q-card class="my-card" flat>
                                    <div class="header-action" style="position:relative">
                                        <div class="actions" style="position:absolute; z-index:1; right: 0; margin:0">
                                            <q-btn dense flat size="md" icon="edit" @click="editProduct(element)" />
                                            <q-btn dense flat size="md" icon="delete_outline" style="margin:0" class="q-mx-md"  @click="confirmDelete(element)" />
                                        </div>
                                        <q-img src="https://trello.com/1/cards/655b8d3b8707e92fbca377c8/attachments/655b8d3b8707e92fbca37963/previews/655b8d3b8707e92fbca37968/download/Design.png"></q-img>
                                        </div>
                                    <q-card-section>
                                        <q-btn
                                        fab
                                        color="primary"
                                        icon="place"
                                        class="absolute"
                                        style="top: 0; right: 30px; transform: translateY(-50%);"
                                        />

                                        <div class="row no-wrap items-center">
                                            <div class="col wrap text-h6 card-title">
                                                {{element.name_uz}}deeeeeee eeeeeeeee
                                            </div>
                                            <div style="width: 33%; display:inline-flex; justify-content:center;" class="col-auto wrap text-grey text-caption q-pt-md">
                                                <q-icon size="xs" name="place" />
                                                {{element.address}}
                                            </div>
                                        </div>

                                    </q-card-section>

                                    <div style="display:flex; padding:16px; justify-content: space-between" class="q-pt-none">
                                        <div class="text-subtitle1">
                                        ${{element.cost}}
                                        </div>
                                        <div class="text-caption row text-grey">
                                            <q-icon size="xs" name="date_range" />
                                            <div>
                                                <p style="margin: 0">
                                                    {{dayjs(element.created_date).format('YYYY-MM-DD') }}
                                                </p>
                                                <p style="margin: 0">
                                                    {{dayjs(element.created_date).format('HH-mm') }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </q-card>
                            </div>
                        </template>
                    </draggable>
                </q-scroll-area>
            </div>    

            <div class="column-kanban">
            <p class="list-group-header">{{$t('animal')}}</p>
                <q-scroll-area
                    visible
                    :thumb-style="thumbStyle"
                    :bar-style="barStyle"
                    class="list-group"
                    ref="firstRef"
                    @scroll="onScrollFirst"
                >
                    <draggable
                        :list="!filtering ? list2 : listFiltered2"
                        style="height: calc(100vh - 100px); display: flex; flex-direction: column; gap: 10px;"
                        @change="log"
                        @add="add(2)"
                        @start="start()"
                        itemKey="name"
                        group="people"

                    >
                        <!-- :style="cardDragging ? 'height: 100vh' : ''" -->
                        <template #item="{ element }">
                        <div class="list-group-item">
                            <q-card class="my-card" flat>
                            <div class="header-action" style="position:relative">
                                    <div class="actions" style="position:absolute; z-index:1; right: 0; margin:0">
                                        <q-btn dense flat size="md" icon="edit" @click="editProduct(element)" />
                                        <q-btn dense flat size="md" icon="delete_outline" style="margin:0" class="q-mx-md"  @click="confirmDelete(element)" />
                                    </div>
                                    <q-img src="https://images.unsplash.com/photo-1628071554664-0b8942cbd11c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyZWxsb3xlbnwwfHwwfHx8MA%3D%3D"></q-img>
                                </div>
                                <q-card-section>
                                    <q-btn
                                        fab
                                        color="primary"
                                        icon="place"
                                        class="absolute"
                                        style="top: 0; right: 30px; transform: translateY(-50%);"
                                    />

                                    <div class="row no-wrap items-center">
                                        <div class="col text-h6 card-title">
                                            {{element.name_uz}}
                                        </div>
                                        <div style="width: 33%; display:inline-flex; justify-content:center;" class="col-auto wrap text-grey text-caption q-pt-md">
                                            <q-icon size="xs" name="place" />
                                            {{element.address}}
                                        </div>
                                    </div>

                                </q-card-section>

                                <div style="display:flex; padding:16px; justify-content: space-between" class="q-pt-none">
                                    <div class="text-subtitle1">
                                    ${{element.cost}}
                                    </div>
                                    <div class="text-caption row text-grey">
                                        <q-icon flat size="xs" name="date_range" />
                                        <div>
                                            <p style="margin: 0">
                                                {{dayjs(element.created_date).format('YYYY-MM-DD') }}
                                            </p>
                                            <p style="margin: 0">
                                                {{dayjs(element.created_date).format('HH-mm') }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                </q-card>
                        </div>
                        </template>
                    </draggable>
                </q-scroll-area>
            </div>

            <div class="column-kanban">
                <p class="list-group-header">{{$t('tree')}}</p>
                <q-scroll-area
                    visible
                    :thumb-style="thumbStyle"
                    :bar-style="barStyle"
                    class="list-group"
                    ref="firstRef"
                    @scroll="onScrollFirst"
                >
                    <draggable
                        :list="!filtering ? list3 : listFiltered3"
                        style="height: calc(100vh - 100px); display: flex; flex-direction: column; gap: 10px;"
                        @change="log"
                        @add="add(3)"
                        @start="start()"
                        itemKey="name"
                        group="people"
                    >
                        <template #item="{ element }">
                        <div class="list-group-item">
                        <!-- :style="cardDragging ? 'height: 100vh' : ''" -->
                            <q-card class="my-card" flat>
                            <div class="header-action" style="position:relative">
                                    <div class="actions" style="position:absolute; z-index:1; right: 0; margin:0">
                                        <q-btn dense flat size="md" icon="edit" @click="editProduct(element)" />
                                        <q-btn dense flat size="md" icon="delete_outline" style="margin:0" class="q-mx-md"  @click="confirmDelete(element)" />
                                    </div>
                                    <q-img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAS4AAACnCAMAAACYVkHVAAAAJ1BMVEX09PTa2trc3Nz29vbj4+Pg4ODv7+/Y2Njy8vLt7e3q6urm5ubn5+eHk7pVAAAEMklEQVR4nO2ci46jMAxFSZw3/P/3ru0QFtoppSPtUsn3rDSLmFaCIycxjplpAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPxzSLj7Ir4b8UPdU6lL8MvdF/TtiKjSQnQ5O+cClbsv6OvQEddDKrEo7xTPuAhdeySUivgqqc5xmBq6+MfdF/hVSFxRSYuEVGY93j/ocunuS/wCxujjsTeLKOe3aFJlfMKHJfDJXK2vjUVNldpCl7SLJvXlY2hJBmiSs4vlXGJM596tpvxel+OQSrt0S05Gk7aKGuhjT91sAbUeSUhNx7SUIv8i3nXFt8KiJKTyELVN5jz2ZhY1PSfwNMnk5S0mEhT6JL4be1kjqhZN4Pkj5dELURO5xeBopPnvbJXV1CKz+ekzIesSu8mirjrCSseemprerXmUOCDdbFAXJwWsK3ZR178VOXXdL4125jGJrjBUlbKWHd4QZSXYn7j3Hv4fPSn48HYpcHTtl8ZkJbxUlx/B5a+yJWcrVuZ9muXOR1LgfosZXVXutkLXNahwQp9HKfmQ20PXT4igsB6LrvgZIZrSJXO9H7VR0RXW1OBSRkHr5GdHVxBdayIgh+GTO2dhwZSuadHb7cerrpKuMpnTlTLPXm3U/USXrJZZGf+/pE7WdBWpR8xHXb6vkMctjWe8QV381Ohz/FlXCKfpg0ldUl5Yl8ajrkWWvvkkvizq4kyAh1xfGg+65t4XMUPXHi0l57407nR5N61Pkg+Zvl//GdXFSyPfb9PDva5RpiB/mO99f1Cyq0sfrHty+l4X/6ZuFWuTuki2GPu24WEw1j531d1glNJW5QefmvvOtkldum2oh4ep3nddx+abntDyfGdVF1GT7F3n9aMu30ppx4nLz9p2UihY1aVL41ohfEhTnxKHv8/fFMzqKnLDywVduz0Q0iK/RV0TbSbe6OLPbNGl+yA2dUlPiS6Np7rysYuEik1dWrLqj0Gnuh57biiZHIxEC1vSx6DXurzLz92oNVdz5cHRVyIJ1Ul0/dSMSnMzqEtmbacVwidd+cyWtv4a1CUVQu2oOejiTCGUIM3O2buXjc4GdfFTo1QIy0N0xUaFmqajy0sdFnVJhdCnH8qD8irLItu2L1tsLOpqWvKS9F51ScEwbsOP0nzSj2RRl75YMG+6qne7zdly2rRrUBcvjU4rhCO6fDv00Z991aIubbmMI7okni7fvkVda1/J0PXcS3/yVXu6aJr1DdjwcUuJSV3T1NzY3IGuCyS3vbf4WcOSSV2l9N0x+Rnef3yHxUdsJm4t4D58grVmyw6F0Goqr2r0J/QvGNM19TenPnW1YU1Xz7Sg6yL9di+/5PII/kwCeMsv/1JLmSy+aQwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjiD11yHkXgwpzGAAAAAElFTkSuQmCC" />
                                </div>
                                <q-card-section>
                                    <q-btn
                                    fab
                                    color="primary"
                                    icon="place"
                                    class="absolute"
                                    style="top: 0; right: 30px; transform: translateY(-50%);"
                                    />

                                    <div class="row no-wrap items-center">
                                        <div class="col text-h6 card-title">
                                            {{element.name_uz}}
                                        </div>
                                        <div style="width: 33%; display:inline-flex; justify-content:center;" class="col-auto wrap text-grey text-caption q-pt-md">
                                            <q-icon size="xs" name="place" />
                                            {{element.address}}
                                        </div>
                                    </div>

                                </q-card-section>

                                <div style="display:flex; padding:16px; justify-content: space-between" class="q-pt-none">
                                    <div class="text-subtitle1">
                                    ${{element.cost}}
                                    </div>
                                    <div class="text-caption row text-grey">
                                        <q-icon size="xs" name="date_range" />
                                        <div>
                                            <p style="margin: 0">
                                                {{dayjs(element.created_date).format('YYYY-MM-DD') }}
                                            </p>
                                            <p style="margin: 0">
                                                {{dayjs(element.created_date).format('HH-mm') }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                </q-card>
                        </div>
                        </template>
                    </draggable>
                </q-scroll-area>
            </div>
    </div>
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
          <q-btn flat :label="$t('cancel')" @click="confirm_item = null" color="primary" v-close-popup />
          <q-btn flat :label="$t('delete')" @click="delateProduct()" color="negative" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>

   <!-- / delete dialog  -->
</template>

<style lang='scss'>
   .actionClass{
      padding-right: 50px
   }
    .my-card{
        cursor: cell;
        .header-action{
            .actions{
                display: none;
            }
        }

    }
    .my-card:hover{
        .header-action{
            .actions{
                display: block;
                button{
                    margin: 0 5px;
                    padding: 5px;
                    border-radius: 50%;
                    background: #fff;
                }
            }
        }
    }
    .list-group-item:hover{
        border: 3px solid rgb(187, 183, 183);
    }
</style>