<template>
  <div class="background">
    <van-form @submit="register" class="loginForm">
      <van-nav-bar
        title="用户注册"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
        class="formTop"
      />
      <div class="login_box">
        <van-field
          v-model="query.userName"
          name="用户名"
          label="用户名"
          placeholder="用户名"
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
        <van-field v-model="value" center clearable label="支付密码" placeholder type="password">
          <template #button>
            <van-button size="small" type="primary" @click="show = true">输入支付密码</van-button>
          </template>
        </van-field>
        <van-field
          v-model="query.userNick"
          name="昵称"
          label="昵称"
          placeholder="昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
        />
        <van-field name="radio" label="性别">
          <template #input>
            <van-radio-group v-model="query.sex" direction="horizontal">
              <van-radio name="男">男</van-radio>
              <van-radio name="女">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field v-model="query.userPhone" name="电话号码" label="电话号码" placeholder="电话号码" />
        <van-field v-model="query.userMail" name="邮箱" label="邮箱" placeholder="邮箱" />
        <van-field name="radio" label="类型">
          <template #input>
            <van-radio-group v-model="query.userType" direction="horizontal">
              <van-radio name="1">顾客</van-radio>
              <van-radio name="2">商家</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">注册</van-button>
        </div>
      </div>
      <van-field v-model="location" name="定位" label="定位" placeholder="定位" />
      <van-button round block type="info" @click="getPosition()">获取定位</van-button>
    </van-form>
    <!-- 图标位置 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '65%' }"
    >
      <h2>请输入支付密码</h2>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        :focused="showKeyboard"
        info="密码为 6 位数字"
        :error-info="errorInfo"
        @focus="showKeyboard = true"
        :length="6"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard v-model="value" :show="showKeyboard" @blur="show=false" />
    </van-popup>
  </div>
</template>

<script>
import { register } from "../api/index";
import { Toast, Dialog } from "vant";
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
      },
      value: "",
      show: false,
      showKeyboard: true,
      errorInfo: "",
      location:''
    };
  },
  watch: {
    value(value) {
      if (value.length === 6) {
        this.show = false;
      } else {
        this.errorInfo = "";
      }
    },
  },
  methods: {
    register() {
      this.query.userPayPassword = this.value;
      register(this.query).then((res) => {
        console.log(res.data);
        if (res.data == 1) {
          Toast.success("注册成功");
          router.push("/login");
        } else if (res.data == 3) {
          Toast.fail("用户名已存在");
        }
      });
    },
    onClickLeft() {
      console.log("onClickLeft");
      router.push("/login");
    },
    onClickRight() {
      console.log("onClickRight");
    },

    getPosition() {
      let _tant = this;
      AMap.plugin("AMap.Geolocation", function () {
        //         _tant.$dialog.loading.open("获取定位中...");
        var geolocation = new AMap.Geolocation({
          // 是否使用高精度定位，默认：true
          enableHighAccuracy: true, // 设置定位超时时间，默认：无穷大
          timeout: 10000, //自动偏移
          convert: false, // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          buttonOffset: new AMap.Pixel(10, 20), //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          zoomToAccuracy: false,
          panToLocation: true, //  定位按钮的排放位置,  RB表示右下
          buttonPosition: "RB",
        });
        geolocation.getCurrentPosition();
        console.log(geolocation);
        AMap.event.addListener(geolocation, "complete", onComplete);
        AMap.event.addListener(geolocation, "error", onError);
        function onComplete(data) {
          console.log(data)
          if (data.formattedAddress) {
            console.log(data.formattedAddress);
            _tant.location = data.formattedAddress
            //             _tant.info.enterpriseInterviewLocation = data.formattedAddress
          } else {
            console.log("获取定位失败");
          }
          //           _tant.$dialog.loading.close();
        } // 定位出错
        function onError(data) {
          mobile.toast("获取定位失败");
          //           _tant.$dialog.loading.close();
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
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/images/注册1.jpg");
  background-repeat: no-repeat;
  padding-top: 3.45rem;
  position: absolute;
}
.formTop {
  margin-bottom: 1rem;
}
.van-cell {
  background-color: rgba(0, 0, 0, 0);
}

.login_box {
  width: 80%;
  margin: 0 auto;
}
</style>
