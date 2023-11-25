<template>
  <div class="gantt-target"></div>
</template>

<script setup lang="ts">
// 在组件的 <script setup lang="ts"> 中
import { ref, onMounted } from 'vue'
import Gantt from 'frappe-gantt'

const tasks = ref([
  {
    start: '2023-04-01',
    end: '2023-04-08',
    name: '测试任务1',
    id: '1',
    progress: 26,
    task: '50%',
    date: 3,
    children: []
  },
  {
    start: '2023-04-04',
    end: '2023-04-08',
    name: '测试任务3',
    id: '3',
    progress: 0,
    task: '50%',
    date: 3,
    children: []
    // dependencies: '1'
  },
  {
    start: '2023-04-08',
    end: '2023-04-09',
    name: '测试任务4',
    id: '4',
    progress: 0,
    task: '50%',
    date: 3,
    children: []
    // dependencies: '2'
  },
  {
    start: '2023-04-08',
    end: '2023-04-10',
    name: '测试任务5',
    id: '5',
    progress: 50,
    task: '50%',
    date: 3,
    children: []
    // dependencies: '2'
  }

  // 添加其他任务...
])

let gantt: Gantt | null = null

onMounted(() => {
  gantt = new Gantt('.gantt-target', tasks.value, {
    // 配置选项...
  })
})
</script>

<style scoped>
@import 'frappe-gantt/dist/frappe-gantt.css';
</style>
