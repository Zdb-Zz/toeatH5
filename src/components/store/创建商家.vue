<template>
  <van-form @submit="createStore" class="createStore">
    <van-nav-bar
      title="创建商家"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      class="formTop"
    />
    <van-field
      v-model="query.storeName"
      name="商家名称"
      label="商家名称"
      placeholder="商家名称"
      :rules="[{ required: true, message: '请填写商家名称' }]"
    />
    <van-field
      v-model="query.storeRemark"
      name="商家信息"
      label="商家信息"
      placeholder="商家信息"
       :rules="[{ required: true, message: '商家信息' }]"
    />
    <van-field name="radio" label="营业状态">
    <template #input>
        <van-radio-group v-model="query.storeState" direction="horizontal">
        <van-radio name="1">正在营业</van-radio>
        <van-radio name="0">未营业</van-radio>
        </van-radio-group>
    </template>
    </van-field>
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
  
</template>

<script>
import {createStore } from '../../api/index'
import { Toast } from 'vant';
import router from '../../router';
export default {
  data() {
    return {
      query:{
        storeName: '',
        storeRemark: '', 
        storeState:"1"
      },
    };
  },
  methods: {
    createStore() {
      createStore(this.query).then(res => {
          router.push('/store/菜单')
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
.createStore{
  margin-top:1rem;
}
.formTop{
  margin-bottom: 1rem;
}
</style>
