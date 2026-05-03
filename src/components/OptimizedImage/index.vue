<template>
  <div class="optimized-image" :class="{ loaded: isLoaded }">
    <div class="placeholder" v-if="!isLoaded">
      <el-icon class="is-loading"><Loading /></el-icon>
    </div>
    <img
      :src="imageSrc"
      :alt="alt"
      :class="{ hidden: !isLoaded }"
      @load="onLoad"
      @error="onError"
    />
    <div class="error" v-if="hasError">
      <el-icon><Picture /></el-icon>
      <span>加载失败</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Loading, Picture } from '@element-plus/icons-vue'

const props = defineProps({
  src: String,
  alt: String,
  placeholder: String
})

const isLoaded = ref(false)
const hasError = ref(false)
const imageSrc = computed(() => props.src || props.placeholder)

const onLoad = () => {
  isLoaded.value = true
}

const onError = () => {
  hasError.value = true
}
</script>

<style scoped>
.optimized-image {
  position: relative;
  overflow: hidden;
}

.placeholder, .error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
}

img {
  transition: opacity 0.3s;
}

img.hidden {
  opacity: 0;
}
</style>