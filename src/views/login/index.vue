<template>
  <div class="login-container">
    <div class="login-logo">
      <span>{{ themeConfig.globalViceTitle }}</span>
    </div>
    <div class="login-content" :class="{ 'login-content-mobile': tabsActiveName === 'mobile' }">
      <div class="login-content-main">
        <h4 class="login-content-title"></h4>
        <el-tabs v-model="tabsActiveName" @tab-click="onTabsClick">
          <el-tab-pane label="账号密码登录" name="account" :disabled="tabsActiveName === 'account'">
            <transition name="el-zoom-in-center">
              <Account v-show="isTabPaneShow" ref="loginForm" />
            </transition>
          </el-tab-pane>
        </el-tabs>
        <div class="mt20" v-show="oauth2LoginConfig.enable">
          <el-button link size="small">第三方登录: </el-button>
          
        </div>
      </div>
    </div>
    <!-- <div class="login-copyright">
            <div class="mb5 login-copyright-company">arcana</div>
            <div class="login-copyright-msg">arcana</div>
        </div> -->
  </div>
</template>

<script lang="ts" setup>
import { toRefs, reactive, onMounted, ref } from 'vue'
import Account from '@/views/login/login.vue'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '@/store/themeConfig'

const { themeConfig } = storeToRefs(useThemeConfig())
const state = reactive({
  tabsActiveName: 'account',
  isTabPaneShow: true, 
  oauth2LoginConfig: {  
    name: 'OAuth2登录',
    enable: false
  }
})

const loginForm = ref<{ loginResDeal: (data: any) => void } | null>(null)

const { isTabPaneShow, tabsActiveName, oauth2LoginConfig: oauth2LoginConfig } = toRefs(state)

// 切换密码、手机登录
const onTabsClick = () => {
  state.isTabPaneShow = !state.isTabPaneShow
}

onMounted(async () => {
  //state.oauth2LoginConfig = await openApi.oauth2LoginConfig();
  state.oauth2LoginConfig.enable = false
})

</script>

<style scoped lang="scss">
.login-container {
  width: 100%;
  height: 100%;
  background: url('@/assets/image/bg-login.png') no-repeat;
  background-size: 100% 100%;

  .login-logo {
    position: absolute;
    top: 30px;
    left: 50%;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
    color: var(--color-primary);
    letter-spacing: 2px;
    width: 90%;
    transform: translateX(-50%);
  }

  .login-content {
    width: 500px;
    padding: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) translate3d(0, 0, 0);
    background-color: rgba(255, 255, 255, 0.99);
    box-shadow: 0 2px 12px 0 var(--color-primary-light-5);
    border-radius: 4px;
    transition: height 0.2s linear;
    height: 490px;
    overflow: hidden;
    z-index: 1;

    .login-content-main {
      margin: 0 auto;
      width: 80%;

      .login-content-title {
        color: #333;
        font-weight: 500;
        font-size: 22px;
        text-align: center;
        letter-spacing: 4px;
        margin: 15px 0 30px;
        white-space: nowrap;
      }
    }
  }

  .login-content-mobile {
    height: 418px;
  }

  .login-copyright {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 30px;
    text-align: center;
    color: white;
    font-size: 12px;
    opacity: 0.8;

    .login-copyright-company {
      white-space: nowrap;
    }

    .login-copyright-msg {
      @extend .login-copyright-company;
    }
  }
}
</style>
