<template>
  <div>
    <van-nav-bar title="我的订单" left-text="返回" @click-left="onClickLeft" class="formTop" />
    
   
  </div>
</template>

<script>
import router from "../../router";
export default {
  data() {
    return {
     
    };
  },
  methods: {
    onClickLeft(){
      router.push("/custmer/我的")
    }
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
</style>
