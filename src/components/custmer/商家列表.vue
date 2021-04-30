<template>
  <div class="background">
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
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播2.jpg')" />
      </van-swipe-item>
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播3.jpg')" />
      </van-swipe-item>
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播4.jpg')" />
      </van-swipe-item>
    </van-swipe>
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
import { Toast, Dialog } from "vant";
import { getStoreList, findUser } from "../../api/index";
import router from "../../router";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      query: {
        storeName: "",
      },
      location: {},
      user: {},
      active: 0,
      loading: false,
      finished: false,
      refreshing: false,
      stores: [],
      show: true,
      images: [
        require("../../assets/images/轮播1.jpg"),
        require("../../assets/images/轮播2.jpg"),
      ],
    };
  },
  created() {
    this.location.lng = Cookies.get("lng");
    this.location.lat = Cookies.get("lat");
    this.query.lng = Cookies.get("lng");
    this.query.lat = Cookies.get("lat");
    getStoreList(this.location).then((res) => {
      if (res.code == 1) {
        this.show = false;
      } else {
        this.show = false;
      }
      this.stores = res.data;
      console.log(res);
    });
    findUser().then((res) => {
      this.user = res.data;
      if (this.user.userPayPassword == null) {
        this.$dialog
          .confirm({
            message: "您的支付密码未设置，请前往个人信息设置",
          })
          .then(() => {
            this.$router.push({
              path: "/custmer/个人信息",
            });
          });
      }
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
      this.query.lng = Cookies.get("lng");
      this.query.lat = Cookies.get("lat");
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
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  height: 3rem;
}
.van-tabbar-item {
  color: rgba(51, 143, 230, 0.89);
  background-color: rgba(255, 255, 255, 0.89);
}
.van-tabbar-item--active {
  color: #ffffff;
  background-color: rgba(51, 143, 230, 0.89);
}
.van-nav-bar {
  position: relative;
  background-image: linear-gradient(
    to bottom right,
    rgb(255, 255, 255),
    rgb(48, 130, 207)
  );
}
.van-list {
  margin-bottom: 2rem;
}
</style>
