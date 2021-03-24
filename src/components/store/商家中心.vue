<template>
  <div>
    <van-image
      round
      width="2.5rem"
      height="2.5rem"
      fit="cover"
      :src="store.storeImg"
    />
    <h2>{{store.storeName}}</h2>
    <van-cell-group>
      <van-cell value="商家信息" is-link to="/store/商家信息" icon="manager" />
      <van-cell value="订单管理" is-link to="/store/订单管理" icon="balance-list" />
    </van-cell-group>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="menu">菜单</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" @click="chart">统计</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="center">商家中心</van-tabbar-item>
    </van-tabbar>
    <van-button type="info" block :style="{position:'fixed',bottom:'2rem'}" @click="outLogin()">退出登录</van-button>
  </div>
</template>

<script>
import router from "../../router";
import { getStoreByUser,editStore} from "../../api/index";
import { Dialog } from "vant";

export default {
  data() {
    return {
      store:{},
      active: 2,
    };
  },
 created() {
    getStoreByUser().then((res) => {
      this.store = res.data;
    });
  },
  methods: {
    menu() {
      router.push("/store/菜单");
    },
    chart() {
      router.push("/store/统计");
    },
    center() {
      router.push("/store/商家中心");
    },
    outLogin() {
      Dialog.confirm({
        title: "注销",
        message: "是否退出登录",
      })
        .then(() => {
          router.push("/");
        })
        .catch(() => {
          // on cancel
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
.formTop {
  margin-bottom: 1rem;
}
</style>
