<template>
  <div>
    <van-nav-bar
      title="菜单"
      class="formTop"
      left-text="返回"
      @click-left="onClickLeft"
      right-text="智能点餐"
      @click-right="onClickRight"
    />
    <van-search
      v-model="query.menuName"
      show-action
      label="菜名"
      placeholder="请输入搜索关键词"
      @search="onSearch"
    >
      <template #action>
        <div @click="onSearch">搜索</div>
      </template>
    </van-search>
    <van-tree-select
      height="100%"
      :items="items"
      :main-active-index.sync="active"
      @click-nav="getMenuListByType"
    >
      <template #content>
        <van-empty description="暂无菜品" v-if="list==null" />
        <van-list :finished="finished" finished-text="没有更多了" @load="onLoad" v-if="list!=null">
          <van-cell v-for="item in list" :key="item.menuId">
            <van-card
              :price="item.priceAfterDiscount"
              :origin-price="item.menuPrice"
              :title="item.menuName"
              :thumb="item.menuImg"
              :desc="'销量：'+item.menuSales"
              @click="getMenuById(item.menuId)"
            >
              <template #desc>
                <span>{{'销量：'+item.menuSales}}</span>
                <br />
                <span>{{'销量：'+item.menuSales}}</span>
                <br />
              </template>
              <template #tag v-if="item.menuIsNice==1" v-show="true">
                <van-tag plain type="danger">招牌</van-tag>
              </template>

              <template #tags>
                <van-tag plain type="danger" v-if="item.menuFlavor==1" v-show="true">不辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==2" v-show="true">微辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==3" v-show="true">中辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==4" v-show="true">特辣</van-tag>
                <van-icon
                  name="star"
                  class="collectIcon"
                  color="#FF6600"
                  size="0.6rem"
                  @click="item.isCollect=!item.isCollect,unCollectMenu(item.menuId)"
                  v-if="item.isCollect"
                />
                <van-icon
                  name="star-o"
                  class="collectIcon"
                  color="#FF6600"
                  size="0.6rem"
                  @click="item.isCollect=!item.isCollect,collectMenu(item.menuId)"
                  v-if="!item.isCollect"
                />
              </template>

              <template #footer>
                <van-stepper
                  v-model="item.menuNum"
                  min="0"
                  default-value="0"
                  show-input
                  long-press
                  @plus="addMenuNum(item.menuId)"
                  @minus="subMenuNum(item.menuId)"
                />
              </template>
            </van-card>
          </van-cell>
        </van-list>
      </template>
    </van-tree-select>
    <van-submit-bar :price="totalPrice" button-text="生成订单" @submit="onSubmit">
      <van-button
        round
        block
        type="info"
        class="shopCar"
        @click="shopCarShow=!shopCarShow,getShopCarList()"
      >查看购物车</van-button>
      <van-popup
        v-model="shopCarShow"
        position="bottom"
        closeable
        :style="{ height: '60%',paddingTop:'0.3rem'}"
      >
        <van-nav-bar
          title="购物车"
          class="formTop"
          @click-left="cleanShopCar"
          v-if="shopCarList==null || shopCarList.length==0"
        />
        <van-nav-bar
          title="购物车"
          class="formTop"
          left-text="清空购物车"
          @click-left="cleanShopCar"
          v-if="shopCarList!=null && shopCarList.length!=0"
        />
        <van-cell
          v-if="shopCarList==null || shopCarList.length==0"
          center
          title="购物车是空的！快去买点什么吧!"
          :title-style="{color:'#ee0a24'}"
        />
        <van-list v-model="loading" :finished="finished" @load="onLoad">
          <van-cell
            v-for="item in shopCarList"
            center
            :key="item.menuId"
            :title="item.menuName"
            :label="'￥'+item.priceAfterDiscount"
            v-if="item.menuNum != null && shopCarList!=null"
          >
            <van-stepper
              v-model="item.menuNum"
              min="0"
              default-value="0"
              show-input
              long-press
              @plus="addMenuNum(item.menuId)"
              @minus="subMenuNum(item.menuId)"
            />
          </van-cell>
        </van-list>
        <van-submit-bar :price="totalPrice" button-text="生成订单" @submit="onSubmit" />
      </van-popup>
    </van-submit-bar>
    <van-popup v-model="menuShow" closeable position="bottom" :style="{ height: '100%'}">内容</van-popup>
    <van-popup v-model="recommendShow" :style="{width:'90%', height: '75%'}">
      <van-nav-bar
        title="推荐菜单"
        class="formTop"
        :style="{fontSize:'0.5rem'}"
        @click-left="onClickRight"
      >
        <template #left>
          换一批
          <van-icon name="replay" :style="{fontSize:'0.5rem'}" />
        </template>
      </van-nav-bar>

      <van-cell v-for="item in recommendList" :key="item.menuId">
        <van-card
          :price="item.priceAfterDiscount"
          :origin-price="item.menuPrice"
          :title="item.menuName"
          :thumb="item.menuImg"
          :desc="item.recommendByMenu"
          @click="getMenuById(item.menuId)"
        >
          <template #footer>
            <van-stepper
              v-model="item.menuNum"
              min="0"
              default-value="0"
              show-input
              long-press
              @plus="addMenuNum(item.menuId)"
              @minus="subMenuNum(item.menuId)"
            />
          </template>
        </van-card>
      </van-cell>
    </van-popup>
    <div class="orderIcon" @click="gotoMyOrder">
      <van-icon name="balance-list" size="1rem" />
    </div>
    <van-overlay :show="show" @click="show = false" :style="{backgroundColor:'white'}">
      <div class="wrapper" @click.stop>
        <van-loading v-if="show" size="2rem" />
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { Toast } from "vant";
import {
  getMenuList,
  getMenuStringList,
  addMenuNum,
  subMenuNum,
  getTotalPrice,
  getShopCarList,
  collectMenu,
  unCollectMenu,
  getRecommendList,
  cleanShopCar,
} from "../../api/index";
import router from "../../router";
import { Dialog } from "vant";
import { Overlay } from "vant";
import { Col, Row } from "vant";

