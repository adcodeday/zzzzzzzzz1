<template>
  <div class="user-manage">

    <div class="page-header">
      <div>
        <div class="page-eyebrow">User Management</div>
        <h2 class="page-title">用户管理</h2>
      </div>
      <div class="header-right">
        <div class="search-wrap">
          <svg viewBox="0 0 16 16" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="13" height="13" style="flex-shrink:0">
            <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
          </svg>
          <input v-model="searchKeyword" class="search-input" placeholder="搜索用户名或昵称..." @input="handleSearch"/>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-row">
      <div class="stat-card" v-for="s in statCards" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg }">
          <svg viewBox="0 0 20 20" fill="none" :stroke="s.color" stroke-width="1.5" width="17" height="17" v-html="s.svg"></svg>
        </div>
        <div>
          <div class="stat-val" :style="{ color: s.color }">{{ s.val }}</div>
          <div class="stat-lbl">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-card">
      <el-table :data="filteredUsers" v-loading="loading" border class="art-table">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column label="用户" width="200">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="user-avatar" :style="avatarStyle(row.nickName || row.userName)">
                {{ (row.nickName || row.userName || '?')[0] }}
              </div>
              <div>
                <div class="user-name">{{ row.nickName || row.userName }}</div>
                <div class="user-sub">@{{ row.userName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="手机号" width="140"/>
        <el-table-column prop="local" label="地区" width="130" show-overflow-tooltip/>
        <el-table-column label="身份" width="100">
          <template #default="{ row }">
            <span :class="['role-badge', 'role-' + row.authority]">{{ roleLabel(row.authority) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="200" fixed="right">
          <template #default="{ row }">
            <button class="tbl-btn edit" @click="showEditDialog(row)">编辑</button>
            <button class="tbl-btn warn" @click="confirmResetPassword(row)">重置密码</button>
            <button class="tbl-btn del"  @click="confirmDelete(row)">删除</button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无用户数据" :image-size="60"/>
        </template>
      </el-table>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showDialog" title="编辑用户" width="460px" class="art-dialog">
      <el-form :model="currentUser" :rules="rules" ref="userFormRef" label-width="0" class="dialog-form">
        <div class="dialog-field">
          <label class="dialog-label">用户名</label>
          <el-input v-model="currentUser.userName" class="art-input" disabled/>
        </div>
        <div class="dialog-field">
          <label class="dialog-label">昵称</label>
          <el-form-item prop="nickName">
            <el-input v-model="currentUser.nickName" class="art-input" placeholder="请输入昵称"/>
          </el-form-item>
        </div>
        <div class="dialog-field">
          <label class="dialog-label">手机号</label>
          <el-form-item prop="tel">
            <el-input v-model="currentUser.tel" class="art-input" placeholder="请输入手机号"/>
          </el-form-item>
        </div>
        <div class="dialog-field">
          <label class="dialog-label">地区</label>
          <el-form-item prop="local">
            <el-input v-model="currentUser.local" class="art-input" placeholder="请输入地区"/>
          </el-form-item>
        </div>
        <div class="dialog-field">
          <label class="dialog-label">身份权限</label>
          <el-form-item prop="authority">
            <el-select v-model="currentUser.authority" style="width:100%">
              <el-option :value="1" label="农户"/>
              <el-option :value="2" label="买家"/>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <button class="dialog-cancel" @click="closeDialog">取消</button>
        <button class="dialog-confirm" @click="submitUser">保存</button>
      </template>
    </el-dialog>

    <!-- 删除确认 -->
    <el-dialog v-model="showDeleteConfirm" title="确认删除" width="400px" class="art-dialog">
      <div class="confirm-body">
        <div class="confirm-icon warn">
          <svg viewBox="0 0 20 20" fill="none" stroke="#993C1D" stroke-width="1.5" width="22" height="22">
            <path d="M10 3L18 17H2L10 3z"/><line x1="10" y1="9" x2="10" y2="13"/><circle cx="10" cy="15.5" r="0.6" fill="#993C1D" stroke="none"/>
          </svg>
        </div>
        <div>
          <p class="confirm-title">确定删除用户 "{{ userToDelete?.userName }}"？</p>
          <p class="confirm-sub">此操作不可撤销，请谨慎操作。</p>
        </div>
      </div>
      <template #footer>
        <button class="dialog-cancel" @click="cancelDelete">取消</button>
        <button class="dialog-danger" @click="deleteUser">确认删除</button>
      </template>
    </el-dialog>

    <!-- 重置密码确认 -->
    <el-dialog v-model="showResetPasswordConfirm" title="确认重置密码" width="400px" class="art-dialog">
      <div class="confirm-body">
        <div class="confirm-icon info">
          <svg viewBox="0 0 20 20" fill="none" stroke="#185FA5" stroke-width="1.5" width="22" height="22">
            <rect x="3" y="8" width="14" height="11" rx="2"/><path d="M7 8V5a3 3 0 016 0v3"/>
          </svg>
        </div>
        <div>
          <p class="confirm-title">将 "{{ userToResetPassword?.userName }}" 的密码重置为 123456789</p>
          <p class="confirm-sub">用户下次登录需要修改密码。</p>
        </div>
      </div>
      <template #footer>
        <button class="dialog-cancel" @click="cancelResetPassword">取消</button>
        <button class="dialog-confirm" @click="resetPassword">确认重置</button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const apiUrl = import.meta.env.VITE_API_URL
const users       = ref([])
const loading     = ref(false)
const searchKeyword = ref('')
const showDialog  = ref(false)
const showDeleteConfirm = ref(false)
const showResetPasswordConfirm = ref(false)
const userToDelete = ref(null)
const userToResetPassword = ref(null)
const userFormRef = ref(null)

const currentUser = ref({ userName:'', nickName:'', tel:'', local:'', authority:1 })

const rules = reactive({
  nickName:  [{ required:true, message:'请输入昵称', trigger:'blur' }],
  tel:       [{ required:true, message:'请输入手机号', trigger:'blur' },
              { pattern:/^1[3-9]\d{9}$/, message:'手机号格式不正确', trigger:'blur' }],
  local:     [{ required:true, message:'请输入地区', trigger:'blur' }],
  authority: [{ required:true, message:'请选择权限', trigger:'change' }],
})

const statCards = computed(() => [
  { label:'全部用户', val: users.value.length, color:'#1a3a22', bg:'#EAF3DE',
    svg:'<circle cx="10" cy="7" r="4"/><path d="M3 18a7 7 0 0114 0"/>' },
  { label:'农户', val: users.value.filter(u=>u.authority===1).length, color:'#185FA5', bg:'#E6F1FB',
    svg:'<path d="M10 2C6 5 3 8 3 12a7 7 0 0014 0c0-4-3-7-7-10z"/><line x1="10" y1="10" x2="10" y2="18"/>' },
  { label:'买家', val: users.value.filter(u=>u.authority===2).length, color:'#854F0B', bg:'#FAEEDA',
    svg:'<path d="M4 4h5l1.5 8h7"/><circle cx="10" cy="18" r="1.5" fill="#854F0B" stroke="none"/><circle cx="16" cy="18" r="1.5" fill="#854F0B" stroke="none"/>' },
  { label:'管理员', val: users.value.filter(u=>u.authority===0).length, color:'#993C1D', bg:'#FAECE7',
    svg:'<rect x="3" y="8" width="14" height="11" rx="2"/><path d="M7 8V5a3 3 0 016 0v3"/>' },
])

const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  const kw = searchKeyword.value.toLowerCase()
  return users.value.filter(u =>
    (u.userName || '').toLowerCase().includes(kw) ||
    (u.nickName  || '').toLowerCase().includes(kw)
  )
})

const roleLabel = (a) => ({ 0:'管理员', 1:'农户', 2:'买家' }[a] ?? '未知')

const avatarColors = ['#C0DD97,#3B6D11','#B5D4F4,#185FA5','#F5C4B3,#993C1D','#CECBF6,#3C3489','#9FE1CB,#0F6E56']
const avatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0
  const [bg, color] = avatarColors[idx].split(',')
  return { background: bg, color }
}

const handleSearch = () => {}

const fetchUsers = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiUrl}/tables/user`)
    if (res.data.data) users.value = res.data.data
  } catch { ElMessage.error('获取用户列表失败') }
  finally { loading.value = false }
}

const showEditDialog = (user) => {
  currentUser.value = { ...user }
  showDialog.value = true
  userFormRef.value?.resetFields()
}

const closeDialog = () => { showDialog.value = false }

const submitUser = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      await axios.put(`${apiUrl}/tables/user/${currentUser.value.id}`, currentUser.value)
      const idx = users.value.findIndex(u => u.id === currentUser.value.id)
      if (idx !== -1) users.value[idx] = { ...currentUser.value }
      ElMessage.success('更新成功')
      showDialog.value = false
    } catch { ElMessage.error('更新失败') }
  })
}

const confirmDelete = (user) => { userToDelete.value = user; showDeleteConfirm.value = true }
const cancelDelete  = () => { showDeleteConfirm.value = false; userToDelete.value = null }

const deleteUser = async () => {
  try {
    await axios.delete(`${apiUrl}/tables/user/${userToDelete.value.id}`)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    showDeleteConfirm.value = false
    userToDelete.value = null
    ElMessage.success('删除成功')
  } catch { ElMessage.error('删除失败') }
}

const confirmResetPassword = (user) => { userToResetPassword.value = user; showResetPasswordConfirm.value = true }
const cancelResetPassword  = () => { showResetPasswordConfirm.value = false; userToResetPassword.value = null }

const resetPassword = async () => {
  try {
    await axios.put(`${apiUrl}/tables/user/${userToResetPassword.value.id}`, { ...userToResetPassword.value, passWord:'123456789' })
    showResetPasswordConfirm.value = false
    userToResetPassword.value = null
    ElMessage.success('密码已重置')
  } catch { ElMessage.error('重置失败') }
}

onMounted(fetchUsers)
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&family=Inter:wght@300;400;500&display=swap');

.user-manage {
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
}

.page-eyebrow {
  font-size: 10px;
  letter-spacing: 2px;
  color: #b0b0a0;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1a1a12;
  margin: 0;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  padding: 8px 12px;
  transition: border-color .2s;
  &:focus-within { border-color: #2d6a45; }
}

.search-input {
  border: none; outline: none;
  font-size: 13px; color: #1a1a12;
  background: transparent;
  width: 220px;
  font-family: 'Inter', sans-serif;
  &::placeholder { color: #c8c8b8; }
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
}

.stat-icon {
  width: 38px; height: 38px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.stat-val { font-size: 22px; font-weight: 600; line-height: 1.1; margin-bottom: 3px; }
.stat-lbl { font-size: 11px; color: #9a9a8a; }

.table-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  overflow: hidden;
}

.art-table {
  :deep(th.el-table__cell) { background: #faf9f6 !important; font-size: 11px; color: #9a9a8a; font-weight: 500; letter-spacing: .5px; text-transform: uppercase; }
  :deep(td.el-table__cell) { font-size: 13px; }
}

.user-cell { display: flex; align-items: center; gap: 10px; }

.user-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600;
  flex-shrink: 0;
}

.user-name { font-size: 13px; font-weight: 500; color: #1a1a12; }
.user-sub  { font-size: 11px; color: #9a9a8a; }

.role-badge {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 500;
}
.role-0 { background: #FAECE7; color: #993C1D; }
.role-1 { background: #EAF3DE; color: #3B6D11; }
.role-2 { background: #E6F1FB; color: #185FA5; }

.tbl-btn {
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  border: 1px solid;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  margin-right: 5px;
  &.edit { border-color: #b8d8c0; color: #2d6a45; background: #f0faf4; &:hover { background: #2d6a45; color: white; } }
  &.warn { border-color: #FAC775; color: #854F0B; background: #FAEEDA; &:hover { background: #854F0B; color: white; } }
  &.del  { border-color: #F7C1C1; color: #A32D2D; background: #FCEBEB; &:hover { background: #A32D2D; color: white; } }
}

.art-dialog {
  :deep(.el-dialog__header) { border-bottom: 1px solid #eeebe4; padding-bottom: 14px; }
  :deep(.el-dialog__title) { font-family: 'Noto Serif SC', serif; font-size: 17px; font-weight: 400; }
  :deep(.el-dialog__footer) { border-top: 1px solid #eeebe4; display: flex; justify-content: flex-end; gap: 8px; padding-top: 14px; }
}

.dialog-form { :deep(.el-form-item) { margin-bottom: 0; } }

.dialog-field { margin-bottom: 16px; }
.dialog-label {
  display: block;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #9a9a8a;
  text-transform: uppercase;
  margin-bottom: 7px;
  font-weight: 500;
}

.art-input {
  :deep(.el-input__wrapper) {
    background: transparent; border: none; border-radius: 0;
    border-bottom: 1.5px solid #dedad2;
    box-shadow: none !important; padding: 3px 0;
    transition: border-color .2s;
    &:hover, &.is-focus { border-bottom-color: #2d6a45; }
  }
  :deep(.el-input__inner) {
    font-size: 13px; color: #1a1a12; font-family: 'Inter', sans-serif;
    height: 34px; padding: 0;
    &::placeholder { color: #c8c8b8; font-weight: 300; }
  }
}

.confirm-body {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 4px 0;
}

.confirm-icon {
  width: 44px; height: 44px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  &.warn { background: #FAECE7; }
  &.info { background: #E6F1FB; }
}

.confirm-title { font-size: 14px; font-weight: 500; color: #1a1a12; margin-bottom: 5px; }
.confirm-sub   { font-size: 12px; color: #9a9a8a; }

.dialog-cancel {
  padding: 8px 18px;
  border: 1px solid #e8e5de; border-radius: 3px;
  background: white; font-size: 13px; cursor: pointer;
  font-family: 'Inter', sans-serif; color: #6a6a5a;
  &:hover { border-color: #c8c8b8; }
}

.dialog-confirm {
  padding: 8px 22px;
  border: none; border-radius: 3px;
  background: #1a3a22; color: #f0ede8;
  font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: 'Inter', sans-serif;
  &:hover { background: #2d6a45; }
}

.dialog-danger {
  padding: 8px 22px;
  border: none; border-radius: 3px;
  background: #A32D2D; color: white;
  font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: 'Inter', sans-serif;
  &:hover { background: #791F1F; }
}

@media (max-width: 768px) {
  .user-manage { padding: 20px 16px; }
  .stat-row    { grid-template-columns: repeat(2,1fr); }
}
</style>