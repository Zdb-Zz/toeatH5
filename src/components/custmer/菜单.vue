<template>
  <div>
    <van-nav-bar
      title="菜单"
      class="formTop"
    />
    <van-tree-select
      height="100%"
      :items="items" 
      :main-active-index.sync="active" 
      @click-nav="getMenuListByType">
      <template #content>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell v-for="item in list" :key="item.menuId">
              <van-card
                :price=item.priceAfterDiscount
                :origin-price=item.menuPrice
                :title=item.menuName
                :thumb=item.menuImg
                @click="getMenuById(item.menuId)"
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
              <template #footer>
                <van-button class="setNum" size="mini" @click.stop="item.num--" :disabled="item.num<=0?true:false">-</van-button>
                  {{item.num}}
                <van-button class="setNum" size="mini" @click="item.num++">+</van-button>
              </template>
              </van-card>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </template>
    </van-tree-select>
    <van-submit-bar :price="3050" button-text="提交订单" @submit="onSubmit" >
      <van-button round block type="info" class="shopCar">
      查看购物车
    </van-button>
    </van-submit-bar>
    
  </div>
</template>

<script>
import {getMenuList,getMenuStringList}from '../../api/index'
import router from '../../router';
export default {
  data() {
    return {  
      query:{
        storeId:'',
        menuType:''
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
    this.query.storeId = this.$route.query.storeId
    getMenuStringList(this.query).then(res=>{
      this.items = res.data
      this.query.menuType = this.items[this.active].menuTypeId
      console.log(res)
      getMenuList(this.query).then(res=>{
      this.list = res.data
      console.log(this.list)
    })
    })
  },
  mounted(){
  },
  
  methods:{
    //下拉刷新
    onLoad() {
        this.query.menuType = this.items[this.active].menuTypeId
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
    getMenuListByType(){
      console.log(this.items[this.active].menuTypeId)
      this.query.menuType = this.items[this.active].menuTypeId
      getMenuList(this.query).then(res => {
          console.log(res)
          this.list=res.data
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
        });
    },
    getMenuById(menuId){
      console.log(menuId)

    },
    onSubmit(){

    }
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

.shopCar{
    width: 2.933333rem;
    height: 1.066667rem;
    font-weight: 500;
}
.van-tree-select__content {
    -webkit-box-flex: 3;
    -webkit-flex: 3;
    flex: 3;
}
.setNum{
  background-color:tomato;
  color: white;
  height: 0.4rem;
  z-index: 99;
}
</style>
