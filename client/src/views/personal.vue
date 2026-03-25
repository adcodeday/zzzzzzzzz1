<template>
  <div class="personal-page">

    <!-- 顶部 Banner -->
    <div class="profile-banner">
      <div class="banner-bg">
        <svg class="banner-svg" viewBox="0 0 1200 200" preserveAspectRatio="xMidYMid slice">
          <rect width="1200" height="200" fill="#0f2416"/>
          <path d="M0 120 Q100 90 200 110 Q300 80 400 100 Q500 70 600 90 Q700 60 800 80 Q900 50 1000 70 Q1100 45 1200 60 L1200 200 L0 200Z" fill="#132a1a"/>
          <path d="M0 150 Q80 130 160 145 Q250 125 340 140 Q430 118 520 135 Q610 112 700 128 Q790 106 880 122 Q970 100 1060 116 Q1130 100 1200 110 L1200 200 L0 200Z" fill="#0a1a0f"/>
          <line x1="0" y1="170" x2="1200" y2="170" stroke="#1e3d25" stroke-width="0.8"/>
          <line x1="0" y1="182" x2="1200" y2="182" stroke="#1a3520" stroke-width="0.6"/>
          <circle cx="900" cy="40" r="30" fill="#1f3a26"/>
          <circle cx="900" cy="40" r="18" fill="#2a4d32"/>
          <circle cx="900" cy="40" r="10" fill="#d4c890" opacity="0.7"/>
          <circle cx="900" cy="40" r="38" fill="none" stroke="#1e3020" stroke-width="12" opacity="0.4"/>
          <circle cx="200" cy="60"  r="1.2" fill="#f0ede8" opacity="0.5"/>
          <circle cx="350" cy="30"  r="0.8" fill="#f0ede8" opacity="0.4"/>
          <circle cx="500" cy="50"  r="1"   fill="#f0ede8" opacity="0.4"/>
          <circle cx="700" cy="25"  r="0.8" fill="#f0ede8" opacity="0.5"/>
          <circle cx="1050" cy="55" r="1"   fill="#f0ede8" opacity="0.3"/>
          <circle cx="150" cy="110" r="1.2" fill="#a0d860" opacity="0.6"/>
          <circle cx="450" cy="100" r="1"   fill="#b0e870" opacity="0.5"/>
          <circle cx="750" cy="108" r="1.2" fill="#90c850" opacity="0.55"/>
        </svg>
      </div>
      <div class="profile-hero">
        <div class="avatar-wrap">
          <img v-if="userInfo.png" :src="userInfo.png" class="avatar-img" @error="userInfo.png = ''"/>
          <div v-else class="avatar-placeholder" :style="avatarStyle(userInfo.nickName || userInfo.userName)">
            {{ (userInfo.nickName || userInfo.userName || '?')[0] }}
          </div>
          <label class="avatar-edit" title="更换头像">
            <svg viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="1.5" width="13" height="13">
              <path d="M11 2l3 3-9 9H2v-3L11 2z"/>
            </svg>
            <input type="file" accept="image/*" style="display:none" @change="onAvatarFile"/>
          </label>
        </div>
        <div class="profile-meta">
          <div class="profile-name">{{ userInfo.nickName || userInfo.userName || '未知用户' }}</div>
          <div class="profile-handle">@{{ userInfo.userName }}</div>
          <div class="profile-tags">
            <span class="role-badge" :class="'role-' + userInfo.authority">{{ roleLabel(userInfo.authority) }}</span>
            <span v-if="userInfo.local" class="meta-badge">{{ userInfo.local }}</span>
            <span v-if="userInfo.tel" class="meta-badge">{{ userInfo.tel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <div class="personal-body">

      <!-- 左列 -->
      <div class="left-col">

        <!-- 基本信息卡 -->
        <div class="info-card">
          <div class="card-header">
            <span class="card-header-title">基本信息</span>
            <button v-if="!isEditing" class="edit-btn" @click="startEdit">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13"><path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z"/></svg>
              编辑
            </button>
            <div v-else class="edit-action-row">
              <button class="save-btn" @click="saveInfo">保存</button>
              <button class="cancel-btn" @click="cancelEdit">取消</button>
            </div>
          </div>

          <div v-if="!isEditing" class="info-list">
            <div class="info-item" v-for="item in infoDisplay" :key="item.label">
              <span class="info-label">{{ item.label }}</span>
              <span class="info-val">
                <span v-if="item.badge" class="role-badge" :class="'role-' + userInfo.authority">{{ item.val }}</span>
                <span v-else>{{ item.val || '未设置' }}</span>
              </span>
            </div>
          </div>

          <div v-else class="edit-form">
            <div class="edit-field" v-for="f in editFields" :key="f.key">
              <label class="edit-label">{{ f.label }}</label>
              <el-input v-model="editForm[f.key]" class="art-input" :placeholder="`请输入${f.label}`"/>
            </div>
          </div>
        </div>

        <!-- 账号安全卡 -->
        <div class="info-card">
          <div class="card-header">
            <span class="card-header-title">账号安全</span>
          </div>
          <div class="security-row" @click="showPwd = !showPwd">
            <div class="sec-icon-wrap">
              <svg viewBox="0 0 16 16" fill="none" stroke="#2d6a45" stroke-width="1.5" width="16" height="16">
                <rect x="3" y="7" width="10" height="8" rx="1.5"/>
                <path d="M5 7V5a3 3 0 016 0v2"/>
              </svg>
            </div>
            <div class="sec-text">
              <div class="sec-title">登录密码</div>
              <div class="sec-sub">建议定期更换密码</div>
            </div>
            <svg viewBox="0 0 10 10" fill="none" stroke="#bbb" stroke-width="1.5" width="10" height="10"
              :style="{ transform: showPwd ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }">
              <polyline points="3,1 7,5 3,9"/>
            </svg>
          </div>

          <div v-show="showPwd" class="pwd-form">
            <div class="edit-field">
              <label class="edit-label">原密码</label>
              <el-input v-model="pwdForm.old" class="art-input" type="password" show-password placeholder="请输入原密码"/>
            </div>
            <div class="edit-field">
              <label class="edit-label">新密码</label>
              <el-input v-model="pwdForm.new" class="art-input" type="password" show-password placeholder="至少 6 位"/>
            </div>
            <div class="edit-field">
              <label class="edit-label">确认新密码</label>
              <el-input v-model="pwdForm.confirm" class="art-input" type="password" show-password placeholder="再次输入新密码"/>
            </div>
            <button class="save-btn full-btn" @click="changePwd">确认修改</button>
          </div>
        </div>

      </div>

      <!-- 右列 -->
      <div class="right-col">

        <!-- 数据统计 -->
        <div class="info-card">
          <div class="card-header">
            <span class="card-header-title">我的数据</span>
          </div>
          <div class="data-grid">
            <div class="data-block" v-for="d in dataStats" :key="d.label">
              <div class="data-num" :style="{ color: d.color }">{{ d.val }}</div>
              <div class="data-lbl">{{ d.label }}</div>
            </div>
          </div>
        </div>

        <!-- 最近活动 -->
        <div class="info-card">
          <div class="card-header">
            <span class="card-header-title">最近活动</span>
          </div>
          <div class="activity-list">
            <div class="act-item" v-for="a in activities" :key="a.title">
              <div class="act-dot" :style="{ background: a.color }"></div>
              <div class="act-body">
                <div class="act-title">{{ a.title }}</div>
                <div class="act-time">{{ a.time }}</div>
              </div>
              <span class="act-badge" :style="{ background: a.bg, color: a.color }">{{ a.status }}</span>
            </div>
          </div>
        </div>

        <!-- 快捷入口 -->
        <div class="info-card">
          <div class="card-header">
            <span class="card-header-title">快捷入口</span>
          </div>
          <div class="shortcut-grid">
            <router-link to="/orders"   class="sc-item"><div class="sc-icon sc-green">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><rect x="1" y="2" width="14" height="12" rx="1.5"/><line x1="4" y1="6" x2="12" y2="6"/><line x1="4" y1="10" x2="9" y2="10"/></svg>
            </div><span class="sc-name">我的订单</span></router-link>
            <router-link to="/tasks"    class="sc-item"><div class="sc-icon sc-blue">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M13 2H3a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1z"/><polyline points="5,8 7,10 11,6"/></svg>
            </div><span class="sc-name">助农社区</span></router-link>
            <router-link to="/"         class="sc-item"><div class="sc-icon sc-amber">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M6 2L3 6v8h10V6L16 2H6z"/><line x1="3" y1="6" x2="13" y2="6"/><path d="M10 10a2 2 0 01-4 0"/></svg>
            </div><span class="sc-name">去购物</span></router-link>
            <router-link to="/news"     class="sc-item"><div class="sc-icon sc-purple">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16"><path d="M14 10a2 2 0 01-2 2H5l-3 2V4a2 2 0 012-2h8a2 2 0 012 2z"/></svg>
            </div><span class="sc-name">问题咨询</span></router-link>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const apiUrl  = import.meta.env.VITE_API_URL || ''
const userInfo = ref({})
const isEditing = ref(false)
const showPwd   = ref(false)
const editForm  = ref({})
const pwdForm   = ref({ old: '', new: '', confirm: '' })

const editFields = [
  { key: 'nickName', label: '昵称' },
  { key: 'tel',      label: '手机号' },
  { key: 'local',    label: '所在地区' },
]

const infoDisplay = computed(() => [
  { label: '用户名', val: userInfo.value.userName },
  { label: '昵称',   val: userInfo.value.nickName },
  { label: '手机号', val: userInfo.value.tel },
  { label: '所在地', val: userInfo.value.local },
  { label: '身份',   val: roleLabel(userInfo.value.authority), badge: true },
])

const dataStats = [
  { label: '累计订单', val: 12,       color: '#2d6a45' },
  { label: '累计消费', val: '¥2,388', color: '#BA7517' },
  { label: '参与任务', val: 5,        color: '#185FA5' },
  { label: '注册天数', val: 86,       color: '#993556' },
]

const activities = [
  { title: '购买了有机草莓 x2',  time: '2025-07-18 14:30', status: '已支付', color: '#2d6a45', bg: '#EAF3DE' },
  { title: '接取了农田除草任务',  time: '2025-07-16 10:00', status: '进行中', color: '#185FA5', bg: '#E6F1FB' },
  { title: '购买了云南蜂蜜礼盒',  time: '2025-07-14 09:15', status: '已完成', color: '#3B6D11', bg: '#EAF3DE' },
  { title: '咨询了病虫害问题',    time: '2025-07-12 16:40', status: '已回复', color: '#3C3489', bg: '#EEEDFE' },
  { title: '购买了东北大米 5kg',  time: '2025-07-10 11:20', status: '已发货', color: '#854F0B', bg: '#FAEEDA' },
]

const roleLabel = (a) => ({ 0:'管理员', 1:'农户', 2:'买家' }[a] ?? '未知')

const avatarColors = ['#C0DD97,#3B6D11','#B5D4F4,#185FA5','#F5C4B3,#993C1D','#CECBF6,#3C3489','#9FE1CB,#0F6E56']
const avatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0
  const [bg, color] = avatarColors[idx].split(',')
  return { background: bg, color }
}

const getUserInfo = () => {
  const s = localStorage.getItem('user')
  if (s) userInfo.value = JSON.parse(s)
}

const startEdit = () => {
  editForm.value = { ...userInfo.value }
  isEditing.value = true
}

const cancelEdit = () => { isEditing.value = false }

const saveInfo = async () => {
  try {
    const res = await axios.put(`${apiUrl}/tables/user/${userInfo.value.id}`, editForm.value)
    if (res.data.success) {
      const updated = { ...userInfo.value, ...editForm.value }
      localStorage.setItem('user', JSON.stringify(updated))
      userInfo.value = updated
      isEditing.value = false
      ElMessage.success('保存成功')
    } else {
      ElMessage.error(res.data.message || '保存失败')
    }
  } catch { ElMessage.error('保存失败') }
}

const changePwd = async () => {
  if (!pwdForm.value.old) return ElMessage.warning('请输入原密码')
  if (!pwdForm.value.new || pwdForm.value.new.length < 6) return ElMessage.warning('新密码不少于6位')
  if (pwdForm.value.new !== pwdForm.value.confirm) return ElMessage.warning('两次密码不一致')
  try {
    await ElMessageBox.confirm('确定修改密码吗？修改后需重新登录', '提示', { type: 'warning' })
    const res = await axios.post(`${apiUrl}/changePassword`, {
      id: userInfo.value.id,
      oldPassword: pwdForm.value.old,
      newPassword: pwdForm.value.new,
    })
    if (res.data.success) {
      ElMessage.success('密码修改成功，请重新登录')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else {
      ElMessage.error(res.data.message || '修改失败')
    }
  } catch (e) { if (e !== 'cancel') ElMessage.error('修改失败') }
}

const onAvatarFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) return ElMessage.error('请选择图片文件')
  if (file.size > 2 * 1024 * 1024) return ElMessage.error('图片不能超过 2MB')
  const reader = new FileReader()
  reader.onload = async () => {
    try {
      await axios.put(`${apiUrl}/tables/user/${userInfo.value.id}`, { png: reader.result })
      userInfo.value.png = reader.result
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      stored.png = reader.result
      localStorage.setItem('user', JSON.stringify(stored))
      ElMessage.success('头像更新成功')
    } catch { ElMessage.error('头像上传失败') }
  }
  reader.readAsDataURL(file)
}

