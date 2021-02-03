<template>
  <div>
    <van-nav-bar title="提交订单" class="formTop" left-text="返回菜单" @click-left="onClickLeft" />
    <van-list>
      <van-cell v-for="item in list" :key="item.menuId">
        <van-card
          :price="item.priceAfterDiscount"
          :origin-price="item.menuPrice"
          :title="item.menuName"
          :thumb="item.menuImg"
          :num="item.menuNum"
        >
          <template #tag v-if="item.menuIsNice==1" v-show="true">
            <van-tag plain type="danger">招牌</van-tag>
          </template>

          <template #tags>
            <van-tag plain type="danger" v-if="item.menuFlavor==1" v-show="true">不辣</van-tag>
            <van-tag plain type="danger" v-if="item.menuFlavor==2" v-show="true">微辣</van-tag>
            <van-tag plain type="danger" v-if="item.menuFlavor==3" v-show="true">中辣</van-tag>
            <van-tag plain type="danger" v-if="item.menuFlavor==4" v-show="true">特辣</van-tag>
          </template>
        </van-card>
      </van-cell>
    </van-list>
    <van-field
      v-model="query.remark"
      rows="2"
      autosize
      label="用餐备注"
      type="textarea"
      maxlength="50"
      placeholder="例如：少放辣、不要葱姜蒜……"
      show-word-limit
      class="remarkClass"
      :style="{marginBottom:'2rem'}"
    />
    <van-submit-bar :price="price" button-text="提交订单" @submit="onSubmit" />
  </div>
</template>

<script>
import router from "../../router";
import { getShopCarList, getTotalPrice,submitOrder } from "../../api/index";
export default {
  data() {
    return {
      query: {
        menus: [],
        storeId: "",
        remark: "",
        totalPrice:0
      },
      list:[],
      price: 0,
    };
  },
  created() {
    this.query.storeId = this.$route.query.storeId;
    getShopCarList().then((res) => {
      this.list = res.data;
    });
    getTotalPrice().then((res) => {
      this.query.totalPrice = res.data
      this.price = res.data * 100;
    });
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/custmer/菜单",
        query: {
          storeId: this.query.storeId,
        },
      });
    },
    onSubmit() {
      this.query.menus = JSON.stringify(this.list)
      submitOrder(this.query).then((res)=>{
        console.log(res)
        this.$router.push({
        path: "/custmer/订单详情页",
        query: {
          orderId: res.data,
          storeId: this.query.storeId,
        },
      });
      })
      
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
.loginForm {
  margin-top: 1rem;
}
.formTop {
  margin-bottom: 1rem;
}
.remarkClass {
  background-color: #e4e4e460;
}
</style>
