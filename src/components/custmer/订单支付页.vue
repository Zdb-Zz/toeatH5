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

    <van-submit-bar :price="order.orderSumPrice*100" button-text="立即支付" @submit="show=true" />

    <!-- 图标位置 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '55%' }"
    >
      <h2>请输入支付密码</h2>
      <!-- 密码输入框 -->
      <van-password-input
        :value="value"
        :focused="showKeyboard"
        info="密码为 6 位数字"
        :error-info="errorInfo"
        @focus="showKeyboard = true"
        :length="6"
      />
      <!-- 数字键盘 -->
      <van-number-keyboard v-model="value" :show="showKeyboard" @blur="show=false" />
    </van-popup>
  </div>
</template>

<script>
import router from "../../router";
import { Toast } from "vant";

import { getOrderById, payOrder, findUser } from "../../api/index";
export default {
  data() {
    return {
      query: {
        orderId: "",
        storeId: "",
      },
      order: {},
      show: false,
      menuList: [],
      newOrder: {
        orderId: "",
        orderEvaluate: "",
        rate: 5,
      },
      value: "",
      showKeyboard: true,
      errorInfo: "",
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
    findUser().then((res) => {
      this.user = res.data;
      if (this.user.userPayPassword == null) {
        this.$dialog
          .confirm({
            message: "您的支付密码未设置，请前往个人信息设置",
          })
          .then(() => {
            this.$router.push({
              path: "/custmer/个人信息",
            });
          });
      }
    });
  },
  watch: {
    value(value) {
      if (value.length === 6) {
        if (value == this.user.userPayPassword) {
          this.show = false;
          Toast.success("支付成功");
          payOrder(this.query.orderId).then((res) => {
            if (res.code == 1) {
              this.$router.push({
                path: "/custmer/订单详情页",
                query: {
                  orderId: this.query.orderId,
                },
              });
            }
          });
        }else {
        this.errorInfo = "密码错误！请重新输入";
      }
      } else {
        this.errorInfo = "";
      }
    },
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
