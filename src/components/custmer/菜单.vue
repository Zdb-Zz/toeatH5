<template>
  <div>
    <van-nav-bar
      title="菜单"
      left-text="返回"
      @click-left="onClickLeft"
      right-text="智能推荐点餐"
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

    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="swipeShow">
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播2.jpg')" />
      </van-swipe-item>
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播3.jpg')" />
      </van-swipe-item>
      <van-swipe-item>
        <van-image :src="require('../../assets/images/轮播4.jpg')" />
      </van-swipe-item>
    </van-swipe>

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
                <span v-show="item.menuText!=null" :style="{color:'red'}">
                  {{item.menuText}}
                  <br />
                </span>

                <span>
                  {{'销量：'+item.menuSales}}
                  <br />
                </span>
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
                  @plus="addMenuNum(item)"
                  @minus="subMenuNum(item)"
                  theme="round"
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
            class="shopcar"
            v-for="item in shopCarList"
            center
            :key="item.menuId"
            :title="item.menuName"
            :label="'￥'+item.priceAfterDiscount"
            v-if="item.menuNum != null && shopCarList!=null"
          >
            <template #icon>
              <van-image class="img" width="2rem" height="2rem" :src="item.menuImg" />
            </template>

            <van-stepper
              v-model="item.menuNum"
              min="0"
              default-value="0"
              show-input
              long-press
              @plus="addMenuNum(item)"
              @minus="subMenuNum(item)"
            />
          </van-cell>
        </van-list>
        <van-submit-bar :price="totalPrice" button-text="生成订单" @submit="onSubmit" />
      </van-popup>
    </van-submit-bar>

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
              @plus="addMenuNum(item)"
              @minus="subMenuNum(item)"
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

    <van-overlay
      class="advertisementShow"
      :show="advertisementShow"
      @click="advertisementShow = false"
    >
      <div class="block">
        <van-swipe :autoplay="1500">
          <van-swipe-item v-for="(image, index) in imgList" :key="index">
            <van-image width="80%" height="80%" :src="image" />
          </van-swipe-item>
        </van-swipe>
      </div>
    </van-overlay>

    <!-- 图标位置 -->
    <van-popup
      v-model="payShow"
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
  getAdvertisement,
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
      swipeShow : true,
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
      payShow:false,
      advertisementShow: true,
      imgList: [],
      fileList: [],
      imgList2: [],
      fileList2: [],
      request: {
        imgList2: [],
        storeId: "",
        type: "",
      },
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

    this.request.storeId = this.query.storeId;
    this.request.type = 0;
    getAdvertisement(this.request).then((res) => {
      if(res.data.length==0){
        this.advertisementShow=false
      }
      console.log(res.data);
      res.data.forEach((element) => {
        this.imgList.push(element.advertisementImg);
        this.fileList.push({
          url: element.advertisementImg,
          id: element.advertisementId,
        });
      });
      this.request.type = 1;
      getAdvertisement(this.request).then((res) => {
        if(res.data.length==0){
        this.swipeShow=false
      }
        console.log(res.data);
        res.data.forEach((element) => {
          this.imgList2.push(element.advertisementImg);
          this.fileList2.push({
            url: element.advertisementImg,
            id: element.advertisementId,
          });
        });
      });
    });
    console.log(this.imgList);
    console.log(this.imgList2);
  },
  mounted() {
    this.container = this.$refs.container;
    setTimeout(() => {
      this.show = false;
    }, 100);
    setTimeout(() => {
      this.advertisementShow = false;
    }, 5000);
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
    subMenuNum(item) {
      event.stopPropagation();
      item.menuNum--;
      subMenuNum(item.menuId).then((res) => {
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
    addMenuNum(item) {
      event.stopPropagation();
      item.menuNum++;
      addMenuNum(item.menuId).then((res) => {
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
      console.log(this.query.storeId);
      getRecommendList(this.query.storeId).then((res) => {
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

  width: 100vh;
  height: 100vh;
  background-image: url("../../assets/images/菜单.jpg");
  background-repeat: no-repeat;
  background-size: cover;
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
.shopcar {
  left: -1rem;
}
.van-tree-select__nav {
  top: 4.2rem;
  position: fixed;
  z-index: 100;
}

.van-submit-bar__bar {
  z-index: 200;
}
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 0.213333rem 0.426667rem;
  color: #323233;
  font-size: 0.5rem;
  border-radius: 0.8rem;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.849),
    rgba(60, 183, 255, 0.712)
  );
}
.img {
  float: left;
}
.advertisementShow {
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.my-swipe {
  width: 80%;
  height: 80%;
  margin-left: 2rem;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  width: 80%;
  height: 80%;
}
.block {
  width: 100vw;
  height: 100vh;
  margin-top: 5rem;
}
</style>
