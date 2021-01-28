<template>
  <div>
    <van-nav-bar
      title="我的信息"
      left-text="返回"
      @click-left="onClickLeft"
      class="formTop"
      right-text="编辑"
      @click-right="isReadonly=false,isSubmitShow=true"
    />
    <van-form @submit="onSubmit">
      <van-field :disabled="isReadonly"  v-model="user.userName" label="用户名" />
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
        <van-button v-if="isSubmitShow" round block type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import router from "../../router";
import { findUser, editUser} from "../../api/index";
export default {
  data() {
    return {
      user: {},
      isReadonly: true,
      isSubmitShow:false
    };
  },
  created() {
    findUser().then((res) => {
      this.user = res.data;
    });
  },
  methods: {
    onClickLeft() {
      router.push("/custmer/我的");
    },
    onSubmit(){
      editUser(this.user).then((res)=>{
        this.isReadonly = true
        this.isSubmitShow=false        
      })
    }
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
