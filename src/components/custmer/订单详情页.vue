<template>
  <div>
    <van-nav-bar
      title="订单详情"
      class="formTop"
      left-text="继续点菜"
      v-if="query.storeId!=null"
      @click-left="onClickLeftToMenu"
    />
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
        </van-cell>
      </van-list>
    </van-cell-group>

    <div class="evaluate">
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0.6rem 0.5rem' }"
      >用餐完毕欢迎评价</van-divider>

      <van-form @submit="onSubmit">
        <van-field
          v-model="order.orderEvaluate"
          rows="2"
          autosize
          label="评价"
          type="textarea"
          maxlength="50"
          show-word-limit
          class="remarkClass"
        />
        <van-field name="rate" label="评分">
          <template #input>
            <van-rate v-model="order.orderRate" :size="25" color="#ffd21e" void-icon="star" void-color="#eee" />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import { Toast } from "vant";

import { getOrderById ,evaluateOrder} from "../../api/index";
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
        orderId:'',
        orderEvaluate:'',
        rate:5
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
    onClickLeftToMenu() {
      this.$router.push({
        path: "/custmer/菜单",
        query: {
          storeId: this.query.storeId,
          show: false,
        },
      });
    },
    onClickLeftToOrders() {
      this.$router.push({
        path: "/custmer/我的订单",
      });
    },
    onSubmit() {
      this.newOrder.orderId = this.query.orderId;
      this.newOrder.orderEvaluate = this.order.orderEvaluate;
      this.newOrder.rate = this.order.orderRate;
      evaluateOrder(this.newOrder).then((res) => {if (res.code == 1) {
          Toast.success("评论成功");
        } else if (res.code == 3) {
          Toast.fail("评论失败");
        }});
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
