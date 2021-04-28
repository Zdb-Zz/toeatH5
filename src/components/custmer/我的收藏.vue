<template>
  <div class="background">
    <van-nav-bar title="我的收藏" left-text="返回" @click-left="onClickLeft" class="formTop" />
    <van-empty description="暂无菜品" v-if="list==null" />
    <van-list>
      <van-cell v-for="item in list" :key="item.menuId">
        <van-card
          :price="item.priceAfterDiscount"
          :origin-price="item.menuPrice"
          :title="item.menuName"
          :thumb="item.menuImg"
          :desc="'商家：'+item.storeName"
          @click="gotoStore(item.menuStoreId)"
        >
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
        </van-card>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { Toast } from "vant";
import router from "../../router";
import { getCollectList, unCollectMenu, collectMenu } from "../../api/index";
export default {
  data() {
    return {
      list: [],
    };
  },
  created() {
    console.log("获取收藏列表");
    getCollectList().then((res) => {
      this.list = res.data;
    });
  },
  methods: {
    onClickLeft() {
      router.push("/custmer/我的");
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
    gotoStore(storeId) {
      this.$router.push({
        path: "/custmer/菜单",
        query: {
          storeId: storeId,
        },
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
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 0.213333rem 0.426667rem;
  color: #323233;
  font-size: 0.4rem;
  background-color: #fafafa;
}
.van-card__title {
  max-height: 1.853333rem;
  font-weight: 500;
  line-height: 0.926667rem;
}
.van-icon {
  position: relative;
  float: right;
}
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/收藏.jpg");
  z-index: 99;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
