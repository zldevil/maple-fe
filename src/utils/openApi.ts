import request from './request'

export default {
  login: (param: any) => request.post('/auth/accounts/login', param),
  getPublicKey: () => request.get('/common/public-key'),
  getConfigValue: (params: any) => request.get('/sys/configs/value', params),
  changePwd: (param: any) => request.post('/sys/accounts/change-pwd', param),
  logout: () => request.post('/auth/accounts/logout'),
  getPermissions: () => request.get('/sys/accounts/permissions')
}
