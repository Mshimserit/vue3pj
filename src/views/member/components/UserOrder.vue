<script setup>
import { getUserOrderAPI, cancelOrderAPI, deleteOrderAPI, confirmOrderAPI, logisticsOrderAPI } from '@/apis/order'
import { ref, onMounted } from 'vue'
import { UseVirtualList } from '@vueuse/components'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const tabTypes = [
  { name: "all", label: "全部订单" },
  { name: "unpay", label: "待付款" },
  { name: "deliver", label: "待发货" },
  { name: "receive", label: "待收货" },
  { name: "comment", label: "待评价" },
  { name: "complete", label: "已完成" },
  { name: "cancel", label: "已取消" }
]

const orderList = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref(false)

const params = ref({
  orderState: 0,
  page: 1,
  pageSize: 2
})

const getUserOrder = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await getUserOrderAPI(params.value)
    orderList.value = res.data.result?.items || []
    total.value = res.data.result?.counts || 0
  } catch (err) {
    console.error('获取订单失败:', err)
    error.value = true
    orderList.value = []
    total.value = 0
    if (err.code !== 'ECONNABORTED') {
      ElMessage.warning('暂无订单数据')
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => getUserOrder())

const tabChange = (type) => {
  params.value.orderState = type
  params.value.page = 1
  getUserOrder()
}

const pageChange = (page) => {
  params.value.page = page
  getUserOrder()
}

const fomartPayState = (payState) => {
  const stateMap = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    4: '待评价',
    5: '已完成',
    6: '已取消'
  }
  return stateMap[payState]
}

// 取消订单
const cancelReasonMap = {
  1: '不想要了',
  2: '信息填写错误',
  3: '重复下单',
  4: '其他原因'
}
const handleCancel = async (id) => {
  try {
    await cancelOrderAPI({ orderId: id, cancelReason: cancelReasonMap[1] })
    ElMessage.success('订单已取消')
    getUserOrder()
  } catch (error) {
    console.error('取消订单失败:', error)
  }
}

// 删除订单
const handleDelete = async (id) => {
  try {
    await deleteOrderAPI(id)
    ElMessage.success('订单已删除')
    getUserOrder()
  } catch (error) {
    console.error('删除订单失败:', error)
  }
}

// 确认收货
const handleConfirm = async (id) => {
  try {
    await confirmOrderAPI(id)
    ElMessage.success('确认收货成功')
    getUserOrder()
  } catch (error) {
    console.error('确认收货失败:', error)
  }
}

// 查看物流
const logisticsDialog = ref(false)
const logisticsList = ref([])
const handleLogistics = async (id) => {
  try {
    const res = await logisticsOrderAPI(id)
    logisticsList.value = res.data.result || []
    logisticsDialog.value = true
  } catch (error) {
    console.error('查询物流失败:', error)
    ElMessage.error('查询物流信息失败')
  }
}
</script>

