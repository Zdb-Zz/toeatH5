import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import adminHome from '../components/home.vue'
import createStroe from '../components/store/创建商家.vue'
import upload from '../components/store/upload.vue'
import storeMenu from '../components/store/菜单.vue'
import storeList from '../components/custmer/商家列表.vue'
import mine from '../components/custmer/我的.vue'
import register from '@/components/register'
import storeCenter from '@/components/store/商家中心.vue'
import storeData from '@/components/store/商家信息.vue'
import chart from '@/components/store/统计.vue'
import toMenu from '@/components/custmer/菜单'
import personalDate from '@/components/custmer/个人信息'
import mineOrder from '@/components/custmer/我的订单'
import storeOrder from '@/components/store/订单管理'
import mineCollect from '@/components/custmer/我的收藏'
import orderSubmit from '@/components/custmer/订单提交页'
import orderDetail from '@/components/custmer/订单详情页'
import orderDetailStore from '@/components/store/订单详情页'
import orderPay from '@/components/custmer/订单支付页'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/admin/home',
      name: 'adminHome',
      component: adminHome
    },
    {
      path: '/store/菜单',
      name: 'storeHome',
      component: storeMenu
    },
    {
      path: '/store/创建商家',
      name: '创建商家',
      component: createStroe
    },
    {
      path: '/custmer/商家列表',
      name: '商家列表',
      component: storeList
    },
    {
      path: '/custmer/我的',
      name: '我的',
      component: mine
    },
    {
      path: '/store/upload',
      name: 'upload',
      component: upload
    },
    {
      path: '/store/商家中心',
      name: '商家中心',
      component: storeCenter
    },
    {
      path: '/store/统计',
      name: '统计',
      component: chart
    },
    {
      path: '/custmer/菜单',
      name: '菜单',
      component: toMenu,
      meta:{
        keepAlive:true
      }
    },
    {
      path: '/custmer/个人信息',
      name: '个人信息',
      component: personalDate,
    },
    {
      path: '/custmer/我的订单',
      name: '我的订单',
      component: mineOrder,
    },
    {
      path: '/custmer/我的收藏',
      name: '我的收藏',
      component: mineCollect,
    },
    {
      path: '/custmer/订单提交页',
      name: '订单提交',
      component: orderSubmit,
    },
    {
      path: '/custmer/订单详情页',
      name: '订单详情',
      component: orderDetail,
    },
    {
      path: '/store/订单详情页',
      name: '订单详情',
      component: orderDetailStore,
    },
    {
      path: '/custmer/订单支付页',
      name: '订单支付',
      component: orderPay,
    },
    {
      path: '/store/商家信息',
      name: '商家信息',
      component: storeData,
    },
    {
      path: '/store/订单管理',
      name: '订单管理',
      component: storeOrder,
    },
    
  ]
})
