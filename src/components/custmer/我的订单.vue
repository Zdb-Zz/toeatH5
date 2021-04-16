<template>
  <div>
    <van-nav-bar title="我的订单" left-text="返回" @click-left="onClickLeft" class="formTop" />
    <van-dropdown-menu>
      <van-dropdown-item v-model="value1" :options="option1" @change="getOrders()" />
      <van-dropdown-item v-model="value2" :options="option2" @change="getOrders()" />
    </van-dropdown-menu>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
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
        <van-cell
          class="isJiesuan"
          v-if="item.orderState==0"
          :border="false"
          title="未支付"
          :style="{color: 'red'}"
        />
        <van-cell
          class="isJiesuan"
          v-if="item.orderState==1"
          :border="false"
          title="已支付"
          :style="{color: 'green'}"
        />
        <van-button
          class="myButton"
          type="info"
          v-if="item.orderState==0"
          size="small"
          round
          @click="toPay(item.orderId)"
        >去支付</van-button>
        <van-button
          class="myButton"
          type="primary"
          v-if="item.orderState==1"
          size="small"
          round
          @click="toEvaluate(item.orderId)"
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
        pageIndex: 1,
        pageSize: 10,
      },
      list: [],
      index: 0,
      totalPrice: 0,
      loading: false,
      finished: false,
      value1: 0,
      value2: 0,
      option1: [
        { text: "全部订单", value: 0 },
        { text: "已支付", value: 1 },
        { text: "未支付", value: 2 },
      ],
      option2: [
        { text: "默认排序", value: 0 },
        { text: "时间顺序", value: 1 },
        { text: "时间倒序", value: 2 },
      ],
    };
  },
  created() {
    this.query.storeId = this.$route.query.storeId;
    this.query.state = this.value1;
    this.query.timeOrder = this.value2;
    getOrders(this.query).then((res) => {
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
    onLoad() {
      getOrders(this.query).then((res) => {
        console.log(res);
        res.data.forEach((element) => {
          element.menuString = "";
          element.orderMenus.forEach((item) => {
            element.menuString =
              element.menuString + item.menuName + "×" + item.menuNum + " ";
          });
          this.list.push(element);
        });
        this.loading = false;
        this.query.pageIndex = this.query.pageIndex + 1;
        if (res.data.length < this.query.pageSize) {
          this.finished = true;
          this.loading = false;
        }
      });
    },
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
    toPay(orderId) {
      event.stopPropagation();
      this.$router.push({
        path: "/custmer/订单支付页",
        query: {
          orderId: orderId,
        },
      });
    },
    toEvaluate(orderId) {
      event.stopPropagation();
      this.$router.push({
        path: "/custmer/订单详情页",
        query: {
          orderId: orderId,
        },
      });
    },
    // onClickRight() {
    //   this.list.forEach((element) => {
    //     if (element.orderState == 0) {
    //       this.totalPrice += element.orderSumPrice;
    //       this.index++;
    //     }
    //   });
    //   console.log(this.totalPrice);
    //   console.log(this.index);
    // },
    getOrders() {
      this.query.state = this.value1;
      this.query.timeOrder = this.value2;
      this.query.pageIndex = 1;
      getOrders(this.query).then((res) => {
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
.price-bottom-class {
  font-size: 0.3rem;
  width: 3.5rem;
  float: right;
  padding: 0;
  opacity: 1;
}
.isJiesuan {
  z-index: 2;
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
.van-card__desc {
  width: 6.2rem;
}
.van-card__title {
  color: #6466f7;
  font-size: 0.46rem;
  margin-bottom: 0.5rem;
}
.van-card__price {
  color: #3357b9;
}
.van-dropdown-menu {
  z-index: 99;
}
</style>
