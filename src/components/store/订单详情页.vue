<template>
  <div>
    <van-nav-bar
      title="订单详情"
      class="formTop"
      left-text="返回"
      v-if="query.storeId==null"
      @click-left="onClickLeftToOrders"
    />

    <van-cell-group>
      <van-cell :title="'订单号:'+order.orderId" :value="order.orderState==0?'未支付':'已支付'" />
      <van-list>
        <van-cell
          :title="item.menuName +'×'+item.menuNum"
          :value="'￥'+item.orderMenuPrice"
          v-for="item in menuList"
          :key="item.menuId"
        >
          <template #label>
            <span class="custom-title">单价:￥{{item.menuPriceOne}}--</span>
            <span class="custom-title" v-if="item.menuPepper==0">不辣</span>
            <span class="custom-title" v-if="item.menuPepper==1">微辣</span>
            <span class="custom-title" v-if="item.menuPepper==2">中辣</span>
            <span class="custom-title" v-if="item.menuPepper==3">特辣</span>
          </template>
          <template #icon >
            <van-icon name="success"  v-if="item.orderMenuState==1"/>
            <van-icon name="circle" v-if="item.orderMenuState==0" @click="completeMenu(item),item.orderMenuState=1"/>
          </template>
          
        </van-cell>
        <van-cell :title="'总价:'" :value="'￥'+order.orderSumPrice" />
      </van-list>
    </van-cell-group>

    <div class="evaluate">
      <van-form @submit="onSubmit">
        <van-field
          v-model="order.orderEvaluate"
          rows="2"
          autosize
          disabled
          label="顾客评价"
          type="textarea"
          maxlength="50"
          show-word-limit
          class="remarkClass"
        />
        <van-field name="rate" label="顾客评分">
          <template #input>
            <van-rate
              readonly
              v-model="order.orderRate"
              :size="25"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </template>
        </van-field>
      </van-form>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import { Toast } from "vant";

import { getOrderById, evaluateOrder,completeMenu } from "../../api/index";
export default {
  data() {
    return {
      query: {
        orderId: "",
        storeId: "",
      },
      order: {},
      menuList: [],
      newOrder: {
        orderId: "",
        orderEvaluate: "",
        rate: 5,
      },
    };
  },
  created() {
    this.query = this.$route.query;
    console.log(this.query.storeId);
    console.log(this.query.orderId);
    getOrderById(this.query.orderId).then((res) => {
      this.order = res.data;
      this.menuList = res.data.orderMenus;
    });
  },
   mounted(){
  },
  methods: {
    onClickLeftToMenu() {
      this.$router.push({
        path: "/store/订单管理",
        query: {
          storeId: this.query.storeId,
          show: false,
        },
      });
    },
    onClickLeftToOrders() {
      this.$router.push({
        path: "/store/订单管理",
      });
    },
    onSubmit() {
      evaluateOrder(this.query).then((res) => {});
    },
    completeMenu(item){
      completeMenu(item.orderMenuId).then((res)=>{

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
.remarkClass {
  background-color: #e4e4e460;
}
</style>
