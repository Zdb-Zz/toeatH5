<template>
  <div>
    <van-nav-bar
      title="菜单"
      right-text="新增菜品"
      @click-right="addMenuPannel"
      left-text="编辑类别"
      @click-left="editTypeShow = true"
      class="formTop"
    />
    <van-search
      v-model="food.menuName"
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
      height="80%"
      :items="items"
      :main-active-index.sync="active"
      @click-nav="getMenuListByType"
    >
      <template #content>
        <van-empty description="暂无菜品" v-if="list==null" />
        <van-list
          class="menuList"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          v-if="list!=null"
        >
          <van-cell v-for="item in list" :key="item.menuId">
            <van-card
              :price="item.priceAfterDiscount"
              :origin-price="item.menuPrice"
              :title="item.menuName"
              :thumb="item.menuImg"
              :desc="'销量：'+item.menuSales"
            >
              <template #tag v-if="item.menuIsNice==1" v-show="true">
                <van-tag plain type="danger">招牌</van-tag>
              </template>

              <template #tags>
                <van-tag plain type="danger" v-if="item.menuFlavor==1" v-show="true">不辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==2" v-show="true">微辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==3" v-show="true">中辣</van-tag>
                <van-tag plain type="danger" v-if="item.menuFlavor==4" v-show="true">特辣</van-tag>
              </template>
              <template #footer>
                <van-button @click="getMenuById(item.menuId)" size="mini">修改</van-button>
                <van-button @click="delMenuById(item.menuId)" size="mini">删除</van-button>
              </template>
            </van-card>
          </van-cell>
        </van-list>
      </template>
    </van-tree-select>
    <van-tabbar v-model="tabbarActive">
      <van-tabbar-item icon="home-o" @click="menu">菜单</van-tabbar-item>
      <van-tabbar-item icon="chart-trending-o" @click="chart">统计</van-tabbar-item>
      <van-tabbar-item icon="friends-o" @click="center">商家中心</van-tabbar-item>
    </van-tabbar>
    <!--遮罩层-->
    <van-popup v-model="show">
      <div class="wrapper" @click.stop>
        <div class="addMenu">
          <van-form @submit="addMenu" class="addMenuForm">
            <van-nav-bar
              title="新增菜品"
              class="formTop"
              left-text="取消"
              right-text="提交"
              @click-left="show = false"
              @click-right="addMenu"
            />
            <van-field
              v-model="food.menuName"
              name="菜品名称"
              label="菜品名称"
              placeholder="菜品名称"
              :rules="[{ required: true, message: '请填写菜品名称' }]"
            />
            <van-field
              v-model="food.menuPrice"
              name="菜品原价格"
              label="菜品原价格"
              placeholder="菜品原价格"
              :rules="[{ required: true, message: '菜品原价格' }]"
              @change="editDiscount($event)"
            />
            <van-field
              v-model="food.menuDiscount"
              name="菜品折扣（%）"
              label="菜品折扣（%）"
              placeholder="菜品折扣（%）"
              :rules="[{ required: true, message: '菜品折扣（%）' }]"
              @change="editDiscount($event)"
            />
            <van-field
              v-model="food.priceAfterDiscount"
              name="菜品折后价格"
              label="菜品折后价格"
              placeholder="菜品折后价格"
            />
            <van-field name="radio" label="是否是招牌菜">
              <template #input>
                <van-radio-group v-model="food.menuIsNice" direction="horizontal">
                  <van-radio name="1">招牌</van-radio>
                  <van-radio name="0">非招牌</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field name="radio" label="推荐口味">
              <template #input>
                <van-radio-group v-model="food.menuFlavor" direction="horizontal">
                  <van-radio name="1">不辣</van-radio>
                  <van-radio name="2">微辣</van-radio>
                  <van-radio name="3">中辣</van-radio>
                  <van-radio name="4">特辣</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              name="picker"
              :value="food.menuTypeDes"
              label="菜品类型"
              placeholder="点击选择菜品类型"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
              <van-picker
                show-toolbar
                :columns="menuTypeList"
                value-key="menuTypeName"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
            <div class="box">
              <div class="foodImg">
                <van-image :src="`${imgSrc}` ">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="upDiv">
                {{labTex}}
                <input
                  ref="uploadInput"
                  type="file"
                  class="upinp"
                  name="file"
                  value
                  accept="image/gif, image/jpeg, image/jpg, image/png"
                  @change="selectImg($event)"
                />
              </div>
            </div>
            <van-field
              v-model="food.menuText"
              name="菜品描述"
              label="菜品描述"
              placeholder="菜品描述"
              :rules="[{ required: true, message: '请填写菜品描述' }]"
            />
          </van-form>
        </div>
      </div>
    </van-popup>
    <!-- 编辑菜品 -->
    <van-popup v-model="editShow">
      <div class="wrapper" @click.stop>
        <div class="addMenu">
          <van-form @submit="editMenu" class="addMenuForm">
            <van-nav-bar
              title="编辑菜品"
              class="formTop"
              left-text="取消"
              right-text="提交"
              @click-left="editShow = false"
              @click-right="editMenu"
            />
            <van-field
              v-model="food.menuName"
              name="菜品名称"
              label="菜品名称"
              placeholder="菜品名称"
              :rules="[{ required: true, message: '请填写菜品名称' }]"
            />
            <van-field
              v-model="food.menuPrice"
              name="菜品原价格"
              label="菜品原价格"
              placeholder="菜品原价格"
              :rules="[{ required: true, message: '请填写菜品原价格' }]"
              @change="editDiscount($event)"
            />
            <van-field
              v-model="food.menuDiscount"
              name="菜品折扣（%）"
              label="菜品折扣（%）"
              placeholder="菜品折扣（%）"
              :rules="[{ required: true, message: '请填写菜品折扣（%）' }]"
              @change="editDiscount($event)"
            />
            <van-field
              v-model="food.priceAfterDiscount"
              name="菜品折后价格"
              label="菜品折后价格"
              placeholder="菜品折后价格"
            />
            <van-field name="radio" label="是否是招牌菜">
              <template #input>
                <van-radio-group v-model="food.menuIsNice" direction="horizontal">
                  <van-radio name="1">招牌</van-radio>
                  <van-radio name="0">非招牌</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field name="radio" label="推荐口味">
              <template #input>
                <van-radio-group v-model="food.menuFlavor" direction="horizontal">
                  <van-radio name="1">不辣</van-radio>
                  <van-radio name="2">微辣</van-radio>
                  <van-radio name="3">中辣</van-radio>
                  <van-radio name="4">特辣</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field
              readonly
              clickable
              name="picker"
              :value="food.menuTypeDes"
              label="菜品类型"
              placeholder="点击选择菜品类型"
              @click="showPicker = true"
            />
            <van-popup v-model="showPicker" position="bottom">
              <van-picker
                show-toolbar
                :columns="menuTypeList"
                value-key="menuTypeName"
                @confirm="onConfirm"
                @cancel="showPicker = false"
              />
            </van-popup>
            <div class="box">
              <div class="foodImg">
                <van-image :src="`${imgSrc}` " width="2rem" height="2rem">
                  <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                  </template>
                </van-image>
              </div>
              <div class="upDiv">
                {{labTex}}
                <input
                  ref="uploadInput"
                  type="file"
                  class="upinp"
                  name="file"
                  value
                  accept="image/gif, image/jpeg, image/jpg, image/png"
                  @change="selectImg($event)"
                />
              </div>
            </div>
            <van-field
              v-model="food.menuText"
              name="菜品描述"
              label="菜品描述"
              placeholder="菜品描述"
              :rules="[{ required: true, message: '请填写菜品描述' }]"
            />
          </van-form>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="editTypeShow">
      <div class="wrapper" @click.stop>
        <div class="addMenu">
          <van-form @submit="editType">
            <van-nav-bar
              title="编辑类别"
              class="formTop"
              left-text="取消"
              right-text="提交"
              @click-left="editTypeShow = false"
              @click-right="editType,editTypeShow = false"
            />
            <van-list :style="{width: '49%', display:'inline-block'}">
              <van-cell title="类名" />
              <van-field
                class="typeField"
                v-for="item in menuTypeList"
                :key="item.menuTypeId"
                v-model="item.menuTypeName"
                input-align="center"
                :style="{fontSize:'0.4rem'}"
                placeholder="请输入类名"
              />
            </van-list>
            <van-list :style="{width: '49%', display:'inline-block',fontSize:'0.1rem'}">
              <van-cell title="权重" />
              <van-field
                v-for="item in menuTypeList"
                :key="item.menuTypeId"
                v-model="item.menuTypeWeight"
                input-align="center"
                placeholder="请输入权重（0-99）"
                :style="{fontSize:'0.4rem'}"
              >
                <template #button>
                  <van-icon name="clear" @click="delMenuType(item.menuTypeId)" />
                </template>
              </van-field>
            </van-list>
          </van-form>
          <van-icon name="add" size="1rem" :style="{float:'right'}" @click="addType" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  getStoreByUser,
  getMenuList,
  addMenu,
  getMenuById,
  editMenu,
  delMenuById,
  getMenuTypeList,
  getMenuStringList,
  editMenuType,
  delMenuType,
} from "../../api/index";
import router from "../../router";
import { Toast } from "vant";
import { Dialog } from "vant";
import Cookies from "js-cookie";
export default {
  props: {
    value: {
      type: String,
      default: "",
    },
    labTex: {
      type: String,
      default: "菜品照片/小于1M",
    },
    imgDefault: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      active: 0,
      tabbarActive: 0,
      storeName: "",
      query: {
        storeId: 0,
        menuType: "",
      },
      food: {
        menuId: "", //主键id
        menuStoreId: "", //关联商家id
        menuName: "", //菜名
        menuPrice: 0, //价格
        menuImg: "", //图片
        menuFlavor: "1", //口味
        menuType: "0", //类型
        menuIsNice: "1", //招牌
        menuDiscount: 100, //折扣
        priceAfterDiscount: 0,
        menuText: "",
      },
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      show: false,
      editShow: false,
      dataUrl: "",
      defaultImg: "",
      operationShow: false,
      imgSrc: "",
      menuTypeList: [],
      value1: "",
      showPicker: false,
      active: 0,
      items: [],
      editTypeShow: false,
    };
  },
  created() {
    this.query.storeId = Cookies.get("storeId");
    getMenuTypeList(this.query).then((res) => {
      this.menuTypeList = res.data;
    });
    getMenuStringList(this.query).then((res) => {
      this.items = res.data;
      this.query.menuType = this.items[this.active].menuTypeId;
      getMenuList(this.query).then((res) => {
        this.list = res.data;
        console.log(this.list);
      });
    });
  },
  mounted() {
    getStoreByUser().then((res) => {
      if (res.data == null) {
        router.push("/store/创建商家");
      } else {
        this.query.storeId = res.data.storeId;
        this.food.menuStoreId = res.data.storeId;
        getMenuList(this.query).then((res) => {
          console.log(res);
          this.list = res.data;
        });
      }
    });
  },
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
    onConfirm(value) {
      this.food.menuTypeDes = value.menuTypeName;
      this.food.menuType = value.menuTypeId;
      this.showPicker = false;
    },
    //下拉刷新
    onLoad() {
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
    /**添加菜品 */
    addMenu() {
      if (this.imgSrc != "") {
        this.food.menuImg = this.imgSrc;
      } else {
        this.food.menuImg = "https://img.yzcdn.cn/vant/defult.jpeg";
      }
      console.log(this.food);
      addMenu(this.food).then((res) => {
        if (res.code == 1) {
          this.show = false;
          this.food.menuName = ""; //菜名
          this.food.menuPrice = ""; //价格
          this.food.menuImg = ""; //图片
          this.food.menuFlavor = "1"; //口味
          this.food.menuIsNice = "1"; //招牌
          this.food.menuDiscount = "100"; //折扣
          this.food.priceAfterDiscount = "0"; //折扣
          this.food.menuType = ""; //类型
          this.food.menuTypeDes = "";
          this.imgSrc = "";
          this.food.menuText = "";
          this.onRefresh();
        } else {
          Toast.fail(res.message);
        }
        console.log(res);
      });
      this.show = false;
    },
    /**上传图片 */
    selectImg(e) {
      const imgFile = e.target.files[0];
      if (imgFile) {
        this.operationShow = true;
        if (this.checkFile(imgFile)) {
          this.upload(imgFile);
        }
      }
    },
    checkFile(file) {
      //文件为空判断
      if (file === null || file === undefined) {
        alert("请选择您要上传的文件！");
        return false;
      } else {
        return true;
      }
      let size = Math.floor(file.size / 1024);
      // 这个条件还得改
      if (size != 0) {
        return true;
      } else {
        return false;
      }
    },
    upload(file) {
      try {
        let self = this;
        var result = "";
        //执行上传操作
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/back/file/uploadFile", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              let returnData = $.parseJSON(xhr.responseText);
              const imgSrcArr = returnData.url.split("local");
              console.log(imgSrcArr);
              self.imgSrc = "http://121.4.60.27:8080" + imgSrcArr[1];
              console.log(self.imgSrc);
              if (returnData.code == 1) {
                Toast.success("上传成功");
              } else {
                Toast.fail("上传失败SERVER");
              }
            } else {
              Toast.fail("上传失败");
            }
          }
        };
        //表单数据
        var fd = new FormData();
        fd.append("file", file);
        //执行发送
        result = xhr.send(fd);
      } catch (e) {
        console.log(e);
        alert(e);
      }
    },
    //**获取菜单 */
    getMenuById(menuId) {
      getMenuById(menuId).then((res) => {
        if (res.code == 1) {
          this.food.menuId = res.data.menuId; //主键id
          this.food.menuName = res.data.menuName; //菜名
          this.food.menuPrice = res.data.menuPrice; //价格
          this.food.menuImg = res.data.menuImg; //图片
          this.food.menuFlavor = res.data.menuFlavor + ""; //口味
          this.food.menuIsNice = res.data.menuIsNice + ""; //招牌
          this.food.menuDiscount = res.data.menuDiscount + ""; //折扣
          this.food.menuText = res.data.menuText;
          this.food.priceAfterDiscount = res.data.priceAfterDiscount; //折扣
          this.food.menuType = res.data.menuType;
          this.food.menuTypeDes = res.data.menuTypeDes;
          this.imgSrc = res.data.menuImg;
          this.food.menuImg = this.imgSrc;
          this.editShow = true;
        }
      });
    },
    /**编辑菜单 */
    editMenu() {
      this.food.menuImg = this.imgSrc;
      editMenu(this.food).then((res) => {
        if (res.code == 1) {
          this.food.menuId = "";
          this.food.menuName = ""; //菜名
          this.food.menuPrice = ""; //价格
          this.food.menuImg = ""; //图片
          this.food.menuFlavor = "1"; //口味
          this.food.menuIsNice = "1"; //招牌
          this.food.priceAfterDiscount = "0"; //折扣
          this.food.menuDiscount = "100"; //折扣
          this.food.menuType = "";
          this.food.menuTypeDes = "";
          this.food.menuText = "";
          this.imgSrc = "";
          Toast.success(res.message);
        } else {
          Toast.fail(res.message);
        }
        console.log(res);
        this.onRefresh();
      });
      this.editShow = false;
    },
    /**删除菜单 */
    delMenuById(menuId) {
      Dialog.confirm({
        title: "删除菜品",
        message: "请确认删除",
      })
        .then(() => {
          delMenuById(menuId).then((res) => {
            if (res.code == 1) {
              this.onRefresh();
              Toast.success(res.message);
            } else {
              this.onRefresh();
              Toast.fail(res.message);
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    /**计算折后价格 */
    editDiscount(e) {
      this.food.priceAfterDiscount =
        (this.food.menuPrice * this.food.menuDiscount) / 100;
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
    addMenuPannel() {
      this.food.menuId = "";
      this.food.menuName = ""; //菜名
      this.food.menuPrice = ""; //价格
      this.food.menuImg = ""; //图片
      this.food.menuFlavor = "1"; //口味
      this.food.menuIsNice = "1"; //招牌
      this.food.priceAfterDiscount = "0"; //折扣
      this.food.menuDiscount = "100"; //折扣
      this.food.menuType = "";
      this.food.menuTypeDes = "";
      this.imgSrc = "";
      this.food.menuText = "";
      this.show = true;
    },
    onSearch() {
      this.query.menuName = this.food.menuName;
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
    editType() {
      var index = 0;
      console.log(this.menuTypeList);
      this.menuTypeList.forEach((element) => {
        if (element.menuTypeName == "" || element.menuTypeWeight == "") {
          Toast.fail("请输入完整信息");
          index = 1;
        }
      });
      if (index == 0) {
        var object = {};
        object.array = this.menuTypeList;
        object.storeId = this.query.storeId;
        editMenuType(object).then((res) => {
          getMenuTypeList(this.query).then((res) => {
            this.menuTypeList = res.data;
          });
          getMenuStringList(this.query).then((res) => {
            this.items = res.data;
            this.query.menuType = this.items[this.active].menuTypeId;
            getMenuList(this.query).then((res) => {
              this.list = res.data;
              console.log(this.list);
            });
          });
        });
      }
    },
    addType() {
      this.menuTypeList.push({ menuTypeName: "", menuTypeWeight: "" });
    },
    delMenuType(menuTypeId) {
      delMenuType(menuTypeId).then((res) => {
        getMenuTypeList(this.query).then((res) => {
          this.menuTypeList = res.data;
        });
        getMenuStringList(this.query).then((res) => {
          this.items = res.data;
          this.query.menuType = this.items[this.active].menuTypeId;
          getMenuList(this.query).then((res) => {
            this.list = res.data;
            console.log(this.list);
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
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 0.213333rem 0.426667rem;
  color: #323233;
  font-size: 0.5rem;
  background-color: #fafafa;
}
.van-card__title {
  max-height: 1.853333rem;
  font-weight: 500;
  line-height: 0.926667rem;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.van-popup--center {
  width: 90%;
  height: 90%;
}
.addMenu {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.van-radio--horizontal {
  margin-right: 0.52rem;
  margin-bottom: 0.32rem;
}
.box {
  height: 2rem;
  margin-top: 0.5rem;
}

.upDiv {
  position: relative;
  height: 0.5rem;
  width: 100%;
  margin-bottom: 0.08rem;
  width: 5.5rem;
  text-align: center;
  z-index: 10;
  font-size: 0.6rem;
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  border-radius: 0.4rem;
  color: #fff;
  border: none;
  height: 1.2rem;
  line-height: 1.2rem;
  display: inline-block;
  background: #0097ffd9;
}
.operation-div {
  width: 15rem;
  height: 9.2rem;
}
.operation-div img {
  width: 100%;
  height: 100%;
}
.upDiv .upinp {
  position: absolute;
  left: 0px;
  right: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 1;
  opacity: 0;
}
.upDiv {
  position: absolute;
  height: 0.5rem;
  width: 100%;
  margin-bottom: 0.08rem;
  margin-left: -1rem;
  width: 4rem;
  text-align: center;
  z-index: 10;
  font-size: 0.4rem;
  padding: 0 0.2rem;
  border-radius: 0.2rem;
  border-radius: 0.4rem;
  color: #fff;
  border: none;
  height: 0.8rem;
  line-height: 0.8rem;
  display: inline-block;
  background: #0097ffd9;
}
.foodImg {
  position: absolute;
  width: 2rem;
  height: 2rem;
  margin-left: 0.5rem;
}
.foodImg > .van-image__img {
  display: block;
  width: 2rem;
  height: 2rem;
}

.addMenu .van-button {
  margin-top: 1rem;
}
.van-cell {
  font-size: 0.483333rem;
}
.menuList {
  margin-bottom: 1.333333rem;
  padding-left: 2rem;
}
.van-tree-select__nav {
  top: 4.2rem;
  position: fixed;
  z-index: 999;
}
.van-tree-select__content {
  -webkit-box-flex: 3;
  -webkit-flex: 3;
  flex: 3;
}
.upDiv .upinp[data-v-47984b77] {
  width: 100%;
}
</style>
