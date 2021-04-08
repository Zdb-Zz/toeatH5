
import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: '/user/getUserList',
        method: 'get',
        params: query
    });
};

export const updateData = form => {
    return request({
        url: '/user/updateUser',
        method: 'post',
        data: form
    });
};
/**
 * 获取商家列表
 */
export const getStoreList = query => {
    return request({
        url: '/back/store/getStoreList',
        method: 'get',
        params:query
    });
};
/**
 * 登录
 * @param {userName,userPassWord} query 
 */
export const login = query => {
    return request({
        url: '/back/user/login',
        method: 'post',
        data:query
    });
};
/**
 * 注册
 * @param {*} query 
 */
export const register = query => {
    return request({
        url: '/back/user/register',
        method: 'post',
        data:query
    });
};

/**
 * 根据用户id获取商家信息
 */
export const getStoreByUser = () => {
    return request({
        url: '/back/user/getStoreByUser',
        method: 'get'
    });
};
/**
 * 创建商家
 */
export const createStore = query => {
    return request({
        url: '/back/store/addStore',
        method: 'post',
        data:query
    });
};

/**
 * 创建商家
 */
export const editStore = query => {
    return request({
        url: '/back/store/editStore',
        method: 'post',
        data:query
    });
};

/**
 * 获取菜品列表
 * @param  query 
 */
export const getMenuList = query => {
    return request({
        url: '/back/menu/getMenuList',
        method: 'get',
        params: query
    });
};

export const getMenuStringList = query => {
    return request({
        url: '/back/menu/getMenuStringList',
        method: 'get',
        params: query
    });
};


/**
 * 上传图片
 * @param param 
 */
export const uploadFile = param => {
    return request({
        url: '/back/file/uploadFile',
        method: 'post',
        params: param,
        headers:{"Content-Type": "multipart/form-data"},
    });
};

/**
 * 添加菜品
 */
export const addMenu = query => {
    return request({
        url: '/back/menu/addMenu',
        method: 'post',
        data:query
    });
};

/**
 * 编辑菜品
 */
export const editMenu = query => {
    return request({
        url: '/back/menu/editMenu',
        method: 'post',
        data:query
    });
};

/**
 * 根据id获取菜品详情
 * @param  menuId 
 */
export const getMenuById = menuId => {
    return request({
        url: '/back/menu/getMenuById',
        method: 'get',
        params: {menuId}
    });
};
/**
 * 根据id删除菜品
 * @param  menuId 
 */
export const delMenuById = menuId => {
    return request({
        url: '/back/menu/delMenuById',
        method: 'get',
        params: {menuId}
    });
};

/**
 * 获取菜品类型
 */
export const getMenuTypeList = query => {
    return request({
        url: '/back/menu/getMenuTypeList',
        method: 'get',
        params:query
    });
};

/**
 * 消费者列表/购物车添加数量
 */
export const addMenuNum = (menuId) => {
    return request({
        url: '/back/menu/addMenuNum',
        method: 'get',
        params: {menuId}
    });
};

/**
 * 消费者列表/购物车添加数量
 */
export const subMenuNum = (menuId) => {
    return request({
        url: '/back/menu/subMenuNum',
        method: 'get',
        params: {menuId}
    });
};

/**
 * 消费者列表/购物车添加数量
 */
export const getTotalPrice = () => {
    return request({
        url: '/back/menu/getTotalPrice',
        method: 'get'
    });
};

/**
 * 消费者列表/购物车添加数量
 */
export const getShopCarList = () => {
    return request({
        url: '/back/menu/getShopCarList',
        method: 'get'
    });
};

/**
 * 清空购物车
 */
export const cleanShopCar = (storeId) => {
    return request({
        url: '/back/menu/cleanShopCar',
        method: 'get',
        params:{storeId}
    });
};

/**
 * 收藏菜品
 */
export const collectMenu = (menuId) => {
    return request({
        url: '/back/menu/collectMenu',
        method: 'get',
        params:{menuId}
    });
};
/**
 * 取消收藏菜品
 */
export const unCollectMenu = (menuId) => {
    return request({
        url: '/back/menu/unCollectMenu',
        method: 'get',
        params:{menuId}
    });
};
/**
 * 获取推荐列表
 */
export const getRecommendList = (storeId) => {
    return request({
        url: '/back/menu/getRecommendList',
        method: 'get',
        params:{storeId}
    });
};

/**
 * 获取用户信息
 */
export const findUser = () => {
    return request({
        url: '/back/user/findUser',
        method: 'get',
    });
};
/**
 * 获取用户信息
 */
export const editUser = query => {
    return request({
        url: '/back/user/editUser',
        method: "post",
        data:query
    });
};
/**
 * 获取用户收藏列表
 */
export const getCollectList = () => {
    return request({
        url: '/back/menu/getCollectList',
        method: "get",
    });
};

/**
 * 获取用户收藏列表
 */
export const submitOrder = query => {
    return request({
        url: '/back/order/submitOrder',
        method: "post",
        data:query
    });
};

/**
 * 获取订单列表
 */
export const getOrders = query => {
    return request({
        url: '/back/order/getOrders',
        method: "get",
        params:query
    });
};
/**
 * 获取订单列表
 */
export const getStoreOrders = query => {
    return request({
        url: '/back/order/getStoreOrders',
        method: "get",
        params:query
    });
};
/**
 * 获取订单详情
 */
export const getOrderById = (orderId) => {
    return request({
        url: '/back/order/getOrderById',
        method: "get",
        params:{orderId}
    });
};

/**
 * 评价订单
 */
export const evaluateOrder =query => {
    return request({
        url: '/back/order/evaluateOrder',
        method: "post",
        data:query
    });
};

/**
 * 修改类别
 */
export const editMenuType = query => {
    return request({
        url: '/back/menu/editMenuType',
        method: "post",
        data:query
    });
};

/**
 * 删除菜品类型
 */
export const delMenuType = (menuTypeId) => {
    return request({
        url: '/back/menu/delMenuType',
        method: "get",
        params:{menuTypeId}
    });
};

/**
 * 删除菜品类型
 */
export const payOrder = (orderId) => {
    return request({
        url: '/back/order/payOrder',
        method: "get",
        params:{orderId}
    });
};
/**
 * 获取今日营业状况
 */
export const todayBusiness = (storeId) => {
    return request({
        url: '/back/statistics/todayBusiness',
        method: "get",
        params:{storeId}
    });
};
/**
 * 获取销量排行
 */
export const getSalesRank = query => {
    return request({
        url: '/back/statistics/salesRank',
        method: "get",
        params:query
    });
};

/**
 * 获取销量排行
 */
export const salesRankByTime = query => {
    return request({
        url: '/back/statistics/salesRankByTime',
        method: "get",
        params:query
    });
};
/**
 * 获取销量排行
 */
export const totalBusiness = query => {
    return request({
        url: '/back/statistics/totalBusiness',
        method: "get",
        params:query
    });
};


 export const sendAllWebSocket = (storeId) => {
    return request({
        url: '/back/store/sendAllWebSocket',
        method: "get",
        params:{storeId}
    });
};

 export const completeMenu = (orderMenuId) => {
    return request({
        url: '/back/order/completeMenu',
        method: "get",
        params:{orderMenuId}
    });
};
