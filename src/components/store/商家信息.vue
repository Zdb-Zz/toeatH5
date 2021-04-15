<template>
  <div>
    <van-nav-bar
      title="我的商家信息"
      left-text="返回"
      @click-left="onClickLeft"
      class="formTop"
      right-text="编辑"
      @click-right="isReadonly=false,isSubmitShow=true"
    />
    <van-form @submit="onSubmit">
      <van-field :disabled="isReadonly" v-model="store.storeName" label="商家名称" />
      <van-field :disabled="isReadonly" v-model="store.storeRemark" label="商家简介" />
      <van-field :disabled="isReadonly" v-model="store.storeAddress" label="商家地址" />
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
  </div>
</template>

<script>
import router from "../../router";
import { getStoreByUser, editStore } from "../../api/index";
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
      isReadonly: true,
      isSubmitShow: false,
      imgSrc: "",
    };
  },
  created() {
    getStoreByUser().then((res) => {
      this.store = res.data;
      this.imgSrc = res.data.storeImg;
    });
  },
  methods: {
    onClickLeft() {
      router.push("/store/商家中心");
    },
    onSubmit() {
      this.store.storeImg = this.imgSrc;
      editStore(this.store).then((res) => {
        this.isReadonly = true;
        this.isSubmitShow = false;
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
</style>
