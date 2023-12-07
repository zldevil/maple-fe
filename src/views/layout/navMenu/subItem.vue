<template>
  <template v-for="val in chils">
    <el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
      <template #title>
        <SvgIcon :name="val.meta.icon" />
        <span>{{ val.meta.title }}</span>
      </template>
      <sub-item :chil="val.children" />
    </el-sub-menu>
    <el-menu-item :index="val.path" :key="val?.path" v-else>
      <template v-if="!val.meta.link || (val.meta.link && val.meta.linkType == 1)">
        <SvgIcon :name="val.meta.icon" />
        <span>{{ val.meta.title }}</span>
      </template>
      <template v-else>
        <a :href="val.meta.link" target="_blank">
          <SvgIcon :name="val.meta.icon" />
          {{ val.meta.title }}
        </a>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import SvgIcon from '@/components/svgIcon/index.vue'

// 获取父级菜单数据
const props = defineProps(['chil'])
const chils = computed(() => props.chil as any)
</script>
