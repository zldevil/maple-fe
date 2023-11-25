<template>
  <div class="gantt-container">
    <el-row>
      <el-col :span="10">
        <el-table
          :data="tasks"
          stripe
          style="width: 100%"
          row-key="id"
          border
          lazy
          :load="load"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="name" width="160" label="任务名称" show-overflow-tooltip />
          <el-table-column prop="start" width="140" label="开始日期" show-overflow-tooltip />
          <el-table-column prop="end" width="140" label="结束日期" show-overflow-tooltip />
          <el-table-column prop="date" width="140" label="持续时间" show-overflow-tooltip />
          <el-table-column prop="task" width="80" label="完成" show-overflow-tooltip />
          <el-table-column label="Operations" width="300">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="10">
        <div class="gantt-target"></div>
      </el-col>
    </el-row>
    <el-button type="primary" @click="handleADD">新增</el-button>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import Gantt from 'frappe-gantt'
export default {
  setup() {
    const vueConfig = reactive({
      tasks: [
        // 表格数据
        {
          start: '2023-04-01 10:00:00',
          end: '2023-04-01 11:00:00',
          name: '测试任务1',
          id: '1',
          progress: 26,
          task: '50%',
          children: []
        },
        {
          start: '2023-04-01 10:00:00',
          end: '2023-04-01 10:10:00',
          name: '测试任务1',
          id: '2',
          progress: 26,
          task: '50%',
          children: []
        },
        {
          start: '2023-04-01 10:00:00',
          end: '2023-04-01 10:10:00',
          name: '测试任务1',
          id: '3',
          progress: 26,
          task: '50%',
          children: []
        }
      ],
      gantt: null,
      ganttData: null // 甘特图数据
    })
    let handleADD = () => {
      console.log('新增按钮点击')
      vueConfig.tasks.push({
        start: '2023-04-08',
        end: '2023-04-10',
        name: '测试任务6',
        id: '6',
        progress: 0,
        task: '50%',
        date: 3
        // dependencies: '2'
      })
      createG()
    }
    let handleEdit = (item) => {
      console.log('编辑按钮点击')
      vueConfig.tasks.forEach((element) => {
        if (element.id === item.id) {
          element.start = '2022-04-02'
          element.end = '2022-04-07'
          element.date = 5
          element.task = '60%'
        }
      })
      createG()
    }
    let handleAddChild = (index, item) => {
      console.log('添加子任务按钮点击')
      console.log(index, item)
      vueConfig.tasks.forEach((element) => {
        if (element.id === item.id) {
          element.children.push({
            start: '2022-04-01',
            end: '2022-04-08',
            name: '测试任务子任务1',
            id: '8',
            progress: 0,
            task: '50%',
            date: 3,
            dependencies: '1'
          })
        }
      })
      createG()
    }
    let handlemove = (index, item) => {
      console.log('上移一行按钮点击')
      const tempItem = vueConfig.tasks.splice(index, 1)
      vueConfig.tasks.splice(index - 1, 0, tempItem[0])
      createG()
    }

    let formatGantt = () => {
      console.log('执行formatGantt')
      let result = []
      let obj = {
        start: '',
        end: '',
        name: '',
        id: '',
        progress: 0,
        task: '',
        date: 0,
        children: []
      }
      vueConfig.tasks.forEach((element) => {
        if (element.children.length === 0) {
          console.log(element)
          result.push(element)
        } else {
          obj.start = element.start
          obj.end = element.end
          obj.name = element.name
          obj.id = element.id
          obj.progress = element.progress
          obj.task = element.task
          obj.date = element.date
          result.push(obj)
          result = result.concat(element.children)
        }
      })
      vueConfig.ganttData = result
    }
    let createG = () => {
      formatGantt()
      const gantt = new Gantt('.gantt-target', vueConfig.ganttData, {
        on_click: function (task) {
          console.log('双击操作', task)
        },
        on_date_change: function (task, start, end) {
          console.log(task, start, end)
        },
        on_progress_change: function (task, progress) {
          console.log(task, progress)
        },
        on_view_change: function (mode) {
          console.log(mode)
        },

        language: 'zh',
        header_height: 50,
        column_width: 30,
        step: 24,
        // view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
        bar_height: 20,
        bar_corner_radius: 5, // bar 的圆角度
        arrow_curve: 20, //连接子任务的线条曲线度
        padding: 18,
        view_mode: 'Quarter Day',
        date_format: 'YYYY-MM-DD hh-mm-ss', // 日期格式
        custom_popup_html: function (task) {
          return `
          <div class="details-container">
            <h5>${task.name}</h5>
            <p>Expected to finish by ${task.end}</p>
            <p>${task.progress}% completed!</p>
          </div>
          `
        }
      })
    }
    onMounted(() => {
      createG()
    })
    return {
      ...toRefs(vueConfig),
      handleADD,
      createG,
      handleEdit,
      handleAddChild,
      handlemove,
      formatGantt
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'frappe-gantt/dist/frappe-gantt.css';

.gantt-container {
  background-color: transparent;
  width: 100%;
  overflow: hidden;
  margin-left: -1px;
}

::v-deep .el-table .el-table__cell {
  height: 80px;
}

::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: rgb(245, 245, 245);
}

::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgb(245, 245, 245);
}

.gantt .bar {
  background-color: #007bff;
  height: 20px;
}

.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
