<template>
  <div>
    <van-nav-bar title="我的订单" left-text="返回" @click-left="onClickLeft" class="formTop" />
    <van-list>
      <van-cell
        class="cellList"
        v-for="item in list"
        :key="item.orderId"
        @cell-border-color="rgb(255, 176, 176)"
        @click="orderDetail(item.orderId)"
      >
        <van-card
          class="card"
          :price="item.orderSumPrice"
          :desc="item.menuString"
          :title="item.storeName"
        >
          <template #price-top>
            <van-cell
              class="price-bottom-class"
              :title="item.orderCreateTime"
              :border="false"
              :style="{ backgroundColor: 'rgba(0, 0, 0, 0)'}"
            />
          </template>
        </van-card>
        <van-cell class="isJiesuan" v-if="item.orderState==0" :border="false" title="未支付" :style="{color: 'red'}"/>
        <van-cell class="isJiesuan" v-if="item.orderState==1" :border="false" title="已支付" :style="{color: 'green'}"/>
        <van-button
          class="myButton"
          type="info"
          v-if="item.orderState==0"
          size="small"
          round
          @click="toPay()"
        >去支付</van-button>
        <van-button
          class="myButton"
          type="primary"
          v-if="item.orderState==1"
          size="small"
          round
          @click="toEvaluate()"
        >去评价</van-button>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import router from "../../router";
import { getOrders } from "../../api/index";

export default {
  data() {
    return {
      query: {
        storeId: "",
      },
      list: [],
    };
  },
  created() {
    this.query.storeId = this.$route.query.storeId;
    getOrders(this.query.storeId).then((res) => {
      console.log(res);
      this.list = res.data;
      this.list.forEach((element) => {
        element.menuString = "";
        element.orderMenus.forEach((item) => {
          element.menuString =
            element.menuString + item.menuName + "×" + item.menuNum + " ";
        });
      });
    });
    console.log(this.list);
  },
  methods: {
    onClickLeft() {
      if (this.query.storeId == null || this.query.storeId == "") {
        this.$router.push({
          path: "/custmer/我的",
          query: {
            storeId: this.query.storeId,
          },
        });
      } else {
        this.$router.push({
          path: "/custmer/菜单",
          query: {
            storeId: this.query.storeId,
          },
        });
      }
    },
    orderDetail(orderId) {
      this.$router.push({
        path: "/custmer/订单详情页",
        query: {
          orderId: orderId,
        },
      });
    },
    toPay() {
      event.stopPropagation();
    },
    toEvaluate() {
      event.stopPropagation();
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
.price-bottom-class {
  font-size: 0.05rem;
  width: 2.7rem;
  float: right;
  padding: 0;
  opacity: 1;
}
.isJiesuan {
  z-index: 99;
  left: 80%;
  position: absolute;
  top: 0.2rem;
  background-color: rgba(0, 0, 0, 0);
  
}
.myButton {
  float: right;
}
.cellList {
  margin-bottom: 0.4rem;
  background-color: rgba(125, 236, 255, 0.096);
}
.card {
  background-color: rgba(0, 0, 0, 0);
}
.van-card__desc{
  width: 6.2rem;
}
.van-card__title{
  color: #6466F7;
  font-size: 0.46rem;
  margin-bottom: 0.5rem;
}
.van-card__price{
  color: #3357b9;
}
</style>
