<template>
 <div class="box">
 <div class="upDiv">
  {{labTex}} 
  <input ref="uploadInput"
    type="file"
    class='upinp'
    name="file"
    value=""
    accept="image/gif,image/jpeg,image/jpg,image/png"
    @change="selectImg($event)"/>
 </div>
 </div>
</template>
<script>
import 'jquery'
export default {
 props: {
  value:{
   type:String ,
   default:''
  },
  labTex:{
   type:String ,
   default:'菜品照片'
  },
  imgDefault:{
   type:String ,
   default:''
  }
 },
 data() {
  return {
   dataUrl: '',
   defaultImg:'',
   operationShow:false
  }
 },
 mounted() {
  
 },
 // input的change回调第一个参数是event对象
 methods: {
  selectImg(e){
   const imgFile = e.target.files[0];
   if (imgFile)
   { 
    this.operationShow=true
    if(this.checkFile(imgFile)){
     this.upload(imgFile);
    }
   }
  
  },
  checkFile(file){
   //文件为空判断
   if (file === null || file === undefined) {
    alert("请选择您要上传的文件！");
    return false;
   }else{
    return true;
   }
   let size = Math.floor(file.size / 1024);
   // 这个条件还得改
   if (size!=0) {
    return true;
   }else{
    return false
   }
  },
  upload(file){
    try {
    let self = this;
    var result='';
    //执行上传操作
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/back/file/uploadFile", true);
    xhr.onreadystatechange = function () {
     if (xhr.readyState == 4) {
      if (xhr.status == 200) {
       let returnData = $.parseJSON(xhr.responseText);
       console.log(returnData)
       
       if (returnData.code == 1) {
        alert("上传成功")
        //显示图片地址
        self.$emit('change-img',returnData.name);
        self.defaultImg = returnData.url;
       } else {
        alert("上传失败SERVER")
       }
      } else {
       alert("上传失败")
      }
     };
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
  }
 }
}
</script>
<style>
.box {
 height: 11rem;
 margin-top: 0.5rem;
}
.upDiv{
 position:relative;
 height:1.2rem;
 width:100%;
 margin-bottom:0.08rem;
 width:5.5rem;
 text-align: center;
 z-index:10;
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
.operation-div{
 width: 15rem;
 height: 9.2rem;
}
.operation-div img{
 width:100%;
 height:100%;
}
.upDiv .upinp{
 position:absolute;
 left:0px;
 right:0px;
 right:0px;
 bottom:0px;
 z-index:1;
 opacity:0;
}
.shoImg{
 width:15rem;
 border-radius:0.05rem
}
</style>