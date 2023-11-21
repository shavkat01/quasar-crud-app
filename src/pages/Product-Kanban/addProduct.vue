<script setup>
    import { reactive, watch, ref, computed, defineEmits, defineProps } from "vue";
    import { productStore } from "../../stores/product-store";
    import { useVuelidate } from '@vuelidate/core'
    import { required, helpers, email } from '@vuelidate/validators'
    import { useI18n } from 'vue-i18n';
    import 'vue-toast-notification/dist/theme-bootstrap.css'
    import { useToast } from 'vue-toast-notification';

    import dayjs from 'dayjs';

    const productStorage = productStore()

    const props = defineProps(['toolbar', 'editTypeProduct']);
    const emit = defineEmits(['close'])

    const { t, locale } = useI18n()
    const toast = useToast()


    const dense = ref(true)
    const loading = ref(false)

    const product = reactive({
        name_uz: '',
        address: '',
        created_date: '',
        cost: null,
        product_type_id: null,
    })

    const rules = computed(() => {
        return {
          name_uz: {
            required: helpers.withMessage(t('please_fill_in_the_field'), required)
          },
          address: { 
            required: helpers.withMessage(t('please_fill_in_the_field'), required)
          },
          created_date: { 
            required: helpers.withMessage(t('please_fill_in_the_field'), required)
          },
          cost: {
            required: helpers.withMessage(t('please_fill_in_the_field'), required)
          },
          product_type_id: {
            required: helpers.withMessage(t('please_fill_in_the_field'), required)
          }
        }
    })
    const validate = useVuelidate(rules, product)

    watch(()=> props.toolbar, ()=>{
      if(!!props.editTypeProduct.id && props.toolbar){
        product.name_uz = props.editTypeProduct?.name_uz
        product.cost = props.editTypeProduct?.cost
        product.address = props.editTypeProduct?.address

        product.created_date = dayjs(props.editTypeProduct?.created_date).format('YYYY-MM-DDTHH:mm:ss')
        productStorage.products_id.forEach(item=>{
          if(item.id == props.editTypeProduct?.product_type_id){
            product.product_type_id = item
          }
        })
      }
    })

    function close(e){
        product.name_uz = ''
        product.cost = null
        product.address = ''
        product.created_date = ''
        product.product_type_id = null
        validate.value.$reset()

        emit('close', e)
    }
    async function saveProduct(){
      
      const result = await validate.value.$validate()
      if(result){
        product.product_type_id = product.product_type_id.id
        loading.value = true
        if(!props.editTypeProduct?.id){
          await productStorage.CREATE_PRODUCT(product).then((res)=>{
            if(res?.name == "AxiosError"){
              toast.error(t('error'))
            }else{
              toast.success(t('success'))
              close({getProduct: true})
            }
          })
        }else{      
          await productStorage.UPDATE_PRODUCT({id: props.editTypeProduct?.id, ...product}).then((res)=>{
           if(res?.name == "AxiosError"){
             toast.error(t('error'))
            }else{
              toast.success(t('success'))
              close({getProduct: true})
            }
          })
        }

        loading.value = false
      }
    }
</script>
<template>
    <q-dialog  v-model="props.toolbar" persistent transition-show="scale" transition-hide="scale">
      <q-card style="max-width: 1000px; min-width: 800px">
        <q-toolbar>
          <q-toolbar-title>{{!props.editTypeProduct?.id ? t('add') : t('edit')}}</q-toolbar-title>

          <q-btn flat round dense icon="close" @click="close" />
        </q-toolbar>
      <VForm
        ref="refVForm"
        @submit.prevent="save"
      >
        <q-card-section>
            <div class="row" style="gap: 10px">
                <div class="col"> 
                    <label for="">{{$t('name')}}</label>
                    <q-input outlined square v-model="product.name_uz" :dense="dense" />
                     <p style="color: red;" v-for="error in validate.name_uz.$errors" :key="error.$uid">{{ $t(error.$message) }}</p>
                </div>
                <div class="col">
                  <label for="">{{$t('address')}}</label>
                  <q-input outlined square v-model="product.address" :dense="dense" />
                     <p style="color: red;" v-for="error in validate.address.$errors" :key="error.$uid">{{ $t(error.$message) }}</p>
                </div>
            </div>
            <div class="row q-pt-md" style="gap: 10px">
                <div class="col"> 
                  <label for="">{{$t('cost')}}</label>
                  <q-input outlined square v-model="product.cost" fill-mask="#" :dense="dense" />
                    <p style="color: red;" v-for="error in validate.cost.$errors" :key="error.$uid">{{ $t(error.$message) }}</p>
                </div>
                <div class="col">
                  <label for="">{{$t('created_at')}}</label>
                  <q-input outlined square v-model="product.created_date" :dense="dense" type="datetime-local"  />
                  <p style="color: red;" v-for="error in validate.created_date.$errors" :key="error.$uid">{{ $t(error.$message) }}</p>
                
                </div>
            </div>
            <div class="row q-pt-md" style="gap: 10px">
                <div class="col-6"> 
                  <label for="">{{$t('type_product')}}</label>
                    <q-select v-model="product.product_type_id" 
                    :options="productStorage.products_id" 
                    :option-label="e => e.name_uz"
                    :option-value="e => e.id"
                    :dense="dense"
                    outlined
                    />
                     <p style="color: red;" v-for="error in validate.product_type_id.$errors" :key="error.$uid">{{ $t(error.$message) }}</p>

                        <!-- <v-select v-model="product.product_type_id" style="height" 
                        :get-option-label="el => el[$i18n.locale]"  :reduce="(p) => p.id" 
                        :options="GET_TYPE"/> -->
                </div>
            </div>
        </q-card-section>
      </VForm>
        <q-card-actions  class="q-mt-lg" align="right">
            <q-btn style="font-size: 13px; font-weight: 600; padding: 10px; border-radius: 11% " color="negative" :label="`${$t('cancel')}`" @click="close"/>
            <q-btn style="font-size: 13px; font-weight: 600; padding: 10px; border-radius: 11% " :loading="loading" class="q-px-lg" color="positive" :label="`${$t('save')}`" @click="saveProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>