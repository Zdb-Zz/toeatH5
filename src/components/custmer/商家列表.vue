<template>
  <div>
    <van-nav-bar title="商家列表" class="formTop" />
    <van-search
      v-model="query.storeName"
      show-action
      label="商铺名"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-overlay :show="show">
      <van-loading
        color="#1989fa"
        size="2rem"
        :style="{position:'fixed',float:'left',zIndex:'1000',top:'50%',left:'50%',transform:' translate(-50%,-50%)'}"
      />
    </van-overlay>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell v-for="item in stores" :key="item.storeId">
          <van-card :title="item.storeName" :thumb="item.storeImg" @click="toMenu(item.storeId)">
            <template #desc>
              <span v-show="item.storeAddress!=null" :style="{color:'red'}">
                {{'地址：'+item.storeAddress}}
                <br />
              </span>
              <span>
                {{'简介：'+item.storeRemark}}
                <br />
              </span>
            </template>
            <template #footer>
              <van-rate v-model="item.storeStar" :count="5" />
            </template>
          </van-card>
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
import { Toast } from "vant";
import { getStoreList } from "../../api/index";
import router from "../../router";
export default {
  data() {
    return {
      query: {
        storeName: "",
      },
      active: 0,
      loading: false,
      finished: false,
      refreshing: false,
      stores: [],
      show: true,
    };
  },
  created() {
    getStoreList().then((res) => {
      if (res.code == 1) {
        this.show = false;
      } else {
        this.show = false;
      }
      this.stores = res.data;
      console.log(res);
    });
  },
  methods: {
    storeList() {
      router.push("/custmer/商家列表");
    },
    mine() {
      router.push("/custmer/我的");
    },
    //下拉刷新
    onLoad() {
      getStoreList(this.query).then((res) => {
        console.log(res);
        this.stores = res.data;
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
        path: "/custmer/菜单",
        query: {
          storeId: storeId,
        },
      });
    },
    onSearch() {
      getStoreList(this.query).then((res) => {
        if (res.data == null) {
          Toast.fail("没有找到商铺");
        } else {
          this.stores = res.data;
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
        }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
.loginForm {
  margin-top: 1rem;
}
.van-card__title {
  font-size: 0.43rem;
  font-weight: 1000;
  line-height: 0.43rem;
}
</style>
