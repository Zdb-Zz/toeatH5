<template>
  <div>
    
    <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o" @click="storeList">商家列表</van-tabbar-item>
    <van-tabbar-item icon="friends-o" @click="mine">我的</van-tabbar-item>
</van-tabbar>

  </div>
</template>

<script>
import router from '../../router';
export default {
  data() {
    return {
      active: 1,
    };
  },
  methods:{
    storeList(){
      router.push('/custmer/商家列表')
    },
    mine(){
      router.push('/custmer/我的')
    },
  }
};
</script>
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
