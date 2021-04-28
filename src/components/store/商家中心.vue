<template>
  <div class="background">
    <van-image round width="2.5rem" height="2.5rem" fit="cover" :src="store.storeImg" />
    <h2>{{store.storeName}}</h2>

    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="menu">菜单</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" @click="chart">统计</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="center">商家中心</van-tabbar-item>
    </van-tabbar>
    <div class="grid">
      <van-grid column-num="3" :border="true" :gutter="10">
        <van-grid-item text="商家信息" to="/store/商家信息">
          <template #icon>
            <van-icon name="manager" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
        <van-grid-item text="订单管理" to="/store/订单管理">
          <template #icon>
            <van-icon name="balance-list" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
        <van-grid-item text="广告管理" to="/store/广告中心">
          <template #icon>
            <van-icon name="label" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
      </van-grid>
    </div>
    <van-button type="info" block :style="{position:'fixed',bottom:'2rem'}" @click="outLogin()">退出登录</van-button>
  </div>
</template>

<script>
import router from "../../router";
import { getStoreByUser, editStore } from "../../api/index";
import { Dialog, Notify } from "vant";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      store: {},
      active: 2,
      shopId: "",
    };
  },
  created() {
    this.store.storeId = Cookies.get("storeId");
    this.initWebSocket();
    getStoreByUser().then((res) => {
      this.store = res.data;
      Notify({
        type: "primary",
        message: "您有" + this.store.storeNotify + "条新的订单，请尽快处理",
      });
    });
  },
  destroyed: function () {
    // 离开页面生命周期函数
    this.websocketclose();
  },
  mounted() {
    // 主要通知
    console.log(this.store);
    Notify({
      type: "primary",
      message: "您有" + this.store.storeNotify + "条新的订单，请尽快处理",
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
    collapse: function () {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.iconClass = "cebianlanzhankai";
      } else {
        this.iconClass = "cebianlanshouhui";
      }
    },
    initWebSocket: function () {
      // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
      // this.websock = new WebSocket("ws://121.4.60.27:3000/websocket/DPS007");
      this.websock = new WebSocket("ws://localhost:3000/websocket/DPS007");
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen: function () {
      console.log("WebSocket连接成功");
    },
    websocketonerror: function (e) {
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage: function (e) {
      console.log(e.data);
      Notify({
        type: "primary",
        message: "您有" + e.data + "条新的订单，请尽快处理",
      });
      this.message = e;
    },
    websocketclose: function (e) {
      console.log("connection closed (" + e + ")");
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
.van-tabbar-item {
  color: rgba(51, 143, 230, 0.89);
  background-color: rgba(255, 255, 255, 0.89);
}
.van-tabbar-item--active {
  color: #ffffff;
  background-color: rgba(51, 143, 230, 0.89);
}
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/商家列表.jpg");
  z-index: 99;
  background-repeat: no-repeat;
  background-size: cover;
}
.grid {
  text-align: center;
  margin: 0 auto;
  font-weight: 800;
}
</style>
