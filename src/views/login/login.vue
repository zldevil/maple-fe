<template>
    <div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" class="login-content-form" size="large">
            <el-form-item prop="username">
                <el-input type="text" placeholder="请输入用户名" prefix-icon="user" v-model="loginForm.username" clearable
                    autocomplete="off"> </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码" prefix-icon="lock" v-model="loginForm.password"
                    autocomplete="off" @keyup.enter="login" show-password>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="login-content-submit" round @click="login" :loading="loading.signIn">
                    <span>登 录</span>
                </el-button>
            </el-form-item>
        </el-form>

        <el-dialog title="修改密码" v-model="changePwdDialog.visible" :close-on-click-modal="false" width="450px"
            :destroy-on-close="true">
            <el-form :model="changePwdDialog.form" :rules="changePwdDialog.rules" ref="changePwdFormRef" label-width="auto">
                <el-form-item prop="username" label="用户名" required>
                    <el-input v-model.trim="changePwdDialog.form.username" disabled></el-input>
                </el-form-item>
                <el-form-item prop="oldPassword" label="旧密码" required>
                    <el-input v-model.trim="changePwdDialog.form.oldPassword" autocomplete="new-password"
                        type="password"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="新密码" required>
                    <el-input v-model.trim="changePwdDialog.form.newPassword" placeholder="须为8位以上且包含字⺟⼤⼩写+数字+特殊符号"
                        type="password" autocomplete="new-password"></el-input>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="cancelChangePwd">取 消</el-button>
                    <el-button @click="changePwd" type="primary" :loading="loading.changePwd">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template> 

