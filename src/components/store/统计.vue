<template>
  <div>
   
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="menu">菜单</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" @click="chart">统计</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="center">商家中心</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import {getStoreByUser,getMenuList,addMenu,getMenuById,editMenu,delMenuById,editDiscount}from '../../api/index'
import router from '../../router';
import { Toast } from 'vant';
import { Dialog } from 'vant';
export default {
  
  data() {
    return {
      active: 1,
    };
  },
  created(){
    
    
  },
  mounted(){
    
    
  },
  methods:{
    menu(){
      router.push('/store/菜单')
    },
    center(){
      router.push('/store/商家中心')
    },    
    chart(){
      router.push('/store/统计')
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.loginForm{
  margin-top:1rem;
}
.formTop{
  margin-bottom: 1rem;
}

</style>
