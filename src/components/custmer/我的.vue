<template>
  <div class="background">
    <van-image
      round
      width="2.5rem"
      height="2.5rem"
      fit="cover"
      src="https://img01.yzcdn.cn/vant/cat.jpeg"
    />
    <h2>{{user.userNick}}</h2>
    <!-- <van-cell-group>
      <van-cell value="我的信息" is-link to="/custmer/个人信息" icon="manager" />
      <van-cell value="我的订单" is-link to="/custmer/我的订单" icon="balance-list" />
      <van-cell value="我的收藏" is-link to="/custmer/我的收藏" icon="star" />
    </van-cell-group>-->
    <div class="grid">
      <van-grid column-num="3" :border="true" :gutter="10">
        <van-grid-item text="我的信息" to="/custmer/个人信息">
          <template #icon>
            <van-icon name="manager" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
        <van-grid-item text="我的订单" to="/custmer/我的订单">
          <template #icon>
            <van-icon name="balance-list" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
        <van-grid-item text="我的收藏" to="/custmer/我的收藏">
          <template #icon>
            <van-icon name="star" size="1rem" color="rgba(125, 190, 250, 0.89)" />
          </template>
        </van-grid-item>
      </van-grid>
    </div>

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
import { findUser, editUser } from "../../api/index";

export default {
  data() {
    return {
      active: 1,
      user: {},
    };
  },
  created() {
    findUser().then((res) => {
      this.user = res.data;
    });
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
  background-color: rgba(0, 0, 0, 0);
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
