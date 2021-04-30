<template>
  <div class="background">
    <van-nav-bar
      title="我的信息"
      left-text="返回"
      @click-left="onClickLeft"
      class="formTop"
    />
    <van-form @submit="onSubmit">
      <van-field :disabled="isReadonly" v-model="user.userName" label="用户名" />
      <van-field :disabled="isReadonly" type="password" v-model="user.userPassWord" label="密码" />
      <van-field :disabled="isReadonly" v-model="user.userNick" label="昵称" />
      <van-field :disabled="isReadonly" v-model="user.userSex" label="性别" />
      <van-field :disabled="isReadonly" v-model="user.userPhone" label="联系方式" />
      <van-field :disabled="isReadonly" v-model="user.userMail" label="邮箱" />
      <van-field
        :readonly="isReadonly"
        v-model="user.userStoreName"
        label="拥有的商家"
        v-if="user.userStore!=null"
      />
      <div style="margin: 16px;">
        <van-button round block type="primary" @click="show=true" native-type="button">修改支付密码</van-button>
      </div>
      <div style="margin: 16px;">
        <van-button v-if="isSubmitShow" round block type="info" native-type="submit">保存</van-button>
      </div>
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
        :info="info"
        :error-info="errorInfo"
        @focus="showKeyboard = true"
        :length="6"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard v-model="value" :show="showKeyboard" @blur="show=false" />
    </van-popup>

    <!-- 图标位置 -->
    <van-popup
      v-model="show2"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '65%' }"
    >
      <h2>请输入支付密码</h2>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value2"
        :focused="showKeyboard"
        :info="info"
        :error-info="errorInfo"
        @focus="showKeyboard = true"
        :length="6"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard v-model="value2" :show="showKeyboard" @blur="show2=false" />
    </van-popup>
  </div>
</template>

<script>
import router from "../../router";
import { findUser, editUser } from "../../api/index";
import { Toast } from 'vant';
export default {
  data() {
    return {
      user: {},
      isReadonly: false,
      isSubmitShow: true,
      show: false,
      show2: false,
      value: "",
      value2: "",
      showKeyboard: true,
      errorInfo: "",
      info: "输入新密码",
    };
  },
  created() {
    findUser().then((res) => {
      this.user = res.data;
    });
  },
  computed: {
    dateRange() {
      const { value, value2 } = this;
      return { value, value2 };
    },
  },
  watch: {
    dateRange: {
      handler(newVal) {
        if (newVal.value.length === 6 ) {
          this.show = false;
          this.show2 = true;
          if (newVal.value2.length === 6) {
            if (newVal.value2 == newVal.value) {
              this.user.userPayPassword = newVal.value;
              console.log("111")
              editUser(this.user).then((res) => {
                this.isReadonly = false;
                this.isSubmitShow = true;
                this.show2=false
                Toast.success("修改成功")
              });
            } else {
              this.errorInfo = "两次密码不一致";
            }
          } else {
            this.info = "请再次输入密码";
          }
        }
      },
      deep:true
    },
    
    
  },
  methods: {
    onClickLeft() {
      router.push("/custmer/我的");
    },
    onSubmit() {
      editUser(this.user).then((res) => {
        this.isReadonly = false;
        this.isSubmitShow = true;
        Toast.success("保存成功")
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
.van-cell {
  background-color: rgba(0, 0, 0, 0);
}
.loginForm {
  margin-top: 1rem;
}
.formTop {
  margin-bottom: 1rem;
}
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/收藏.jpg");
  z-index: 99;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