<script lang="ts" setup>
import { nextTick, onMounted, ref, toRefs, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { initRouter } from '@/router/index';
import { getSession, setSession, setUserInfo2Session, setUseWatermark2Session } from '@/common/utils/storage';
import { formatAxis } from '@/common/utils/format';
import openApi from '@/common/openApi';
import { RsaEncrypt } from '@/common/rsa';
import { getSecurity, useWartermark } from '@/common/sysconfig';
import { letterAvatar } from '@/common/utils/string';
import { useUserInfo } from '@/store/userInfo';
import { AccountUsernamePattern } from '@/common/pattern';

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

// 把any给我替换了
const route = useRoute();
const router = useRouter();
const loginFormRef: any = ref(null);
const changePwdFormRef: any = ref(null);

const state = reactive({
    Security: {
        loginFailCount: 5,
        loginFailMin: 10,
    },
    showLoginFailTips: false,
    captchaImage: '',
    loginForm: {
        username: '',
        password: '',
        captcha: '',
        cid: '',
        ldapLogin: false,
    },
    loginRes: {} as any,
    changePwdDialog: {
        visible: false,
        form: {
            username: '',
            oldPassword: '',
            newPassword: '',
        },
        rules: {
            newPassword: [
                { required: true, message: '请输入新密码', trigger: 'blur' },
                {
                    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]])[A-Za-z\d`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]]{8,}$/,
                    message: '须为8位以上且包含字⺟⼤⼩写+数字+特殊符号',
                    trigger: 'blur',
                },
            ],
        },
    },
    otpDialog: {
        visible: false,
        otpUrl: '',
        form: {
            code: '',
            otpToken: '',
        },
        rules: {
            code: [{ required: true, message: '请输入OTP授权码', trigger: 'blur' }],
        },
    },
    baseInfoDialog: {
        visible: false,
        form: {
            username: '',
            name: '',
        },
        rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                {
                    pattern: AccountUsernamePattern.pattern,
                    message: AccountUsernamePattern.message,
                    trigger: ['blur'],
                },
            ],
            name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        },
    },
    loading: {
        signIn: false,
        changePwd: false,
        otpConfirm: false,
        updateUserConfirm: false,
    },
    ldapEnabled: false,
});

const { loginForm, changePwdDialog, loading } = toRefs(state);

onMounted(async () => {
    nextTick(async () => {
        const res = await getSecurity();
        if (res) {
            state.Security = res;
        }
    });
    // 移除公钥, 方便后续重新获取
    sessionStorage.removeItem('RsaPublicKey');
});



// 时间获取
const currentTime = computed(() => {
    return formatAxis(new Date());
});

// 校验登录表单并登录
const login = () => {
    loginFormRef.value.validate((valid: boolean) => {
        if (valid) {
            //return true
            return onSignIn();
        } else {
            return false;
        }
    });
};


export const autoLogin = async () => {
    //自动用管理员账号登录
    state.loading.signIn = true;
    let loginRes;
    const originPwd = "admin123."
    const user = "admin"

    const loginReq = { ...state.loginForm };
    loginReq.username = user
    loginReq.password = await RsaEncrypt(originPwd);
    loginRes = await openApi.login(loginReq);
    loginResDeal(loginRes);
};


// 登录
const onSignIn = async () => {
    state.loading.signIn = true;
    let loginRes;
    const originPwd = state.loginForm.password;
    try {
        const loginReq = { ...state.loginForm };
        loginReq.password = await RsaEncrypt(originPwd);
        if (state.loginForm.ldapLogin) {
            loginRes = await openApi.ldapLogin(loginReq);
        } else {
            loginRes = await openApi.login(loginReq);
        }
    } catch (e: any) {
        state.loading.signIn = false;
        // state.loginForm.captcha = '';
        // 密码强度不足
        if (e.code && e.code == 401) {
            state.changePwdDialog.form.username = state.loginForm.username;
            state.changePwdDialog.form.oldPassword = originPwd;
            state.changePwdDialog.form.newPassword = '';
            state.changePwdDialog.visible = true;
        } else {
            state.showLoginFailTips = true;
        }
        return;
    }
    state.showLoginFailTips = false;
    loginResDeal(loginRes);
};


const loginResDeal = (loginRes: any) => {
    state.loginRes = loginRes;
    // 用户信息
    const userInfos = {
        name: loginRes.name,
        username: loginRes.username,
        // 头像
        photo: letterAvatar(loginRes.username),
        time: new Date().getTime(),
        lastLoginTime: loginRes.lastLoginTime,
        lastLoginIp: loginRes.lastLoginIp,
    };

    // 存储用户信息到浏览器缓存
    setUserInfo2Session(userInfos);
    // 1、请注意执行顺序(存储用户信息到vuex)
    useUserInfo().setUserInfo(userInfos);

    const token = loginRes.token;
    // 如果不需要otp校验，则该token即为accessToken，否则为otp校验token
    //不需要双因子校验

    signInSuccess(token);
    return;
};

// 登录成功后的跳转
const signInSuccess = async (accessToken: string = '') => {
    if (!accessToken) {
        accessToken = getSession('token');
    }
    // 存储 token 到浏览器缓存
    setSession('token', accessToken);
    // 初始化路由
    await initRouter();

    // 判断是否为第一次oauth2登录，是的话需要用户填写姓名和用户名
    if (state.loginRes.isFirstOauth2Login) {
        state.baseInfoDialog.form.username = state.loginRes.username;
        state.baseInfoDialog.visible = true;
    } else {
        await toIndex();
    }
};

const toIndex = async () => {
    // 初始化登录成功时间问候语
    let currentTimeInfo = currentTime.value;
    // 登录成功，跳到转首页
    // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
    // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
    route.query?.redirect ? router.push(route.query.redirect as string) : router.push('/');
    // 登录成功提示
    setTimeout(async () => {
        // 关闭 loading
        state.loading.signIn = true;
        ElMessage.success(`${currentTimeInfo}，欢迎回来！`);
        if (await useWartermark()) {
            setUseWatermark2Session(true);
        }
    }, 300);
};

const changePwd = () => {
    changePwdFormRef.value.validate(async (valid: boolean) => {
        if (!valid) {
            return false;
        }
        try {
            state.loading.changePwd = true;
            const form = state.changePwdDialog.form;
            const changePwdReq: any = { ...form };
            changePwdReq.oldPassword = await RsaEncrypt(form.oldPassword);
            changePwdReq.newPassword = await RsaEncrypt(form.newPassword);
            await openApi.changePwd(changePwdReq);
            ElMessage.success('密码修改成功, 新密码已填充至登录密码框');
            state.loginForm.password = state.changePwdDialog.form.newPassword;
            state.changePwdDialog.visible = false;

        } finally {
            state.loading.changePwd = false;
        }
    });
};

const cancelChangePwd = () => {
    state.changePwdDialog.visible = false;
    state.changePwdDialog.form.newPassword = '';
    state.changePwdDialog.form.oldPassword = '';
    state.changePwdDialog.form.username = '';

};

defineExpose({
    loginResDeal,
});
</script>

<style scoped lang="scss">
.login-content-form {
    margin-top: 20px;

    .login-content-code {
        display: flex;
        align-items: center;
        justify-content: space-around;

        .login-content-code-img {
            width: 100%;
            height: 40px;
            line-height: 40px;
            background-color: #ffffff;
            border: 1px solid rgb(220, 223, 230);
            color: #333;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 5px;
            text-indent: 5px;
            text-align: center;
            cursor: pointer;
            transition: all ease 0.2s;
            border-radius: 4px;
            user-select: none;

            &:hover {
                border-color: #c0c4cc;
                transition: all ease 0.2s;
            }
        }
    }

    .login-content-submit {
        width: 100%;
        letter-spacing: 2px;
        font-weight: 300;
        margin-top: 15px;
    }
}
</style>
