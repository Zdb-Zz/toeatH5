<template>
  <van-form @submit="register" class="loginForm">
    <van-nav-bar
      title="用户注册"
      left-text = "用户登录"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="formTop"
    />
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
     <van-field
      v-model="query.userPhone"
      name="电话号码"
      label="电话号码"
      placeholder="电话号码"
    />
     <van-field
      v-model="query.userMail"
      name="邮箱"
      label="邮箱"
      placeholder="邮箱"      
    />
    <van-field name="radio" label="类型">
    <template #input>
        <van-radio-group v-model="query.userType" direction="horizontal">
        <van-radio name="1">顾客</van-radio>
        <van-radio name="2">商家</van-radio>
        </van-radio-group>
    </template>
    </van-field>
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">
        注册
      </van-button>
    </div>
  </van-form>
  
</template>

<script>
import {register } from '../api/index'
import { Toast } from 'vant';
import router from '../router';
export default {
  data() {
    return {
      query:{
        userName: '',
        userPassWord: '', 
        sex: '男',
        userPhone:'',
        userMail:'',
        userType:"2"
      },
      
    };
  },
  methods: {
    register() {
      register(this.query).then(res => {
          console.log(res.data)
          if(res.data == 1){
            Toast.success('注册成功');
            router.push('/login')  
          }else if(res.data == 3){
            Toast.fail('用户名已存在');
          }
      });
    },
    onClickLeft(){
      console.log("onClickLeft");
      router.push('/login')
    },
    onClickRight(){
      console.log("onClickRight");
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
.loginForm{
  margin-top:1rem;
}
.formTop{
  margin-bottom: 1rem;
}
</style>
