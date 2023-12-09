<template>
  <div class="layout-scrollbar">
    <div class="layout-view-bg-white flex h100" v-loading="iframeLoading">
      <iframe
        :src="state.iframeUrl"
        frameborder="0"
        height="100%"
        width="100%"
        id="iframe"
        v-show="!state.iframeLoading"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  onMounted,
  onBeforeMount,
  onUnmounted,
  nextTick,
  defineProps,
  defineEmits
} from 'vue'
import { useRoute } from 'vue-router'
import mittBus from '@/common/utils/mitt'

const props = defineProps(['meta'])
const emit = defineEmits()

const route = useRoute()
const state = reactive({
  iframeLoading: true,
  iframeUrl: ''
})

// 初始化页面加载 loading
const initIframeLoad = () => {
  nextTick(() => {
    state.iframeLoading = true
    const iframe = document.getElementById('iframe')
    if (!iframe) return false
    iframe.onload = () => {
      state.iframeLoading = false
    }
  })
}

// 页面加载前
onBeforeMount(() => {
  state.iframeUrl = props.meta.link
  mittBus.on('onTagsViewRefreshRouterView', (path: string) => {
    if (route.path !== path) return false
    emit('getCurrentRouteMeta')
  })
})

// 页面加载时
onMounted(() => {
  initIframeLoad()
})

// 页面卸载时
onUnmounted(() => {
  mittBus.off('onTagsViewRefreshRouterView', () => {})
})
</script>
