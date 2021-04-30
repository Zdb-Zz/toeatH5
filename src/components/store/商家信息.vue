<template>
  <div class="background">
    <van-nav-bar
      title="我的商家信息"
      left-text="返回"
      @click-left="onClickLeft"
      class="formTop"
    />
    <van-form @submit="onSubmit">
      <van-field :readonly="isReadonly" v-model="store.storeName" label="商家名称" />
      <van-field :readonly="isReadonly" v-model="store.storeRemark" label="商家简介" />
      <van-field
        v-model="address"
        name="定位地址"
        label="定位地址"
        placeholder="定位地址"
        :readonly="isReadonly"
        :rules="[{ required: true, message: '定位地址' }]"
      >
        <template #button>
          <van-button size="small" type="primary" @click="show = true" native-type="button">获取定位</van-button>
        </template>
      </van-field>
      <van-field :readonly="isReadonly" v-model="store.storeAddress" label="商家详细地址" />
      <div class="box">
        <div class="foodImg">
          <van-image :src="`${imgSrc}` " width="2rem" height="2rem">
            <template v-slot:loading>
              <van-loading type="spinner" size="20" />
            </template>
          </van-image>
        </div>
        <div class="upDiv">
          修改图片
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
      <div style="margin: 16px;">
        <van-button v-if="isSubmitShow" round block type="info" native-type="submit">保存</van-button>
      </div>
    </van-form>
    <!-- 图标位置 -->
    <van-popup
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="content">
        <div class="amap-wrapper">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
          <el-amap
            class="amap-box"
            :zoom="zoom"
            :center="center"
            :events="events"
            :mapStyle="mapStyle"
          >
            <el-amap-marker v-for="(marker, i) in markers" :key="i" :position="marker"></el-amap-marker>
          </el-amap>
        </div>
        <div class="Y-font-size-20 Y-margin-vertical-top-8 positionText">
          <p>您选择的地址是：{{address}}</p>
          经纬度为：{{lng}} , {{lat}}
        </div>
        <div class="Y-text-align-right Y-avg-1">
          <van-button class="positionButton" type="primary" @click="getLnglat(),show=false">确 定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import router from "../../router";
import { getStoreByUser, editStore } from "../../api/index";
import { Toast } from 'vant';
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
      store: {},
      isReadonly: false,
      isSubmitShow: true,
      imgSrc: "",
      show: false,
      center: [120.165411, 30.32618], //地图中心点坐标
      zoom: 12, //初始化地图显示层级
      mapStyle: "amap://styles/8b6be8ec497009e17a708205348b899a", //设置地图样式
      markers: [[120.165411, 30.32618]],
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      address: "",
      lng: 120.165411,
      lat: 30.32618,
      events: {
        init: (o) => {},
        moveend: () => {},
        zoomchange: () => {},
        click: (e) => {
          var _this = this;
          let { lng, lat } = e.lnglat;
          this.center = [lng, lat];
          this.markers = [[lng, lat]];
          this.lng = lng;
          this.lat = lat;
          // 这里通过高德 SDK 完成。
          var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                _this.address = result.regeocode.formattedAddress;

              }
            }
          });
        },
      },
    };
  },
  created() {
    getStoreByUser().then((res) => {
      this.store = res.data;
      this.imgSrc = res.data.storeImg;
      this.address = res.data.storePosition
      this.lng = res.data.storeLng
      this.lat = res.data.storeLat
    });
  },
  methods: {
    onClickLeft() {
      router.push("/store/商家中心");
    },
    onSubmit() {
      this.store.storeImg = this.imgSrc;
      this.store.storeLng = this.lng;
      this.store.storeLat = this.lat
      this.store.storePosition = this.address
      editStore(this.store).then((res) => {
        this.isReadonly = false;
        this.isSubmitShow = true;
        Toast.success("保存成功")
      });
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
    addMarker: function () {
      this.markers = [];
      let lng = 120.165411 + Math.round(Math.random() * 1000) / 10000;
      let lat = 30.32618 + Math.round(Math.random() * 500) / 10000;
      this.markers = [[lng, lat]];

    },
    onSearchResult(pois) {
      let latSum = 0;
      let lngSum = 0;
      if (pois.length > 0) {
        let center = pois[0];
        this.lng = center.lng;
        this.lat = center.lat;
        this.address = center.name;
        this.center = [center.lng, center.lat];
        this.markers = [[center.lng, center.lat]];
      }
    },
    getLnglat() {
      this.$emit("getLnglat", this.lng, this.lat, this.address);
      this.store.storeLng = this.storeLng;
      this.store.storeLat = this.storeLat;
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
.upDiv .upinp[data-v-47984b77] {
  width: 100%;
}

.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/收藏.jpg");
  z-index: 99;
  background-repeat: no-repeat;
  background-size: cover;
}
.van-cell {
  background-color: rgba(0, 0, 0, 0);
}
.search-box {
  position: absolute;
  width: 100%;
}
.amap-wrapper {
  width: 100%;
  height: 10rem;
  position: relative;
}
.positionText {
  width: 80%;
  height: 3rem;
}
.positionButton {
  float: right;
  top: -3rem;
}
</style>
