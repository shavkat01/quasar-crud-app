import { defineStore } from 'pinia';
import axios from 'axios';

export const productStore = defineStore('product', {
  state: () => ({
    lang: '',
    products: [],
    products_id: [],
  }),
  getters: {
  },
  actions: {
    async GET_PRODUCTS_ID() {
      return await axios({
          url: 'http://94.158.54.194:9092/api/product/get-product-types',
          method: "get", 
        })
        .then((e) => {
          this.products_id = e.data;
          // return e.data;
        })
        .catch((error) => {
          return error;
        })
    },
    async GET_PRODUCTS() {
      return await axios({
          url: 'http://94.158.54.194:9092/api/product',
          method: "get", 
        })
        .then((e) => {
          this.products = e.data;
          // return e.data;
        })
        .catch((error) => {
          return error;
        })
    },
    async UPDATE_PRODUCT(data) {
    return await axios({
        url: `http://94.158.54.194:9092/api/product`,
        method: "put", 
        data
      })
      .then((e) => {
        return e.data;
      })
      .catch((error) => {
        return error;
      })
    },
    async CREATE_PRODUCT(data) {
      return await axios({
          url: 'http://94.158.54.194:9092/api/product',
          method: "post", 
          data
        })
        .then((e) => {
          return e.data;
        })
        .catch((error) => {
          return error;
        })
    },
    async DELETE_PRODUCT(id) {
      return await axios({
          url: `http://94.158.54.194:9092/api/product/${id}`,
          method: "delete", 
        })
        .then((e) => {
          return e.data;
        })
        .catch((error) => {
          return error;
        })
    },
  },
});
