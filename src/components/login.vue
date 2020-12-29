<template>
  <van-form @submit="login" class="loginForm">
    <van-nav-bar
      title="用户登录"
      right-text = "新用户注册"
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
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
  
</template>

<script>
import {login} from '../api/index'
import { Toast } from 'vant';
import router from '../router';
export default {
  data() {
    return {
      query:{
        userName: '',
        userPassWord: '', 
      }
    };
  },
  methods: {
    onSubmit(values) {
      console.log('submit', values);
    },
     login() {
      login(this.query).then(res => {
          console.log(res.data)
          if(res.data!=null){
            Toast.setDefaultOptions({ duration: 500 });
            Toast.success('登录成功');
            //管理员登录
            if(res.data.userType==0){
              router.push('/admin/home')  
            }else if(res.data.userType==1){//顾客登录
              router.push('/custmer/商家列表')  
            }else if(res.data.userType==2){//商家登录
              router.push('/store/菜单')  
            }
         }else{
           Toast.fail(res.message);
         }
      });
    },
    onClickLeft(){
      console.log("onClickLeft");
    },
    onClickRight(){
      console.log("onClickRight");
      router.push('/register')
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
