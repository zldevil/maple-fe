<template>
  <el-header class="layout-header" :height="setHeaderHeight">
    <NavBarsIndex />
  </el-header>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import NavBarsIndex from '@/views/layout/navBars/index.vue'
import { useThemeConfig } from '@/store/themeConfig'
// 设置 header 的高度
const { isTagsview, layout } = useThemeConfig().themeConfig
const setHeaderHeight = computed(() => (isTagsview && layout !== 'classic' ? '84px' : '50px'))
</script>
