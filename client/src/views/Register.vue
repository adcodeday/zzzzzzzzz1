<template>
  <div class="register-page">

    <!-- 左侧艺术区 -->
    <div class="art-side">
      <svg class="art-svg" viewBox="0 0 340 780" preserveAspectRatio="xMidYMid slice">
        <rect width="340" height="780" fill="#0a1a0f"/>
        <ellipse cx="260" cy="70" rx="44" ry="44" fill="#1a3020"/>
        <ellipse cx="260" cy="70" rx="28" ry="28" fill="#1f3a26"/>
        <ellipse cx="260" cy="70" rx="15" ry="15" fill="#d4c890" opacity="0.8"/>
        <circle cx="260" cy="70" r="52" fill="none" stroke="#1e3020" stroke-width="16" opacity="0.5"/>
        <path d="M0 340 Q60 300 120 320 Q180 280 240 310 Q290 270 340 290 L340 400 L0 400Z" fill="#0f2416"/>
        <path d="M0 370 Q50 335 110 355 Q170 315 230 345 Q285 310 340 330 L340 420 L0 420Z" fill="#132a1a"/>
        <line x1="0" y1="480" x2="340" y2="480" stroke="#1e3d25" stroke-width="0.8"/>
        <line x1="0" y1="510" x2="340" y2="510" stroke="#1a3520" stroke-width="0.7"/>
        <line x1="0" y1="540" x2="340" y2="540" stroke="#162e1c" stroke-width="0.7"/>
        <line x1="0" y1="570" x2="340" y2="570" stroke="#132818" stroke-width="0.6"/>
        <line x1="0" y1="600" x2="340" y2="600" stroke="#102214" stroke-width="0.6"/>
        <line x1="34"  y1="440" x2="34"  y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.5"/>
        <line x1="90"  y1="440" x2="90"  y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.4"/>
        <line x1="146" y1="440" x2="146" y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.4"/>
        <line x1="202" y1="440" x2="202" y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.4"/>
        <line x1="258" y1="440" x2="258" y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.4"/>
        <line x1="314" y1="440" x2="314" y2="780" stroke="#1a3520" stroke-width="0.5" opacity="0.4"/>
        <g stroke="#2d6a3a" stroke-width="0.7" fill="none" opacity="0.65">
          <path d="M34 510 Q32 502 30 494 M34 510 Q36 502 38 495"/>
          <path d="M90 510 Q88 502 86 494 M90 510 Q92 502 94 495"/>
          <path d="M146 510 Q144 502 142 494 M146 510 Q148 502 150 495"/>
          <path d="M202 510 Q200 502 198 494 M202 510 Q204 502 206 495"/>
          <path d="M258 510 Q256 502 254 494 M258 510 Q260 502 262 495"/>
          <path d="M314 510 Q312 502 310 494 M314 510 Q316 502 318 495"/>
          <path d="M34 540 Q32 533 31 526 M34 540 Q36 533 37 526"/>
          <path d="M90 540 Q88 533 87 526 M90 540 Q92 533 93 526"/>
          <path d="M146 540 Q144 533 143 526 M146 540 Q148 533 149 526"/>
          <path d="M202 540 Q200 533 199 526 M202 540 Q204 533 205 526"/>
          <path d="M258 540 Q256 533 255 526 M258 540 Q260 533 261 526"/>
        </g>
        <ellipse cx="258" cy="560" rx="22" ry="6" fill="#c8b860" opacity="0.1"/>
        <circle cx="55"  cy="435" r="1.2" fill="#a0d860" opacity="0.7"/>
        <circle cx="170" cy="420" r="1"   fill="#b0e870" opacity="0.6"/>
        <circle cx="280" cy="432" r="1.2" fill="#90c850" opacity="0.65"/>
        <circle cx="28"  cy="200" r="0.8" fill="#f0ede8" opacity="0.6"/>
        <circle cx="90"  cy="140" r="1"   fill="#f0ede8" opacity="0.5"/>
        <circle cx="160" cy="180" r="0.8" fill="#f0ede8" opacity="0.4"/>
        <circle cx="50"  cy="260" r="0.7" fill="#f0ede8" opacity="0.3"/>
        <circle cx="200" cy="120" r="1"   fill="#f0ede8" opacity="0.5"/>
        <circle cx="310" cy="160" r="0.8" fill="#f0ede8" opacity="0.4"/>
        <path d="M0 690 Q85 680 170 685 Q255 675 340 682 L340 710 L0 710Z" fill="#0d2010" opacity="0.9"/>
        <rect x="0" y="718" width="340" height="62" fill="#08160c"/>
      </svg>

      <div class="art-top">
        <div class="art-badge">智慧助农电商平台</div>
        <div class="art-divider"></div>
        <h1 class="art-title">加入我们<br>共建<em>绿色</em><br>农业生态</h1>
        <p class="art-sub">注册成为平台用户<br>开启你的助农之旅</p>
      </div>

      <div class="art-features">
        <div class="feat-item">
          <span class="feat-dot"></span>
          <span class="feat-txt">产地直发，新鲜保障</span>
        </div>
        <div class="feat-item">
          <span class="feat-dot"></span>
          <span class="feat-txt">助农任务，参与共建</span>
        </div>
        <div class="feat-item">
          <span class="feat-dot"></span>
          <span class="feat-txt">AI 咨询，专业解答</span>
        </div>
      </div>

      <div class="deco-corner-br"></div>
    </div>

    <!-- 右侧表单 -->
    <div class="form-side">
      <div class="deco-corner-tr"></div>

      <!-- 步骤进度 -->
      <div class="steps-row">
        <div class="step done">
          <svg viewBox="0 0 10 10" fill="none" stroke="white" stroke-width="1.8" width="10" height="10">
            <polyline points="1.5,5 4,7.5 8.5,2.5"/>
          </svg>
        </div>
        <div class="step-line"></div>
        <div class="step active">2</div>
        <div class="step-line"></div>
        <div class="step">3</div>
        <span class="step-label">填写基本信息</span>
      </div>

      <div class="form-eyebrow">Create Account</div>
      <h2 class="form-title">创建你的账号</h2>
      <p class="form-sub">填写以下信息完成注册</p>

      <el-form :model="form" :rules="rules" ref="formRef" class="reg-form">
        <div class="form-grid">
          <div class="field-wrap">
            <label class="field-label">用户名</label>
            <el-form-item prop="userName">
              <el-input v-model="form.userName" class="art-input" placeholder="请输入用户名"/>
            </el-form-item>
          </div>
          <div class="field-wrap">
            <label class="field-label">昵称</label>
            <el-form-item prop="nickName">
              <el-input v-model="form.nickName" class="art-input" placeholder="你的显示名称"/>
            </el-form-item>
          </div>
          <div class="field-wrap">
            <label class="field-label">密码</label>
            <el-form-item prop="passWord">
              <el-input v-model="form.passWord" class="art-input" type="password" placeholder="至少 6 位" show-password/>
            </el-form-item>
          </div>
          <div class="field-wrap">
            <label class="field-label">确认密码</label>
            <el-form-item prop="confirmPassword">
              <el-input v-model="form.confirmPassword" class="art-input" type="password" placeholder="再次输入密码" show-password/>
            </el-form-item>
          </div>
          <div class="field-wrap">
            <label class="field-label">手机号</label>
            <el-form-item prop="tel">
              <el-input v-model="form.tel" class="art-input" placeholder="请输入手机号码"/>
            </el-form-item>
          </div>
          <div class="field-wrap">
            <label class="field-label">所在地区</label>
            <el-form-item prop="local">
              <el-input v-model="form.local" class="art-input" placeholder="省 / 市 / 区"/>
            </el-form-item>
          </div>
        </div>

        <!-- 身份选择 -->
        <div class="field-wrap full">
          <label class="field-label">注册身份</label>
          <el-form-item prop="authority">
            <div class="role-row">
              <div
                :class="['role-card', { active: form.authority === 1 }]"
                @click="form.authority = 1"
              >
                <div class="role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
                    <path d="M12 2C8 2 5 6 5 10c0 5 7 12 7 12s7-7 7-12c0-4-3-8-7-8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div class="role-name">农户</div>
                <div class="role-sub">发布农产品 · 任务</div>
              </div>
              <div
                :class="['role-card', { active: form.authority === 2 }]"
                @click="form.authority = 2"
              >
                <div class="role-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                </div>
                <div class="role-name">买家</div>
                <div class="role-sub">购买 · 参与助农</div>
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="btn-row">
          <button class="reg-btn" :class="{ loading: isSubmitting }" @click.prevent="handleRegister" :disabled="isSubmitting">
            <span v-if="!isSubmitting">注 册</span>
            <span v-else class="btn-dots">
              <span class="ldot"></span><span class="ldot"></span><span class="ldot"></span>
            </span>
          </button>
          <span class="login-link" @click="$router.push('/login')">已有账号？去登录 →</span>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const apiUrl = import.meta.env.VITE_API_URL || ''