onMounted(getUserInfo)
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Inter:wght@300;400;500&display=swap');

.personal-page {

  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* ── Banner ── */
.profile-banner {
  position: relative;
  margin: -28px -32px 0;
}

.banner-bg {
  height: 180px;
  overflow: hidden;
}

.banner-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.profile-hero {
  display: flex;
  align-items: flex-end;
  gap: 20px;
  padding: 0 32px 24px;
  margin-top: -56px;
  position: relative;
  z-index: 1;
}

.avatar-wrap { position: relative; flex-shrink: 0; }

.avatar-img, .avatar-placeholder {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.avatar-edit {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #1a3a22;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: #2d6a45; }
}

.profile-name {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 400;
  color: #1a1a12;
  margin-bottom: 3px;
}

.profile-handle {
  font-size: 12px;
  color: #9a9a8a;
  margin-bottom: 8px;
}

.profile-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.role-badge {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 500;
}
.role-0 { background: #FAECE7; color: #993C1D; }
.role-1 { background: #EAF3DE; color: #3B6D11; }
.role-2 { background: #E6F1FB; color: #185FA5; }

.meta-badge {
  font-size: 11px;
  background: #F1EFE8;
  color: #5F5E5A;
  padding: 2px 9px;
  border-radius: 20px;
}

/* ── 主体布局 ── */
.personal-body {
  display: flex;
  gap: 16px;
  padding: 20px 0 40px;
}

.left-col {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.right-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ── 卡片 ── */
.info-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 18px 20px;
  transition: border-color .2s;
  &:hover { border-color: #c8d8c0; }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0ede6;
}

.card-header-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a12;
  letter-spacing: .3px;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  color: #6a6a5a;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}

.edit-action-row { display: flex; gap: 8px; }

.save-btn {
  padding: 5px 14px;
  background: #1a3a22;
  color: #f0ede8;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .15s;
  &:hover { background: #2d6a45; }
  &.full-btn { width: 100%; padding: 8px; margin-top: 8px; }
}

.cancel-btn {
  padding: 5px 14px;
  background: white;
  color: #6a6a5a;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  &:hover { border-color: #c8c8b8; }
}

/* ── 信息展示 ── */
.info-list { display: flex; flex-direction: column; }

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f8f6f2;
  &:last-child { border-bottom: none; }
}

.info-label {
  font-size: 11px;
  color: #9a9a8a;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.info-val {
  font-size: 13px;
  color: #1a1a12;
  font-weight: 500;
}

/* ── 编辑表单 ── */
.edit-form, .pwd-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.edit-field { display: flex; flex-direction: column; gap: 6px; }

.edit-label {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #9a9a8a;
  text-transform: uppercase;
  font-weight: 500;
}

.art-input {
  :deep(.el-input__wrapper) {
    background: transparent;
    border: none;
    border-radius: 0;
    border-bottom: 1.5px solid #dedad2;
    box-shadow: none !important;
    padding: 3px 0;
    transition: border-color .2s;
    &:hover, &.is-focus { border-bottom-color: #2d6a45; }
  }
  :deep(.el-input__inner) {
    font-size: 13px;
    color: #1a1a12;
    font-family: 'Inter', sans-serif;
    height: 34px;
    padding: 0;
    &::placeholder { color: #c8c8b8; font-weight: 300; }
  }
  :deep(.el-input__suffix) { color: #b0b0a0; }
}

/* ── 安全行 ── */
.security-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background .15s;
  &:hover { background: #faf9f6; padding: 8px 10px; margin: 0 -10px; }
}

.sec-icon-wrap {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #EAF3DE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sec-title { font-size: 13px; font-weight: 500; color: #1a1a12; margin-bottom: 2px; }
.sec-sub   { font-size: 11px; color: #9a9a8a; }
.sec-text  { flex: 1; }

.pwd-form {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0ede6;
}

/* ── 数据统计 ── */
.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.data-block {
  text-align: center;
  padding: 14px 8px;
  background: #faf9f6;
  border-radius: 6px;
  transition: transform .15s;
  &:hover { transform: translateY(-2px); }
}

.data-num {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.2;
}

.data-lbl { font-size: 10px; color: #9a9a8a; letter-spacing: .5px; }

/* ── 活动 ── */
.activity-list { display: flex; flex-direction: column; }

.act-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid #f8f6f2;
  &:last-child { border-bottom: none; }
}

.act-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.act-body { flex: 1; min-width: 0; }
.act-title { font-size: 13px; color: #1a1a12; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.act-time  { font-size: 11px; color: #b0b0a0; }

.act-badge {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── 快捷入口 ── */
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.sc-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  padding: 14px 8px;
  border-radius: 8px;
  background: #faf9f6;
  text-decoration: none;
  transition: all .15s;
  &:hover { background: #EAF3DE; transform: translateY(-2px); }
}

.sc-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sc-green  { background: #EAF3DE; color: #2d6a45; }
.sc-blue   { background: #E6F1FB; color: #185FA5; }
.sc-amber  { background: #FAEEDA; color: #854F0B; }
.sc-purple { background: #EEEDFE; color: #534AB7; }

.sc-name { font-size: 11px; color: #4a4a3a; font-weight: 500; }

/* ── 响应式 ── */
@media (max-width: 900px) {
  .profile-banner { margin: -20px -16px 0; }
  .profile-hero   { padding: 0 16px 20px; }
  .personal-body  { flex-direction: column; padding: 16px 0 32px; }
  .left-col       { width: 100%; }
  .data-grid      { grid-template-columns: repeat(2,1fr); }
  .shortcut-grid  { grid-template-columns: repeat(4,1fr); }
}
</style>