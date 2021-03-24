<template>
  <div>
    <van-nav-bar title="订单支付" class="formTop" v-if="query.storeId!=null" />
    <van-nav-bar
      title="订单支付"
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
        </van-cell>
      </van-list>
    </van-cell-group>

    <van-submit-bar :price="order.orderSumPrice*100" button-text="立即支付" @submit="onSubmit" />
  </div>
</template>

<script>
import router from "../../router";
import { Toast } from "vant";

import { getOrderById, payOrder } from "../../api/index";
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
  methods: {
    onClickLeftToOrders() {
      this.$router.push({
        path: "/custmer/我的订单",
      });
    },
    onSubmit() {
      payOrder(this.query.orderId).then((res) => {
        if (res.code == 1) {
          Toast.success("支付成功");
          this.$router.push({
            path: "/custmer/订单详情页",
            query: {
              orderId: this.query.orderId,
            },
          });
        } else if (res.code == 3) {
          Toast.fail("支付失败");
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