const router = useRouter()
const formRef = ref(null)
const isSubmitting = ref(false)

const form = reactive({
  userName: '',
  passWord: '',
  confirmPassword: '',
  nickName: '',
  tel: '',
  local: '',
  authority: 2
})

const validatePass = (rule, value, callback) => {
  if (!value) return callback(new Error('请输入密码'))
  if (value.length < 6) return callback(new Error('密码不能少于6位'))
  if (form.confirmPassword) formRef.value?.validateField('confirmPassword')
  callback()
}

const validatePass2 = (rule, value, callback) => {
  if (!value) return callback(new Error('请再次输入密码'))
  if (value !== form.passWord) return callback(new Error('两次密码不一致'))
  callback()
}

const rules = {
  userName:        [{ required: true, message: '请输入用户名', trigger: 'blur' },
                   { min: 3, message: '用户名不少于3个字符', trigger: 'blur' }],
  passWord:        [{ validator: validatePass, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
  nickName:        [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  tel:             [{ required: true, message: '请输入手机号', trigger: 'blur' },
                   { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  local:           [{ required: true, message: '请输入地区', trigger: 'blur' }],
  authority:       [{ required: true, message: '请选择身份', trigger: 'change' }],
}

const handleRegister = async () => {
  if (isSubmitting.value) return
  try {
    await formRef.value.validate()
    isSubmitting.value = true
    const res = await axios.post(`${apiUrl}/register`, {
      userName:  form.userName,
      passWord:  form.passWord,
      nickName:  form.nickName,
      tel:       form.tel,
      local:     form.local,
      authority: form.authority,
    })
    if (res.data.success) {
      ElMessage.success('注册成功，请登录')
      router.push('/login')
    } else {
      ElMessage.error(res.data.message || '注册失败')
    }
  } catch (e) {
    if (e?.response?.data?.message) ElMessage.error(e.response.data.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Inter:wght@300;400;500&display=swap');

.register-page {
  width: 1200px;
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

/* ── 左侧 ── */
.art-side {
  width: 700px;
  flex-shrink: 0;
  background: #0a1a0f;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 44px 36px;
  min-height: 100vh;
}

.art-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.art-top { position: relative; z-index: 2; }
.art-features { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 10px; }

.art-badge {
  font-size: 10px;
  letter-spacing: 3px;
  color: #4CAF7D;
  text-transform: uppercase;
  font-weight: 500;
  margin-bottom: 14px;
  font-family: 'Inter', sans-serif;
}

.art-divider {
  width: 28px;
  height: 1.5px;
  background: #4CAF7D;
  margin-bottom: 18px;
}

.art-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 26px;
  font-weight: 300;
  color: #f0ede8;
  line-height: 1.5;
  margin-bottom: 14px;
  em { font-style: normal; color: #6dbe8a; font-weight: 400; }
}

.art-sub {
  font-size: 12px;
  color: rgba(240,237,232,0.45);
  line-height: 1.9;
  font-family: 'Inter', sans-serif;
}

.feat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #4CAF7D;
  flex-shrink: 0;
}

.feat-txt {
  font-size: 11px;
  color: rgba(240,237,232,0.5);
  font-family: 'Inter', sans-serif;
}

.deco-corner-br {
  position: absolute;
  bottom: 24px;
  left: 24px;
  width: 32px;
  height: 32px;
  border-bottom: 1.5px solid rgba(77,175,100,0.4);
  border-left: 1.5px solid rgba(77,175,100,0.4);
  border-radius: 0;
}

/* ── 右侧 ── */
.form-side {
  flex: 1;
  background: #fafaf8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 52px;
  position: relative;
  overflow-y: auto;
}

.deco-corner-tr {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  border-top: 1.5px solid #d8d5ce;
  border-right: 1.5px solid #d8d5ce;
  border-radius: 0 4px 0 0;
  pointer-events: none;
}

/* ── 步骤条 ── */
.steps-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}

.step {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  border: 1.5px solid #e0ddd6;
  color: #bbb;
  font-family: 'Inter', sans-serif;
  transition: all .2s;

  &.done { background: #2d6a45; border-color: #2d6a45; color: white; }
  &.active { background: #1a3a22; border-color: #1a3a22; color: white; }
}

.step-line {
  flex: 1;
  height: 1px;
  background: #e8e6e0;
  max-width: 40px;
}

.step-label {
  font-size: 11px;
  color: #b0b0a0;
  margin-left: 4px;
  font-family: 'Inter', sans-serif;
}

/* ── 表单头 ── */
.form-eyebrow {
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #b0b0a0;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-family: 'Inter', sans-serif;
}

.form-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 24px;
  font-weight: 400;
  color: #1a1a12;
  margin-bottom: 6px;
}

.form-sub {
  font-size: 12px;
  color: #9a9a8a;
  margin-bottom: 24px;
  font-family: 'Inter', sans-serif;
}

/* ── 表单字段 ── */
.reg-form { :deep(.el-form-item) { margin-bottom: 0; } }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 24px;
}

.field-wrap {
  margin-bottom: 18px;
  &.full { grid-column: 1 / -1; }
}

.field-label {
  display: block;
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #9a9a8a;
  text-transform: uppercase;
  margin-bottom: 7px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.art-input {
  :deep(.el-input__wrapper) {
    background: transparent;
    border: none;
    border-radius: 0;
    border-bottom: 1.5px solid #dedad2;
    box-shadow: none !important;
    padding: 4px 0;
    transition: border-color .2s;
    &:hover, &.is-focus { border-bottom-color: #2d6a45; }
  }
  :deep(.el-input__inner) {
    font-size: 13px;
    color: #1a1a12;
    font-family: 'Inter', sans-serif;
    height: 36px;
    padding: 0;
    &::placeholder { color: #c8c8b8; font-weight: 300; }
  }
  :deep(.el-input__suffix) { color: #b0b0a0; }
}

/* ── 身份卡片 ── */
.role-row {
  display: flex;
  gap: 12px;
}

.role-card {
  flex: 1;
  padding: 14px 16px;
  border: 1.5px solid #e8e5de;
  border-radius: 4px;
  cursor: pointer;
  transition: all .15s;
  text-align: center;

  &:hover { border-color: #b8d8c0; background: #f8fdf8; }
  &.active { border-color: #2d6a45; background: #f0faf4; }
}

.role-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
  color: #7a9a7a;
  .role-card.active & { color: #2d6a45; }
}

.role-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a12;
  margin-bottom: 3px;
  font-family: 'Inter', sans-serif;
  .role-card.active & { color: #1a3a22; }
}

.role-sub {
  font-size: 11px;
  color: #aaa;
  font-family: 'Inter', sans-serif;
}

/* ── 按钮 ── */
.btn-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 24px;
}

.reg-btn {
  height: 44px;
  padding: 0 36px;
  background: #1a3a22;
  color: #f0ede8;
  border: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 2px;
  transition: background .2s, transform .1s;
  min-width: 100px;

  &:hover:not(:disabled) { background: #2d6a45; }
  &:active:not(:disabled) { transform: scale(0.98); }
  &:disabled { opacity: .7; cursor: not-allowed; }
}

.btn-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ldot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f0ede8;
  animation: ldot 1.2s infinite ease-in-out;
  &:nth-child(2) { animation-delay: .2s; }
  &:nth-child(3) { animation-delay: .4s; }
}

@keyframes ldot {
  0%,80%,100% { opacity: .3; transform: scale(.8); }
  40% { opacity: 1; transform: scale(1); }
}

.login-link {
  font-size: 12px;
  color: #9a9a8a;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: all .2s;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  padding-bottom: 1px;
  &:hover { color: #2d6a45; border-bottom-color: #2d6a45; }
}

/* ── 响应式 ── */
@media (max-width: 800px) {
  .register-page { flex-direction: column; }
  .art-side { width: 100%; min-height: 220px; flex: none; padding: 32px 28px; }
  .art-title { font-size: 22px; }
  .form-side { padding: 32px 24px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>