
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
export const getStoreList = () => {
    return request({
        url: '/back/store/getStoreList',
        method: 'get'
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
export const getMenuTypeList = () => {
    return request({
        url: '/back/menu/getMenuTypeList',
        method: 'get',
    });
};


