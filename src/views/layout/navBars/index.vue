<template>
  <div class="layout-navbars-container">
    <BreadcrumbIndex />
    <TagsView v-if="setShowTagsView" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useThemeConfig } from '@/store/themeConfig'
import BreadcrumbIndex from '@/views/layout/navBars/breadcrumb/index.vue'
import TagsView from '@/views/layout/navBars/tagsView/tagsView.vue'

const { layout, isTagsview } = useThemeConfig().themeConfig
const setShowTagsView = computed(() => layout !== 'classic' && isTagsview)
</script>

<style scoped lang="scss">
.layout-navbars-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
