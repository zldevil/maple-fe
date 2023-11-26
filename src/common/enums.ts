import { EnumValue } from '@/common/Enum'

export const ResourceTypeEnum = {
  Menu: EnumValue.of(1, '菜单'),
  Permission: EnumValue.of(2, '权限')
}

export const AccountStatusEnum = {
  Enable: EnumValue.of(1, '正常').tagTypeSuccess(),
  Disable: EnumValue.of(-1, '禁用').tagTypeDanger()
}

export const RoleStatusEnum = {
  Enable: EnumValue.of(1, '正常').tagTypeSuccess(),
  Disable: EnumValue.of(-1, '禁用').tagTypeDanger()
}

export const LogTypeEnum = {
  Success: EnumValue.of(1, '成功').tagTypeSuccess(),
  Error: EnumValue.of(2, '失败').tagTypeDanger()
}

// 数据库sql执行类型
export const DbSqlExecTypeEnum = {
  Update: EnumValue.of(1, 'UPDATE').setTagColor('#E4F5EB'),
  Delete: EnumValue.of(2, 'DELETE').setTagColor('#F9E2AE'),
  Insert: EnumValue.of(3, 'INSERT').setTagColor('#A8DEE0'),
  Query: EnumValue.of(4, 'QUERY').setTagColor('#A8DEE0'),
  Other: EnumValue.of(-1, 'OTHER').setTagColor('#F9E2AE')
}