<template>
  <div class="order-container">
    <el-tabs @tab-change="tabChange">
      <el-tab-pane v-for="item in tabTypes" :key="item.name" :label="item.label" />

      <div class="main-container">
        <div v-if="loading" class="holder-container">
          <el-empty description="加载中..." />
        </div>
        <div v-else-if="error" class="holder-container">
          <el-empty description="加载失败，请切换其他标签页重试">
            <el-button type="primary" @click="getUserOrder">重试</el-button>
          </el-empty>
        </div>
        <div class="holder-container" v-else-if="orderList.length === 0">
          <el-empty description="暂无订单数据" />
        </div>
        <div v-else>
          <UseVirtualList
            :list="orderList"
            :options="{ itemHeight: 200 }"
            :height="600"
          >
            <template #default="{ item }">
              <div v-if="item?.data" class="order-item" :key="item.data.id">
                <div class="head">
                  <span>下单时间：{{ item.data.createTime }}</span>
                  <span>订单编号：{{ item.data.id }}</span>
                  <span class="down-time" v-if="item.data.orderState === 1">
                    <i class="iconfont icon-down-time"></i>
                    <b>付款截止: {{ item.data.countdown }}</b>
                  </span>
                </div>
                <div class="body">
                  <div class="column goods">
                    <ul>
                      <li v-for="sku in item.data.skus" :key="sku.id">
                        <RouterLink class="image" :to="`/detail/${sku.id}`">
                          <img v-img-lazy="sku.image" alt="" />
                        </RouterLink>
                        <div class="info">
                          <p class="name ellipsis-2">
                            {{ sku.name }}
                          </p>
                          <p class="attr ellipsis">
                            <span>{{ sku.attrsText }}</span>
                          </p>
                        </div>
                        <div class="price">¥{{ sku.realPay?.toFixed(2) }}</div>
                        <div class="count">x{{ sku.quantity }}</div>
                      </li>
                    </ul>
                  </div>
                  <div class="column state">
                    <p>{{ fomartPayState(item.data.orderState) }}</p>
                    <p v-if="item.data.orderState === 3">
                      <a href="javascript:;" class="green" @click="handleLogistics(item.data.id)">查看物流</a>
                    </p>
                    <p v-if="item.data.orderState === 4">
                      <a href="javascript:;" class="green">评价商品</a>
                    </p>
                    <p v-if="item.data.orderState === 5">
                      <a href="javascript:;" class="green">查看评价</a>
                    </p>
                  </div>
                  <div class="column amount">
                    <p class="red">¥{{ item.data.payMoney?.toFixed(2) }}</p>
                    <p>（含运费：¥{{ item.data.postFee?.toFixed(2) }}）</p>
                    <p>在线支付</p>
                  </div>
                  <div class="column action">
                    <el-button v-if="item.data.orderState === 1" type="primary" size="small"
                      @click="router.push(`/pay?id=${item.data.id}`)">
                      立即付款
                    </el-button>
                    <el-button v-if="item.data.orderState === 3" type="primary" size="small"
                      @click="handleConfirm(item.data.id)">
                      确认收货
                    </el-button>
                    <p><a href="javascript:;">查看详情</a></p>
                    <p v-if="[2, 3, 4, 5].includes(item.data.orderState)">
                      <a href="javascript:;">再次购买</a>
                    </p>
                    <p v-if="[4, 5].includes(item.data.orderState)">
                      <a href="javascript:;">申请售后</a>
                    </p>
                    <p v-if="item.data.orderState === 1">
                      <el-popconfirm title="确定取消该订单吗？" confirm-button-text="确定" cancel-button-text="取消"
                        @confirm="handleCancel(item.data.id)">
                        <template #reference>
                          <a href="javascript:;">取消订单</a>
                        </template>
                      </el-popconfirm>
                    </p>
                    <p v-if="[5, 6].includes(item.data.orderState)">
                      <el-popconfirm title="确定删除该订单吗？" confirm-button-text="确定" cancel-button-text="取消"
                        @confirm="handleDelete(item.data.id)">
                        <template #reference>
                          <a href="javascript:;">删除订单</a>
                        </template>
                      </el-popconfirm>
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </UseVirtualList>
          <div class="pagination-container">
            <el-pagination :total="total" :page-size="params.pageSize" @current-change="pageChange" background
              layout="prev, pager, next" />
          </div>
        </div>
      </div>

    </el-tabs>

    <!-- 物流信息弹窗 -->
    <el-dialog v-model="logisticsDialog" title="物流信息" width="600px">
      <div v-if="logisticsList.length === 0" class="logistics-empty">
        <el-empty description="暂无物流信息" />
      </div>
      <ul v-else class="logistics-list">
        <li v-for="(item, index) in logisticsList" :key="index">
          <div class="logistics-item" :class="{ active: index === 0 }">
            <div class="time">{{ item.acceptTime }}</div>
            <div class="status">{{ item.status }}</div>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.order-container {
  padding: 10px 20px;

  .pagination-container {
    display: flex;
    justify-content: center;
  }

  .main-container {
    min-height: 500px;

    .holder-container {
      min-height: 500px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.order-item {
  margin-bottom: 20px;
  border: 1px solid #f5f5f5;

  .head {
    height: 50px;
    line-height: 50px;
    background: #f5f5f5;
    padding: 0 20px;
    overflow: hidden;

    span {
      margin-right: 20px;

      &.down-time {
        margin-right: 0;
        float: right;

        i {
          vertical-align: middle;
          margin-right: 3px;
        }

        b {
          vertical-align: middle;
          font-weight: normal;
        }
      }
    }

    .del {
      margin-right: 0;
      float: right;
      color: #999;
    }
  }

  .body {
    display: flex;
    align-items: stretch;

    .column {
      border-left: 1px solid #f5f5f5;
      text-align: center;
      padding: 20px;

      >p {
        padding-top: 10px;
      }

      &:first-child {
        border-left: none;
      }

      &.goods {
        flex: 1;
        padding: 0;
        align-self: center;

        ul {
          li {
            border-bottom: 1px solid #f5f5f5;
            padding: 10px;
            display: flex;

            &:last-child {
              border-bottom: none;
            }

            .image {
              width: 70px;
              height: 70px;
              border: 1px solid #f5f5f5;
            }

            .info {
              width: 220px;
              text-align: left;
              padding: 0 10px;

              p {
                margin-bottom: 5px;

                &.name {
                  height: 38px;
                }

                &.attr {
                  color: #999;
                  font-size: 12px;

                  span {
                    margin-right: 5px;
                  }
                }
              }
            }

            .price {
              width: 100px;
            }

            .count {
              width: 80px;
            }
          }
        }
      }

      &.state {
        width: 120px;

        .green {
          color: $xtxColor;
        }
      }

      &.amount {
        width: 200px;

        .red {
          color: $priceColor;
        }
      }

      &.action {
        width: 140px;

        a {
          display: block;

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }
}

.logistics-empty {
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logistics-list {
  max-height: 400px;
  overflow-y: auto;
}

.logistics-item {
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  &.active {
    color: $xtxColor;
  }

  .time {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
  }

  .status {
    font-size: 15px;
  }
}
</style>