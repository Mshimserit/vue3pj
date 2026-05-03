<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAddressListAPI, addAddressAPI, editAddressAPI, deleteAddressAPI } from '@/apis/order'
import { validatePhone } from '@/utils/validate'

const addressList = ref([])
const loading = ref(false)

const getAddressList = async () => {
  loading.value = true
  try {
    const res = await getAddressListAPI()
    addressList.value = res.data.result || []
  } catch (error) {
    console.error('获取地址列表失败:', error)
    addressList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => getAddressList())

const showDialog = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

const addressForm = ref({
  id: '',
  receiver: '',
  contact: '',
  fullLocation: '',
  address: '',
  isDefault: 0
})

const addressRules = {
  receiver: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度为2-20个字符', trigger: 'blur' }
  ],
  contact: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (validatePhone(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }, trigger: 'blur' }
  ],
  fullLocation: [
    { required: true, message: '请选择省市区', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, message: '详细地址至少5个字符', trigger: 'blur' }
  ]
}

const formRef = ref(null)

const handleAdd = () => {
  isEdit.value = false
  addressForm.value = {
    id: '',
    receiver: '',
    contact: '',
    fullLocation: '',
    address: '',
    isDefault: 0
  }
  showDialog.value = true
}

const handleEdit = (item) => {
  isEdit.value = true
  addressForm.value = {
    id: item.id,
    receiver: item.receiver,
    contact: item.contact,
    fullLocation: item.fullLocation,
    address: item.address,
    isDefault: item.isDefault
  }
  showDialog.value = true
}

const submitAddress = async () => {
  await formRef.value.validate()

  submitting.value = true
  try {
    if (isEdit.value) {
      await editAddressAPI(addressForm.value)
      ElMessage.success('地址修改成功')
    } else {
      await addAddressAPI(addressForm.value)
      ElMessage.success('地址添加成功')
    }
    showDialog.value = false
    getAddressList()
  } catch (error) {
    console.error('保存地址失败:', error)
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  try {
    await deleteAddressAPI(id)
    ElMessage.success('地址删除成功')
    getAddressList()
  } catch (error) {
    console.error('删除地址失败:', error)
  }
}
</script>

<template>
  <div class="user-address">
    <div class="header">
      <h3>收货地址</h3>
      <el-button type="primary" @click="handleAdd">添加地址</el-button>
    </div>

    <div class="address-list" v-loading="loading">
      <div v-if="addressList.length === 0" class="empty">
        <el-empty description="暂无收货地址" />
      </div>

      <div v-else class="address-card" v-for="item in addressList" :key="item.id">
        <div class="info">
          <span class="receiver">{{ item.receiver }}</span>
          <span class="contact">{{ item.contact }}</span>
          <span class="default" v-if="item.isDefault === 0">默认</span>
        </div>
        <p class="location">{{ item.fullLocation }} {{ item.address }}</p>
        <div class="actions">
          <a href="javascript:;" @click="handleEdit(item)">编辑</a>
          <el-popconfirm title="确定删除该地址吗？" confirm-button-text="确定" cancel-button-text="取消"
            @confirm="handleDelete(item.id)">
            <template #reference>
              <a href="javascript:;">删除</a>
            </template>
          </el-popconfirm>
        </div>
      </div>
    </div>

    <!-- 添加/编辑地址弹窗 -->
    <el-dialog v-model="showDialog" :title="isEdit ? '编辑收货地址' : '添加收货地址'" width="600px">
      <el-form :model="addressForm" :rules="addressRules" ref="formRef" label-width="80px">
        <el-form-item label="收货人" prop="receiver">
          <el-input v-model="addressForm.receiver" placeholder="请输入收货人姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="contact">
          <el-input v-model="addressForm.contact" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="所在地区" prop="fullLocation">
          <el-input v-model="addressForm.fullLocation" placeholder="请输入省市区，如：北京市朝阳区" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" type="textarea" placeholder="请输入详细地址，如街道名称、门牌号等" :rows="3" />
        </el-form-item>
        <el-form-item label="默认地址">
          <el-switch v-model="addressForm.isDefault" :active-value="0" :inactive-value="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submitAddress" :loading="submitting">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.user-address {
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f5f5f5;

    h3 {
      font-size: 18px;
      font-weight: normal;
    }
  }

  .address-list {
    .empty {
      min-height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .address-card {
      border: 1px solid #f5f5f5;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
      transition: all 0.3s;

      &:hover {
        border-color: $xtxColor;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .info {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 10px;

        .receiver {
          font-size: 16px;
          font-weight: bold;
        }

        .contact {
          color: #666;
        }

        .default {
          background: $xtxColor;
          color: #fff;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 2px;
        }
      }

      .location {
        color: #666;
        margin-bottom: 15px;
      }

      .actions {
        a {
          color: #666;
          margin-right: 20px;

          &:hover {
            color: $xtxColor;
          }
        }
      }
    }
  }
}
</style>