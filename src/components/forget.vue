<template>
  <div class="background">
    <van-form @submit="forget" class="loginForm">
      <van-nav-bar
        title="用户注册"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        class="formTop"
      />
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
          v-model="query.userPhone"
          name="手机号码"
          label="手机号码"
          placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]"
        />
        <van-field
          v-model="query.userPassWord"
          type="password"
          name="新密码"
          label="新密码"
          placeholder="新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <van-field
          type="password"
          v-model="query.newPassWord"
          name="再次输入新密码"
          label="再次输入密码"
          placeholder="再次输入新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">找回密码</van-button>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script>
import { forget } from "../api/index";
import { Toast } from "vant";
import router from "../router";
export default {
  data() {
    return {
      query: {
        userName: "",
        userPassWord: "",
        sex: "男",
        userPhone: "",
        userMail: "",
        userType: "2",
        newPassWord: "",
      },
    };
  },
  methods: {
    forget() {
      if (this.query.userPassWord == this.query.newPassWord) {
        forget(this.query).then((res) => {
          console.log(res.data);
          if (res.data == 1) {
            Toast.success("修改成功");
            router.push("/login");
          } else {
            Toast.fail("修改失败");
          }
        });
      } else {
        Toast.fail("输入密码不一致");
      }
    },
    onClickLeft() {
      console.log("onClickLeft");
      router.push("/login");
    },
    onClickRight() {
      console.log("onClickRight");
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
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/images/忘记密码.jpg");
  background-repeat: no-repeat;
  padding-top: 3.45rem;
  position: absolute;
}
.formTop {
  margin-bottom: 1rem;

  background-color: rgba(110, 105, 105, 0);
}
.van-cell {
  background-color: rgba(110, 105, 105, 0);
}

.login_box {
  width: 80%;
  margin: 0 auto;
}
</style>
