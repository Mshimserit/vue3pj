<template>
  <div v-if="isLoading" class="global-loading">
    <el-icon class="is-loading" :size="40">
      <Loading />
    </el-icon>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { Loading } from '@element-plus/icons-vue'
import { useGlobalLoading } from '@/composables/useGlobalLoading'

const { isLoading, message } = useGlobalLoading()
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.9);
  padding: 30px 50px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.global-loading p {
  margin-top: 15px;
  color: #666;
}
</style>