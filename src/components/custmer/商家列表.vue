<template>
  <div>
    <van-nav-bar
      title="商家列表"
      class="formTop"
    />
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="item in stores" :key="item.storeId">
          <van-card
            :desc=item.storeName
            :title=item.storeName
            thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
            @click="toMenu(item.storeId)"
          />
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="storeList">商家列表</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="mine">我的</van-tabbar-item>
    </van-tabbar>
    
  </div>
</template>

<script>
import {getStoreList}from '../../api/index'
import router from '../../router';
export default {
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      refreshing:false,
      stores:[]
    };
  },
  created(){
    getStoreList().then(res=>{
      this.stores = res.data
        console.log(res)
      })
  },
  methods:{
    storeList(){
      router.push('/custmer/商家列表')
    },
    mine(){
      router.push('/custmer/我的')
    },
    //下拉刷新
    onLoad() {
      getStoreList().then(res => {
          console.log(res)
          this.stores=res.data
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    toMenu(storeId) {  
      this.$router.push({
      path: '/custmer/菜单',
      query: {
        storeId: storeId
      }
	});
}
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
