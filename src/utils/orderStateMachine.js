/**
 * 订单状态机
 * 定义订单状态流转逻辑，确保状态变更的合法性和一致性
 */

// 订单状态枚举
export const OrderState = {
  UNPAID: 1,        // 待付款
  UNDELIVERED: 2,   // 待发货
  UNRECEIVED: 3,    // 待收货
  UNCOMMENTED: 4,   // 待评价
  COMPLETED: 5,     // 已完成
  CANCELLED: 6      // 已取消
}

// 状态中文映射
export const OrderStateText = {
  [OrderState.UNPAID]: '待付款',
  [OrderState.UNDELIVERED]: '待发货',
  [OrderState.UNRECEIVED]: '待收货',
  [OrderState.UNCOMMENTED]: '待评价',
  [OrderState.COMPLETED]: '已完成',
  [OrderState.CANCELLED]: '已取消'
}

// 状态流转规则：允许从当前状态流转到的下一个状态
export const StateTransitions = {
  [OrderState.UNPAID]: [
    OrderState.UNDELIVERED,  // 付款后 -> 待发货
    OrderState.CANCELLED     // 取消订单 -> 已取消
  ],
  [OrderState.UNDELIVERED]: [
    OrderState.UNRECEIVED    // 发货后 -> 待收货
  ],
  [OrderState.UNRECEIVED]: [
    OrderState.UNCOMMENTED,  // 确认收货后 -> 待评价
    OrderState.COMPLETED     // 系统自动完成
  ],
  [OrderState.UNCOMMENTED]: [
    OrderState.COMPLETED     // 评价后 -> 已完成
  ],
  [OrderState.COMPLETED]: [], // 已完成状态不允许流转
  [OrderState.CANCELLED]: []  // 已取消状态不允许流转
}

// 可操作的状态集合
export const CancelableStates = [OrderState.UNPAID]         // 可取消的订单状态
export const ConfirmableStates = [OrderState.UNRECEIVED]    // 可确认收货的订单状态
export const DeletableStates = [OrderState.COMPLETED, OrderState.CANCELLED] // 可删除的订单状态

/**
 * 验证状态流转是否合法
 * @param {number} currentState - 当前状态
 * @param {number} nextState - 目标状态
 * @returns {boolean} 是否允许流转
 */
export const canTransition = (currentState, nextState) => {
  const allowedTransitions = StateTransitions[currentState]
  return allowedTransitions?.includes(nextState) ?? false
}

/**
 * 获取状态对应的中文文本
 * @param {number} state - 订单状态
 * @returns {string} 状态文本
 */
export const getStateText = (state) => {
  return OrderStateText[state] || '未知状态'
}

/**
 * 判断订单是否可以取消
 * @param {number} state - 订单状态
 * @returns {boolean} 是否可取消
 */
export const canCancel = (state) => {
  return CancelableStates.includes(state)
}

/**
 * 判断订单是否可以确认收货
 * @param {number} state - 订单状态
 * @returns {boolean} 是否可确认收货
 */
export const canConfirm = (state) => {
  return ConfirmableStates.includes(state)
}

/**
 * 判断订单是否可以删除
 * @param {number} state - 订单状态
 * @returns {boolean} 是否可删除
 */
export const canDelete = (state) => {
  return DeletableStates.includes(state)
}