export default {
  data() {
    return {
      query: {
        storeId: "",
        menuType: "",
        menuName: "",
      },
      active: 0,
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      items: [{}],
      totalPrice: 0,
      shopCarShow: false,
      shopCarList: [],
      menuShow: false,
      recommendShow: false,
      recommendList: [],
      container: null,
      show: true,
    };
  },
  created() {
    this.query.storeId = this.$route.query.storeId;
    this.show = this.$route.query.show;
    getMenuStringList(this.query).then((res) => {
      this.items = res.data;
      this.query.menuType = this.items[this.active].menuTypeId;
      getMenuList(this.query).then((res) => {
        this.list = res.data;
        console.log(this.list);
      });
    });
    getTotalPrice().then((res) => {
      this.totalPrice = res.data * 100;
    });
    getShopCarList().then((res) => {
      console.log(res);
      this.shopCarList = res.data;
      console.log(this.shopCarList);
    });
    Toast.setDefaultOptions({ duration: 700 });
    setTimeout(() => {
      this.show = false;
    }, 100);
  },
  mounted() {
    this.container = this.$refs.container;
    setTimeout(() => {
      this.show = false;
    }, 100);
  },

  methods: {
    //下拉刷新
    onLoad() {
      this.query.menuType = this.items[this.active].menuTypeId;
      console.log(this.items[this.active]);
      getMenuList(this.query).then((res) => {
        console.log(res);
        this.list = res.data;
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
    getMenuListByType() {
      this.query.menuType = this.items[this.active].menuTypeId;
      getMenuList(this.query).then((res) => {
        console.log(res);
        this.list = res.data;
        this.refreshing = false;
        this.loading = false;
        this.finished = true;
      });
    },
    getMenuById(menuId) {
      this.menuShow = true;
      console.log(menuId);
    },
    onSubmit() {
      if (this.shopCarList != null && this.shopCarList.length != 0) {
        this.$router.push({
          path: "/custmer/订单提交页",
          query: {
            storeId: this.query.storeId,
          },
        });
      } else {
        Toast.fail("购物车为空哦");
      }
    },
    subMenuNum(menuId) {
      event.stopPropagation();
      subMenuNum(menuId).then((res) => {
        getTotalPrice().then((res) => {
          this.totalPrice = res.data * 100;
          console.log(this.totalPrice);
          // getMenuList(this.query).then((res) => {
          //   console.log(res);
          //   this.list = res.data;
          //   this.refreshing = false;
          //   this.loading = false;
          //   this.finished = true;
          // });
          getShopCarList().then((res) => {
            console.log(res);
            this.shopCarList = res.data;
            console.log(this.shopCarList);
          });
        });
      });
    },
    addMenuNum(menuId) {
      event.stopPropagation();
      addMenuNum(menuId).then((res) => {
        getTotalPrice().then((res) => {
          this.totalPrice = res.data * 100;
          console.log(this.totalPrice);
          // getMenuList(this.query).then((res) => {
          //   console.log(res);
          //   this.list = res.data;
          //   this.refreshing = false;
          //   this.loading = false;
          //   this.finished = true;
          // });
          getShopCarList().then((res) => {
            console.log(res);
            this.shopCarList = res.data;
            console.log(this.shopCarList);
          });
        });
      });
    },
    getShopCarList() {
      getShopCarList().then((res) => {
        console.log(res);
        this.shopCarList = res.data;
        console.log(this.shopCarList);
      });
    },
    collectMenu(menuId) {
      event.stopPropagation();
      collectMenu(menuId).then((res) => {
        console.log(res);
        if (res.code == 1) {
          Toast.success("收藏成功");
        } else if (res.code == 3) {
          Toast.fail("收藏失败");
        }
      });
      console.log("收藏" + menuId);
    },
    unCollectMenu(menuId) {
      event.stopPropagation();
      unCollectMenu(menuId).then((res) => {
        console.log(res);
        if (res.code == 1) {
          Toast.success("取消收藏成功");
        } else if (res.code == 3) {
          Toast.fail("取消收藏失败");
        }
      });
      console.log("取消收藏" + menuId);
    },
    onClickLeft() {
      router.push("/custmer/商家列表");
    },
    onClickRight() {
      getRecommendList().then((res) => {
        this.recommendList = res.data;
        console.log(res);
      });
      this.recommendShow = true;
    },
    cleanShopCar() {
      Dialog.confirm({
        title: "清空购物车",
        message: "请确认清空",
      })
        .then(() => {
          cleanShopCar(this.query.storeId).then((res) => {
            this.onRefresh();
            this.shopCarShow = false;
            this.totalPrice = 0;
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    gotoMyOrder() {
      this.$router.push({
        path: "/custmer/我的订单",
        query: {
          storeId: this.query.storeId,
        },
      });
    },
    loadingShow() {
      this.show = false;
    },
    onSearch() {
      getMenuList(this.query).then((res) => {
        if (res.data == null) {
          Toast.fail("没有找到您要的菜哦");
          this.query.menuName = "";
        } else {
          this.list = res.data;
          this.refreshing = false;
          this.loading = false;
          this.finished = true;
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
.shopCar {
  width: 2.933333rem;
  height: 1.066667rem;
  font-weight: 500;
}
.van-tree-select__content {
  -webkit-box-flex: 3;
  -webkit-flex: 3;
  flex: 3;
}
.setNum {
  background-color: tomato;
  color: white;
  height: 0.4rem;
  z-index: 99;
}
.van-cell {
  font-size: 0.483333rem;
}
.van-list {
  margin-bottom: 1.333333rem;
}
.van-card__title {
  font-size: 0.43rem;
  font-weight: 1000;
  line-height: 0.43rem;
}
.van-icon {
  position: relative;
  float: right;
}
.recommendBox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.orderIcon {
  position: fixed;
  width: 1rem;
  height: 1rem;
  float: left;
  top: 70%;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.van-list {
  margin-bottom: 1.333333rem;
  padding-left: 2rem;
}
.van-tree-select__nav {
  top: 4.2rem;
  position: fixed;
  z-index: 999;
}
</style>
