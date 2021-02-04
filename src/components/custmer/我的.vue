<template>
  <div>
    <van-image
      round
      width="2.5rem"
      height="2.5rem"
      fit="cover"
      src="https://img01.yzcdn.cn/vant/cat.jpeg"
    />
    <h2>爱仕达撒多</h2>
    <van-cell-group>
      <van-cell value="我的信息" is-link to="/custmer/个人信息" icon="manager" />
      <van-cell value="我的订单" is-link to="/custmer/我的订单" icon="balance-list" />
      <van-cell value="我的收藏" is-link to="/custmer/我的收藏" icon="star" />
    </van-cell-group>
    <van-tabbar v-model="active">
      <van-tabbar-item icon="home-o" @click="storeList">商家列表</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="mine">我的</van-tabbar-item>
    </van-tabbar>
    <van-button type="info" block :style="{position:'fixed',bottom:'2rem'}" @click="outLogin()">退出登录</van-button>
  </div>
</template>

<script>
import router from "../../router";
import { Dialog } from "vant";

export default {
  data() {
    return {
      active: 1,
    };
  },
  methods: {
    storeList() {
      router.push("/custmer/商家列表");
    },
    mine() {
      router.push("/custmer/我的");
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
