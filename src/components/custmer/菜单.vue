<template>
  <div>
    <van-nav-bar
      title="菜单"
      class="formTop"
    />
    <van-tree-select height="100%" :items="items" :main-active-index.sync="active">
      <template #content>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" v-if="active === 0">
          <van-list
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item.menuId">
              <van-card
                v-if="item.menuType ==1"
                :price=item.priceAfterDiscount
                :origin-price=item.menuPrice
                :title=item.menuName
                :thumb=item.menuImg
              >
              <template #tag v-if="item.menuIsNice==1" v-show="true">
                <van-tag plain type="danger">
                  招牌
                </van-tag>
              </template>
              <template #tags >
                <van-tag plain type="danger" v-if="item.menuFlavor==1" v-show="true">
                  不辣
                </van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==2" v-show="true">
                  微辣
                </van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==3" v-show="true">
                  中辣
                </van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==4" v-show="true">
                  特辣
                </van-tag>
                <van-tag plain type="danger" v-if="item.menuTypeDes!=null" v-show="true">
                  {{item.menuTypeDes}}
                </van-tag>
              </template>
              </van-card>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </template>
    </van-tree-select>
  </div>
</template>

<script>
import {getMenuList,getMenuStringList}from '../../api/index'
import router from '../../router';
export default {
  data() {
    return {  
      query:{
        storeId:''
      },
      active:0,
      list:[],
      loading: false,
      finished: false,
      refreshing: false,
      items:[]
    };
  },
  created(){
  },
  mounted(){
    this.query.storeId = this.$route.query.storeId
    console.log(this.$route.query.storeId);
    console.log(this.query.storeId);
    getMenuList(this.query).then(res=>{
      this.list = res.data
      console.log(res)
    })
    getMenuStringList(this.query).then(res=>{
      this.items = res.data
      console.log(res)
    })
  },
  
  methods:{
    //下拉刷新
    onLoad() {
        getMenuList(this.query).then(res => {
          console.log(res)
          this.list=res.data
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
        });
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
  }
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
