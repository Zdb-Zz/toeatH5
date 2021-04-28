<template>
  <div class="background">
    <div>
      <van-form @submit="login" class="loginForm">
        <div class="login_box">
          <van-field
            class="field"
            v-model="query.userName"
            name="用户名"
            label="用户名"
            placeholder="用户名"
            :border="true"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="query.userPassWord"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
          <div style="margin: 16px;">
            <van-button round block type="info" native-type="submit">登录</van-button>
          </div>
        </div>
      </van-form>
    </div>
    <van-nav-bar right-text="没有账号？注册新用户" @click-right="onClickRight" />
    <van-nav-bar right-text="忘记密码？" @click-right="forgetPassword" />
  </div>
</template>

<script>
import { login } from "../api/index";
import { Toast } from "vant";
import router from "../router";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      query: {
        userName: "",
        userPassWord: "",
      },
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
    login() {
      login(this.query).then((res) => {
        console.log(res.data);
        if (res.data != null) {
          Toast.setDefaultOptions({ duration: 500 });
          Toast.success("登录成功");
          //管理员登录
          if (res.data.userType == 0) {
            router.push("/admin/home");
          } else if (res.data.userType == 1) {
            //顾客登录
            Cookies.set("userId", res.data.userId);
            Cookies.set("storeId", res.data.userStore);
            router.push("/custmer/商家列表");
          } else if (res.data.userType == 2) {
            //商家登录
            Cookies.set("userId", res.data.userId);
            Cookies.set("storeId", res.data.userStore);
            router.push("/store/菜单");
          }
        } else {
          Toast.fail(res.message);
        }
      });
    },
    onClickLeft() {
      console.log("onClickLeft");
    },
    onClickRight() {
      console.log("onClickRight");
      router.push("/register");
    },
    forgetPassword() {
      console.log("forgetPassword");
      router.push("/forget");
    },
    getAuthCode() {
      my.getAuthCode({
        scopes: "auth_user", // 主动授权：auth_user，静默授权：auth_base
        success: (res) => {
          console.log(res);
          if (res.authCode) {
            // 认证成功
            // 调用自己的服务端接口，让服务端进行后端的授权认证，并且种session，需要解决跨域问题
            my.httpRequest({
              url: "http://isv.com/auth", // 该url是自己的服务地址，实现的功能是服务端拿到authcode去开放平台进行token验证
              data: {
                authcode: res.authcode,
              },
              success: () => {
                // 授权成功并且服务器端登录成功
              },
              fail: () => {
                // 根据自己的业务场景来进行错误处理
              },
            });
          }
        },
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
body {
  background-color: aqua;
}
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

.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/images/登录1.png");
  background-repeat: no-repeat;
  padding-top: 4rem;
  position: absolute;
}
.formTop {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.van-cell {
  background-color: rgba(0, 0, 0, 0);
}

.login_box {
  width: 80%;
  margin: 0 auto;
}
.field {
  border: lightcoral;
}
.van-nav-bar__text {
  color: #1989fa;
  margin-right: 1.54rem;
}
</style>
