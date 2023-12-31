<template>
  <div>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      :before-close="cancel"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="38%"
    >
      <el-form :model="form" ref="dbForm" :rules="rules" label-width="auto">
        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="基础信息" name="basic">
            <el-form-item prop="tagId" label="标签:" required>
              <tag-select
                v-model="form.tagId"
                v-model:tag-path="form.tagPath"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item prop="name" label="别名:" required>
              <el-input
                v-model.trim="form.name"
                placeholder="请输入数据库别名"
                auto-complete="off"
              ></el-input>
            </el-form-item>
            <el-form-item prop="type" label="类型:" required>
              <el-select style="width: 100%" v-model="form.type" placeholder="请选择数据库类型">
                <el-option key="item.id" label="mysql" value="mysql"> </el-option>
                <el-option key="item.id" label="postgres" value="postgres"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="host" label="host:" required>
              <el-col :span="18">
                <el-input
                  :disabled="form.id !== undefined"
                  v-model.trim="form.host"
                  placeholder="输入主机ip:port"
                  auto-complete="off"
                ></el-input>
              </el-col>
              <el-col style="text-align: center" :span="1">:</el-col>
            </el-form-item>
            <el-form-item prop="username" label="用户名:" required>
              <el-input v-model.trim="form.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码:">
              <el-input
                type="password"
                show-password
                v-model.trim="form.password"
                placeholder="请输入密码，修改操作可不填"
                autocomplete="new-password"
              >
                <template v-if="form.id && form.id != 0" #suffix>
                  <el-popover
                    @hide="pwd = ''"
                    placement="right"
                    title="原密码"
                    :width="200"
                    trigger="click"
                    :content="pwd"
                  >
                    <template #reference>
                      <el-link @click="getDbPwd" :underline="false" type="primary" class="mr5"
                        >原密码
                      </el-link>
                    </template>
                  </el-popover>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item prop="remark" label="备注:">
              <el-input v-model.trim="form.remark" auto-complete="off" type="textarea"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="其他配置" name="other"> </el-tab-pane>
        </el-tabs>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" :loading="btnLoading" @click="btnOk">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, watch, ref } from 'vue'
import { dbApi } from '@/common/rdsApi'
import { ElMessage } from 'element-plus'
import { notBlank } from '@/common/assert'
import { RsaEncrypt } from '@/common/rsa'
import TagSelect from '../component/TagSelect.vue'

const props = defineProps({
  visible: {
    type: Boolean
  },
  db: {
    type: [Boolean, Object]
  },
  title: {
    type: String
  }
})

//定义事件
const emit = defineEmits(['update:visible', 'cancel', 'val-change'])

const rules = {
  tagId: [
    {
      required: true,
      message: '请选择标签',
      trigger: ['change', 'blur']
    }
  ],
  name: [
    {
      required: true,
      message: '请输入别名',
      trigger: ['change', 'blur']
    }
  ],
  type: [
    {
      required: true,
      message: '请选择数据库类型',
      trigger: ['change', 'blur']
    }
  ],
  host: [
    {
      required: true,
      message: '请输入主机ip和port',
      trigger: ['change', 'blur']
    }
  ],
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: ['change', 'blur']
    }
  ],
  database: [
    {
      required: true,
      message: '请添加数据库',
      trigger: ['change', 'blur']
    }
  ]
}

const dbForm: any = ref(null)

const state = reactive({
  dialogVisible: false,
  tabActiveName: 'basic',
  allDatabases: [] as any,
  databaseList: [] as any,
  form: {
    id: null,
    tagId: null as any,
    tagPath: null as any,
    type: null,
    name: null,
    host: '',
    port: 3306,
    username: null,
    password: null,
    params: null,
    database: '',
    remark: '',
    sshTunnelMachineId: null as any
  },
  // 原密码
  pwd: '',
  btnLoading: false
})

const { dialogVisible, tabActiveName, form, pwd, btnLoading } = toRefs(state)

watch(props, (newValue: any) => {
  state.dialogVisible = newValue.visible
  if (!state.dialogVisible) {
    return
  }
  state.tabActiveName = 'basic'
  if (newValue.db) {
    state.form = { ...newValue.db }
    // 将数据库名使用空格切割，获取所有数据库列表
    state.databaseList = newValue.db.database.split(' ')
  } else {
    state.form = { port: 3306 } as any
    state.databaseList = []
  }
})

const getDbPwd = async () => {
  state.pwd = await dbApi.getDbPwd.request({ id: state.form.id })
}

const btnOk = async () => {
  if (!state.form.id) {
    notBlank(state.form.password, '新增操作，密码不可为空')
  }
  dbForm.value.validate(async (valid: boolean) => {
    if (valid) {
      const reqForm = { ...state.form }
      reqForm.password = await RsaEncrypt(reqForm.password)
      if (!state.form.sshTunnelMachineId) {
        reqForm.sshTunnelMachineId = -1
      }
      dbApi.saveDb.request(reqForm).then(() => {
        ElMessage.success('保存成功')
        emit('val-change', state.form)
        state.btnLoading = true
        setTimeout(() => {
          state.btnLoading = false
        }, 1000)

        cancel()
      })
    } else {
      ElMessage.error('请正确填写信息')
      return false
    }
  })
}

const resetInputDb = () => {
  state.databaseList = []
  state.allDatabases = []
}

const cancel = () => {
  emit('update:visible', false)
  emit('cancel')
  setTimeout(() => {
    resetInputDb()
  }, 500)
}
</script>
<style lang="scss"></style>
