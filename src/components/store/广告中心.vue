<template>
  <div class="background">
    <van-nav-bar title="广告管理" left-text="返回" @click-left="onClickLeft" class="formTop" />

    <div>
      <van-collapse v-model="activeNames">
        <van-collapse-item title="首页广告（最多可上传2张，图片大小请自行裁剪）" name="1">
          <van-uploader
            v-model="fileList"
            :after-read="afterRead"
            :before-delete="delImg"
            :max-count="2"
          />

          <van-button round block type="info" native-type="submit" @click="show = true,showImg()" :style="{ marginBottom: '1rem' }">预览</van-button>
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="editAdvertisement(0)"
          >提交</van-button>
        </van-collapse-item>
        <van-collapse-item title="顶部轮播（最多可上传3张，图片大小请自行裁剪）" name="2">
          <van-uploader
            v-model="fileList2"
            :after-read="afterRead2"
            :before-delete="delImg2"
            :max-count="3"
          />
          <van-button round block type="info" native-type="submit" @click="show2 = true,showImg()" :style="{ marginBottom: '1rem' }">预览</van-button>
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            @click="editAdvertisement2(1)"
          >提交</van-button>
        </van-collapse-item>
      </van-collapse>
    </div>
    <div>
      <!-- 图标位置 -->
      <van-popup
        v-model="show"
        closeable
        close-icon-position="top-right"
        position="bottom"
        :style="{ height: '90%' }"
      >
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in imgList" :key="index">
            <van-image width="100%" height="100%" :src="image" />
          </van-swipe-item>
        </van-swipe>
      </van-popup>
    </div>
    <div>
      <!-- 图标位置 -->
      <van-popup
        v-model="show2"
        closeable
        close-icon-position="top-right"
        position="bottom"
        lock-scroll
        :style="{ height: '90%' }"
      >
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in imgList2" :key="index">
            <van-image width="100%" height="100%" :src="image" />
          </van-swipe-item>
        </van-swipe>
      </van-popup>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import { editAdvertisement, getAdvertisement } from "../../api/index";
import { Dialog, Notify, Toast } from "vant";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      show: false,
      show2: false,
      store: {},
      active: 2,
      shopId: "",
      activeNames: ["1"],
      imgList: [],
      fileList: [],
      imgList2: [],
      fileList2: [],
      imgSrc: "",
      imgSrc2: "",
      query: {
        storeId: "",
      },
      request: {
        imgList2: [],
        storeId: "",
        type: "",
      },
    };
  },
  created() {
    this.store.storeId = Cookies.get("storeId");
    this.request.storeId = this.store.storeId;
    this.request.type = 0;
    getAdvertisement(this.request).then((res) => {
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
    console.log(this.fileList);
    console.log(this.fileList2);
  },
  mounted() {
    // 主要通知
    console.log(this.store);
  },
  methods: {
    onClickLeft() {
      this.$router.push({
        path: "/store/商家中心",
        query: {
          storeId: this.store.storeId,
        },
      });
    },

    afterRead(file) {
      file.status = "uploading";
      file.message = "上传中...";
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
              self.imgSrc = "http://121.4.60.27:8080" + imgSrcArr[1];
              self.imgList.push(self.imgSrc);
              console.log(self.imgList);
              if (returnData.code == 1) {
                // Toast.success("上传成功");
                file.status = "done";
                file.message = "上传成功";
              } else {
                // Toast.fail("上传失败SERVER");
                file.status = "failed ";
                file.message = "上传失败";
              }
            } else {
              // Toast.fail("上传失败");
              file.status = "failed ";
              file.message = "上传失败";
            }
          }
        };
        //表单数据
        var fd = new FormData();
        fd.append("file", file.file);
        //执行发送
        result = xhr.send(fd);
      } catch (e) {
        console.log(e);
        alert(e);
      }
    },
    afterRead2(file) {
      file.status = "uploading";
      file.message = "上传中...";
      try {
        let self = this;
        var result = "";
        //执行上传操作
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/back/file/uploadFile", true);
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              let returnData2 = $.parseJSON(xhr.responseText);
              const imgSrcArr2 = returnData2.url.split("local");
              self.imgSrc2 = "http://121.4.60.27:8080" + imgSrcArr2[1];
              self.imgList2.push(self.imgSrc2);
              if (returnData2.code == 1) {
                // Toast.success("上传成功");
                file.status = "done";
                file.message = "上传成功";
              } else {
                // Toast.fail("上传失败SERVER");
                file.status = "failed ";
                file.message = "上传失败";
              }
            } else {
              // Toast.fail("上传失败");
              file.status = "failed ";
              file.message = "上传失败";
            }
          }
        };
        //表单数据
        var fd = new FormData();
        fd.append("file", file.file);
        //执行发送
        result = xhr.send(fd);
      } catch (e) {
        console.log(e);
        alert(e);
      }
    },
    editAdvertisement(type) {
      console.log("editAdvertisement");
      this.request.type = type;
      this.request.storeId = this.store.storeId;
      this.request.imgList = this.imgList;
      console.log(this.request);
      editAdvertisement(this.request).then((res) => {
        if (res.code == 1) {
          Toast.success("提交成功");
        } else {
          Toast.success("提交失败");
        }
      });
    },
    editAdvertisement2(type) {
      console.log("editAdvertisement2");
      this.request.type = type;
      this.request.storeId = this.store.storeId;
      this.request.imgList2 = this.imgList2;
      this.request.imgList = this.imgList2;
      console.log(this.request);
      editAdvertisement(this.request).then((res) => {
        if (res.code == 1) {
          Toast.success("提交成功");
        } else {
          Toast.success("提交失败");
        }
      });
    },
    delImg(file, detail) {
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm({
            message: "确认删除图片？",
          })
          .then(() => {
            // 存放图片的数组
            console.log(detail);
            console.log(this.fileList[detail.index]);
            this.imgList.splice(detail.index, 1);
            this.$toast.success("删除成功");
            resolve();
          })
          .catch((error) => {
            this.$toast.fail("已取消");
            reject(error);
          });
      });
    },
    delImg2(file, detail) {
      return new Promise((resolve, reject) => {
        this.$dialog
          .confirm({
            message: "确认删除图片？",
          })
          .then(() => {
            // 存放图片的数组
            console.log(detail);
            console.log(this.fileList2[detail.index]);
            this.imgList2.splice(detail.index, 1);
            this.$toast.success("删除成功");
            resolve();
          })
          .catch((error) => {
            this.$toast.fail("已取消");
            reject(error);
          });
      });
    },
    showImg() {
      console.log(this.imgList);
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
.van-tabbar-item {
  color: rgba(51, 143, 230, 0.89);
  background-color: rgba(255, 255, 255, 0.89);
}
.van-tabbar-item--active {
  color: #ffffff;
  background-color: rgba(51, 143, 230, 0.89);
}
.background {
  height: 100vh;
  width: 100vw;
  background-image: url("../../assets/images/商家列表.jpg");
  z-index: 99;
  background-repeat: no-repeat;
  background-size: cover;
}
.grid {
  text-align: center;
  margin: 0 auto;
  font-weight: 800;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;

  background-color: #39a9ed;
}
.van-popup {
  background-image: linear-gradient(
    to bottom right,
    rgb(255, 255, 255),
    rgb(32, 90, 165)
  );
}
</style>
