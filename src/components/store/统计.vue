<template>
  <div class="background">
    <h1>营业报告</h1>
    <van-grid class="orderToday" :border="false" :column-num="2">
      <van-grid-item>
        <van-cell title="今日订单数" :style="{backgroundColor:'#3333FF',color:'white'}" />
        <van-cell :title="orderCount" />
      </van-grid-item>
      <van-grid-item>
        <van-cell title="今日营业额" :style="{backgroundColor:'#006633',color:'white'}" />
        <van-cell :title="orderSum+'元'" />
      </van-grid-item>
    </van-grid>

    <div class="salesRank">
      <van-collapse v-model="activeNames">
        <van-collapse-item title="总销量排行" name="1">
          <van-dropdown-menu>
            <van-dropdown-item v-model="value1" :options="option1" @change="salesRankChange" />
            <van-dropdown-item v-model="value2" :options="option2" @change="salesRankChange" />
          </van-dropdown-menu>
          <div id="totalSalesRank" :style="{width: '115%', height: '300%'}"></div>
        </van-collapse-item>
        <van-collapse-item title="近一年营业额" name="2">
          <van-tabs type="card" v-model="query.timeType" @change="timeChange()">
            <van-tab title="年"></van-tab>
            <van-tab title="月"></van-tab>
          </van-tabs>
          <div id="totalBusiness" :style="{width: '100%', height: '300%'}"></div>
        </van-collapse-item>
        <van-collapse-item title="标题3" name="3">内容</van-collapse-item>
      </van-collapse>
      <van-tabbar v-model="active">
        <van-tabbar-item icon="home-o" @click="menu">菜单</van-tabbar-item>
        <van-tabbar-item icon="chart-trending-o" @click="chart">营业报告</van-tabbar-item>
        <van-tabbar-item icon="friends-o" @click="center">商家中心</van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import {
  getSalesRank,
  getMenuStringList,
  salesRankByTime,
  todayBusiness,
  totalBusiness,
} from "../../api/index";
import Cookies from "js-cookie";
export default {
  data() {
    return {
      active: 1,
      activeNames: ["1", "2"],
      orderCount: 0,
      orderSum: 0,
      query: {
        menuType: null,
        storeId: null,
        rankType: 0,
        timeType: 0,
      },
      option: {
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
            color: "#33CCFF",
          },
        ],
      },
      value1: 0,
      value2: 0,
      option1: [
        { text: "总销量", value: 0 },
        { text: "年销量", value: 1 },
        { text: "月销量", value: 2 },
        { text: "日销量", value: 3 },
      ],
      option2: [{ text: "菜品类型", value: 0, menuTypeId: 0 }],
      option3: {
         xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
    }]
      },
    };
  },
  created() {
    console.log(this.activeNames);
    this.query.storeId = Cookies.get("storeId");
    todayBusiness(this.query.storeId).then((res) => {
      this.orderCount = res.data.orderCount;
      this.orderSum = res.data.orderSum;
    });
    getMenuStringList(this.query).then((res) => {
      res.data.forEach((element) => {
        this.option2.push(element);
      });
      console.log(this.option2);
    });
    getSalesRank(this.query).then((res) => {
      this.option.xAxis.data = res.data.menuNames;
      this.option.series[0].data = res.data.menuSales;
      this.drawLine();
    });
    totalBusiness(this.query).then((res) => {
      this.option3.series[0].data = res.data.sumList;
      this.option3.xAxis.data = res.data.timeList;
      this.drawLine1();
    });
  },
  mounted() {},
  methods: {
    menu() {
      router.push("/store/菜单");
    },
    center() {
      router.push("/store/商家中心");
    },
    chart() {
      router.push("/store/统计");
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let totalSalesRank = this.$echarts.init(
        document.getElementById("totalSalesRank")
      );
      // 绘制图表
      totalSalesRank.setOption(this.option);
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let totalBusiness = this.$echarts.init(
        document.getElementById("totalBusiness")
      );
      // 绘制图表
      totalBusiness.setOption(this.option3);
    },
    timeSalesChange() {
      getSalesRank(this.query).then((res) => {
        this.option.xAxis.data = res.data.menuNames;
        this.option.series[0].data = res.data.menuSales;
        this.drawLine1();
      });
    },
    salesRankChange() {
      if (this.value2 != 0) {
        this.query.menuType = this.value2;
      } else {
        this.query.menuType = null;
      }
      this.query.rankType = this.value1;
      console.log(this.query);
      getSalesRank(this.query).then((res) => {
        this.option.xAxis.data = res.data.menuNames;
        this.option.series[0].data = res.data.menuSales;
        this.drawLine();
      });
    },
    timeChange() {
      console.log(this.query.timeType);
      totalBusiness(this.query).then((res) => {
        this.option3.series[0].data = res.data.sumList;
        this.option3.xAxis.data = res.data.timeList;
        this.drawLine1();
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

.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/商家列表.jpg");
  z-index: 99;
  background-repeat: no-repeat;
}
.van-tabbar-item {
  color: rgba(51, 143, 230, 0.89);
  background-color: rgba(255, 255, 255, 0.89);
}
.van-tabbar-item--active {
  color: #ffffff;
  background-color: rgba(51, 143, 230, 0.89);
}

</style>
