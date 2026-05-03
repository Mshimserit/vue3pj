<script setup>
import { getBannerAPI } from '@/apis/home'
import { ref, onMounted } from 'vue'

const bannerList = ref([])
const loading = ref(true)

const getBanner = async () => {
  try {
    const res = await getBannerAPI()
    bannerList.value = res.data.result || []
  } catch (error) {
    console.error('获取轮播图失败:', error)
    bannerList.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => getBanner())
</script>


<template>
  <div class="home-banner">
    <div v-if="loading" class="skeleton-container">
      <Skeleton height="500px" />
    </div>
    <el-carousel v-else height="500px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img v-img-lazy="item.imgUrl" alt="">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>


<style scoped lang='scss'>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;

  img {
    width: 100%;
    height: 500px;
  }
}
</style>