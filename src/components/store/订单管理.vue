<template>
  <div>
    <van-nav-bar title="订单管理" left-text="返回" @click-left="onClickLeft" class="formTop" />
    <van-dropdown-menu>
      <van-dropdown-item v-model="value1" :options="option1" @change="getStoreOrders()" />
      <van-dropdown-item v-model="value2" :options="option2" @change="getStoreOrders()" />
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
          :title="item.userName+':\t'+item.userPhone"
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
          class="isJiesuan1"
          v-if="item.isComplete==0"
          :border="false"
          title="菜单未完成"
          :style="{color: 'red'}"
        />
        <van-cell
          class="isJiesuan1"
          v-if="item.isComplete==1"
          :border="false"
          title="菜单已完成"
          :style="{color: 'green'}"
        />
        <van-cell
          class="isJiesuan"
          v-if="item.orderState==0"
          :border="false"
          title="顾客未支付"
          :style="{color: 'red'}"
        />
        <van-cell
          class="isJiesuan"
          v-if="item.orderState==1"
          :border="false"
          title="顾客已支付"
          :style="{color: 'green'}"
        />
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import router from "../../router";
import { getStoreOrders } from "../../api/index";
import Cookies from "js-cookie";
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
    this.query.storeId = Cookies.get("storeId");
    this.query.state = this.value1;
    this.query.timeOrder = this.value2;
    console.log(this.list);
  },
  methods: {
    onLoad() {
      //请求接口
      getStoreOrders(this.query).then((res) => {
        console.log(res);
        res.data.forEach((element) => {
          //将菜品名称进行拼接
          element.menuString = "";
          element.orderMenus.forEach((item) => {
            element.menuString =
              element.menuString + item.menuName + "×" + item.menuNum + " ";
          });
          //将订单存入列表
          this.list.push(element);
        });
        //暂停加载
        this.loading = false;
        //请求下一页数据
        this.query.pageIndex = this.query.pageIndex + 1;
        if (res.data.length < this.query.pageSize) {
          //返回条数比每页条数短，加载完成
          this.finished = true;
          this.loading = false;
        }
      });
    },
    onClickLeft() {
      this.$router.push({
        path: "/store/商家中心",
        query: {
          storeId: this.query.storeId,
        },
      });
    },

    orderDetail(orderId) {
      this.$router.push({
        path: "/store/订单详情页",
        query: {
          orderId: orderId,
        },
      });
    },

    getStoreOrders() {
      this.finished=false
      this.query.state = this.value1;
      this.query.timeOrder = this.value2;
      this.query.pageIndex=1
      getStoreOrders(this.query).then((res) => {
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
.isJiesuan1 {
  z-index: 2;
  left: 70%;
  position: absolute;
  top: 0.2rem;
  background-color: rgba(0, 0, 0, 0);
}
.isJiesuan {
  z-index: 2;
  left: 70%;
  position: absolute;
  top: 01rem;
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
