<template>
  <div>管理员的Home</div>
</template>

<script>
import {login} from '../api/index'
import { Toast } from 'vant';
import router from '../router';
export default {
  data() {
    return {
      
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
.loginForm{
  margin-top:1rem;
}
.formTop{
  margin-bottom: 1rem;
}
</style>
