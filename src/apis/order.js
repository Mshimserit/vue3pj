import httpInstance from "@/utils/http";

/* 获取我的订单数据
params: {
  orderState:0,
  page:1,
  pageSize:2
}
*/
export const getUserOrderAPI = (params) => {
  return httpInstance({
    url: '/member/order',
    params
  })
}


/**
 * 获取收货地址列表
 */
export const getAddressListAPI = () => {
  return httpInstance({
    url: '/member/address'
  })
}

/**
 * 添加收货地址
 * @param {Object} data - 地址表单数据
 */
export const addAddressAPI = (data) => {
  return httpInstance({
    url: '/member/address',
    method: 'POST',
    data
  })
}

/**
 * 修改收货地址
 * @param {Object} data - 地址表单数据（需包含 id）
 */
export const editAddressAPI = (data) => {
  return httpInstance({
    url: `/member/address/${data.id}`,
    method: 'PUT',
    data
  })
}

/**
 * 删除收货地址
 * @param {String} id - 地址 ID
 */
export const deleteAddressAPI = (id) => {
  return httpInstance({
    url: `/member/address/${id}`,
    method: 'DELETE'
  })
}


/**
 * 获取订单列表
 * @param {String} page - 页码
 * @param {String} pageSize - 每页条数
 * @param {String} orderState - 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @returns
 */
export const findOrderList = ({ page = 1, pageSize = 10, orderState = 0 }) => {
  return httpInstance('/member/order', 'get', { page, pageSize, orderState })
}

/**
 * 取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns
 */
export const cancelOrderAPI = ({ orderId, cancelReason }) => {
  return httpInstance({
    url: `/member/order/${orderId}/cancel`,
    method: 'PUT',
    params: { cancelReason }
  })
}

/**
 * 删除订单
 * @param {String} orderId - 订单ID
 * @returns
 */
export const deleteOrderAPI = (orderId) => {
  return httpInstance({
    url: `/member/order/${orderId}`,
    method: 'DELETE'
  })
}

/**
 * 确认收货
 * @param {String} orderId - 订单ID
 * @returns
 */
export const confirmOrderAPI = (orderId) => {
  return httpInstance({
    url: `/member/order/${orderId}/receipt`,
    method: 'PUT'
  })
}

/**
 * 查询物流
 * @param {String} orderId - 订单ID
 * @returns
 */
export const logisticsOrderAPI = (orderId) => {
  return httpInstance({
    url: `/member/order/${orderId}/logistics`,
    method: 'GET'
  })
}
