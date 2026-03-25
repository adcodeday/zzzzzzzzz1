<template>
  <div class="login-page">

    <!-- 左侧艺术区 -->
    <div class="art-side">
      <svg class="field-svg" viewBox="0 0 560 680" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="560" height="680" fill="#0a1a0f"/>
        <!-- 月光 -->
        <ellipse cx="420" cy="80" rx="60" ry="60" fill="#1a3020" opacity="0.9"/>
        <ellipse cx="420" cy="80" rx="44" ry="44" fill="#1f3a26"/>
        <ellipse cx="420" cy="80" rx="30" ry="30" fill="#2a4d32"/>
        <ellipse cx="420" cy="80" rx="18" ry="18" fill="#d4c890" opacity="0.85"/>
        <circle cx="420" cy="80" r="70" fill="none" stroke="#2a4020" stroke-width="20" opacity="0.4"/>
        <circle cx="420" cy="80" r="90" fill="none" stroke="#1a3018" stroke-width="14" opacity="0.25"/>
        <!-- 远山 -->
        <path d="M0 340 Q80 280 160 300 Q220 260 280 290 Q340 250 400 275 Q460 240 560 270 L560 380 L0 380Z" fill="#0f2416"/>
        <path d="M0 360 Q60 320 130 345 Q200 300 270 330 Q340 295 420 320 Q490 290 560 310 L560 400 L0 400Z" fill="#132a1a"/>
        <!-- 田垄横线 -->
        <line x1="0" y1="430" x2="560" y2="430" stroke="#1e3d25" stroke-width="1"/>
        <line x1="0" y1="460" x2="560" y2="460" stroke="#1a3520" stroke-width="0.8"/>
        <line x1="0" y1="490" x2="560" y2="490" stroke="#162e1c" stroke-width="0.8"/>
        <line x1="0" y1="520" x2="560" y2="520" stroke="#132818" stroke-width="0.7"/>
        <line x1="0" y1="550" x2="560" y2="550" stroke="#102214" stroke-width="0.7"/>
        <!-- 田垄竖线 -->
        <line x1="40"  y1="400" x2="40"  y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.6"/>
        <line x1="100" y1="400" x2="100" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.5"/>
        <line x1="160" y1="400" x2="160" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.5"/>
        <line x1="220" y1="400" x2="220" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <line x1="280" y1="400" x2="280" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <line x1="340" y1="400" x2="340" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <line x1="400" y1="400" x2="400" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <line x1="460" y1="400" x2="460" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <line x1="520" y1="400" x2="520" y2="680" stroke="#1a3520" stroke-width="0.6" opacity="0.4"/>
        <!-- 水稻苗 -->
        <g opacity="0.7" stroke="#2d6a3a" stroke-width="0.8" fill="none">
          <path d="M40 460 Q38 450 36 440 M40 460 Q42 450 44 442"/>
          <path d="M100 460 Q98 450 96 441 M100 460 Q102 451 104 443"/>
          <path d="M160 460 Q158 450 157 440 M160 460 Q162 451 163 442"/>
          <path d="M220 460 Q218 451 217 441 M220 460 Q222 451 223 443"/>
          <path d="M280 460 Q278 450 277 440 M280 460 Q282 451 283 442"/>
          <path d="M340 460 Q338 450 337 440 M340 460 Q342 451 343 442"/>
          <path d="M400 460 Q398 450 397 440 M400 460 Q402 451 403 442"/>
          <path d="M460 460 Q458 450 457 440 M460 460 Q462 451 463 442"/>
          <path d="M520 460 Q518 450 517 441 M520 460 Q522 451 523 443"/>
          <path d="M40 490 Q38 481 37 472 M40 490 Q42 481 44 473"/>
          <path d="M100 490 Q98 481 97 472 M100 490 Q102 481 104 473"/>
          <path d="M160 490 Q158 481 157 472 M160 490 Q162 481 163 473"/>
          <path d="M220 490 Q218 481 217 472 M220 490 Q222 481 223 473"/>
          <path d="M280 490 Q278 481 277 472 M280 490 Q282 481 283 473"/>
          <path d="M340 490 Q338 481 337 472 M340 490 Q342 481 343 473"/>
          <path d="M400 490 Q398 481 397 472 M400 490 Q402 481 403 473"/>
          <path d="M460 490 Q458 481 457 472 M460 490 Q462 481 463 473"/>
          <path d="M520 490 Q518 481 517 472 M520 490 Q522 481 523 473"/>
        </g>
        <!-- 月光水面倒影 -->
        <ellipse cx="420" cy="510" rx="28" ry="8" fill="#c8b860" opacity="0.12"/>
        <ellipse cx="420" cy="510" rx="16" ry="4" fill="#d4c870" opacity="0.18"/>
        <!-- 星星 -->
        <circle cx="80"  cy="60"  r="1"   fill="#f0ede8" opacity="0.7"/>
        <circle cx="150" cy="40"  r="1.2" fill="#f0ede8" opacity="0.6"/>
        <circle cx="200" cy="90"  r="0.8" fill="#f0ede8" opacity="0.5"/>
        <circle cx="60"  cy="120" r="1"   fill="#f0ede8" opacity="0.4"/>
        <circle cx="300" cy="50"  r="1"   fill="#f0ede8" opacity="0.5"/>
        <circle cx="350" cy="30"  r="0.8" fill="#f0ede8" opacity="0.6"/>
        <circle cx="480" cy="140" r="0.8" fill="#f0ede8" opacity="0.4"/>
        <circle cx="510" cy="60"  r="1"   fill="#f0ede8" opacity="0.5"/>
        <circle cx="130" cy="160" r="0.8" fill="#f0ede8" opacity="0.3"/>
        <circle cx="260" cy="130" r="1"   fill="#f0ede8" opacity="0.4"/>
        <!-- 前景田埂 -->
        <path d="M0 600 Q140 588 280 594 Q420 582 560 590 L560 620 L0 620Z" fill="#0d2010" opacity="0.9"/>
        <rect x="0" y="628" width="560" height="52" fill="#08160c"/>
        <!-- 萤火虫 -->
        <circle cx="70"  cy="390" r="1.5" fill="#a0d860" opacity="0.8"/>
        <circle cx="180" cy="370" r="1"   fill="#b0e870" opacity="0.6"/>
        <circle cx="320" cy="385" r="1.5" fill="#90c850" opacity="0.7"/>
        <circle cx="490" cy="375" r="1"   fill="#a8d858" opacity="0.6"/>
        <circle cx="250" cy="410" r="1"   fill="#b0e060" opacity="0.5"/>
        <!-- 底部遮罩 -->
        <rect x="0" y="300" width="560" height="200" fill="#0a1a0f" opacity="0.3"/>
        <rect x="0" y="450" width="300" height="230" fill="#0a1a0f" opacity="0.4"/>
      </svg>

      <!-- 左侧文字 -->
      <div class="art-text">
        <div class="art-logo-mark">
          <svg viewBox="0 0 32 32" fill="none" stroke="#4CAF7D" stroke-width="1.5" width="28" height="28">
            <path d="M16 3C10 8 6 13 6 18a10 10 0 0020 0c0-5-4-10-10-15z"/>
            <line x1="16" y1="16" x2="16" y2="26"/>
            <line x1="11" y1="20" x2="16" y2="16"/>
            <line x1="21" y1="19" x2="16" y2="16"/>
          </svg>
        </div>
        <div class="art-badge">智慧助农电商平台</div>
        <div class="art-divider"></div>
        <h1 class="art-title">让每一粒<em>种子</em><br>都找到归处</h1>
        <p class="art-sub">连接农户与市场，用科技守护<br>每一寸田野的丰收。</p>
      </div>
    </div>

    <!-- 右侧表单 -->
    <div class="form-side">
      <div class="deco-corner"></div>

      <div class="form-inner">
        <div class="form-eyebrow">User Login</div>
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-sub">登录你的账号，继续助农之旅</p>

        <el-form :model="form" ref="formRef" class="login-form">
          <div class="field-wrap">
            <label class="field-label">用户名</label>
            <el-input
              v-model="form.userName"
              class="art-input"
              placeholder="请输入用户名"
              @keyup.enter="onLogin"
            />
          </div>
          <div class="field-wrap">
            <label class="field-label">密码</label>
            <el-input
              v-model="form.passWord"
              class="art-input"
              type="password"
              placeholder="请输入密码"
              show-password
              @keyup.enter="onLogin"
            />
          </div>

          <div class="btn-row">
            <button class="login-btn" :class="{ loading: isLoading }" @click.prevent="onLogin" :disabled="isLoading">
              <span v-if="!isLoading">登 录</span>
              <span v-else class="btn-loading">
                <span class="ldot"></span>
                <span class="ldot"></span>
                <span class="ldot"></span>
              </span>
            </button>
            <span class="reg-link" @click="$router.push('/register')">还没有账号？去注册 →</span>
          </div>
        </el-form>

        <div class="form-footer">
          <div class="stat-item">
            <div class="stat-num">3,420</div>
            <div class="stat-lbl">注册用户</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">286</div>
            <div class="stat-lbl">在售农品</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">12,856</div>
            <div class="stat-lbl">累计订单</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL || ''
const router = useRouter()
const formRef = ref()
const isLoading = ref(false)

const form = ref({
  userName: '',
  passWord: ''
})

const onLogin = async () => {
  if (!form.value.userName || !form.value.passWord) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  isLoading.value = true
  try {
    const res = await axios.post(`${apiUrl}/login`, form.value)
    if (res.data.success) {
      ElMessage.success('登录成功')
      localStorage.setItem('user', JSON.stringify(res.data.user))
      router.push('/')
    } else {
      ElMessage.error(res.data.message || '登录失败')
    }
  } catch (e) {
    ElMessage.error(e.response?.data?.message || '登录失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&display=swap');

// ── 整页布局 ──
.login-page {
  width: 1200px;
  display: flex;
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
  align-items: stretch;
}

// ── 左侧艺术区 ──
.art-side {
  flex: 1;
  position: relative;
  background: #0a1a0f;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 52px 48px;
  min-height: 100vh;
}

.field-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.art-text {
  position: relative;
  z-index: 2;
}

.art-logo-mark {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(77,175,100,0.12);
  border: 1px solid rgba(77,175,100,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.art-badge {
  font-size: 11px;
  letter-spacing: 3px;
  color: #4CAF7D;
  text-transform: uppercase;
  margin-bottom: 18px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.art-divider {
  width: 36px;
  height: 1.5px;
  background: #4CAF7D;
  margin-bottom: 20px;
}

.art-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 40px;
  font-weight: 300;
  color: #f0ede8;
  line-height: 1.35;
  margin-bottom: 18px;

  em {
    font-style: normal;
    color: #6dbe8a;
    font-weight: 400;
  }
}

.art-sub {
  font-size: 13px;
  color: rgba(240, 237, 232, 0.5);
  line-height: 1.9;
  font-family: 'Inter', sans-serif;
}

// ── 右侧表单 ──
.form-side {
  width: 500px;
  flex-shrink: 0;
  background: #fafaf8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100vh;
  overflow-y: auto;
}

.deco-corner {
  position: absolute;
  top: 28px;
  right: 28px;
  width: 40px;
  height: 40px;
  border-top: 1.5px solid #d8d5ce;
  border-right: 1.5px solid #d8d5ce;
  border-radius: 0 4px 0 0;
  pointer-events: none;
}

.form-inner {
  width: 100%;
  padding: 0 52px;
}

.form-eyebrow {
  font-size: 11px;
  letter-spacing: 2.5px;
  color: #b0b0a0;
  text-transform: uppercase;
  margin-bottom: 14px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.form-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 28px;
  font-weight: 400;
  color: #1a1a12;
  margin-bottom: 8px;
  line-height: 1.3;
}

.form-sub {
  font-size: 13px;
  color: #9a9a8a;
  margin-bottom: 40px;
  font-family: 'Inter', sans-serif;
}

// ── 表单字段 ──
.login-form {
  margin-bottom: 0;
}

.field-wrap {
  margin-bottom: 28px;
}

.field-label {
  display: block;
  font-size: 10px;
  letter-spacing: 2px;
  color: #9a9a8a;
  text-transform: uppercase;
  margin-bottom: 10px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

// 覆盖 Element Plus 输入框样式
.art-input {
  :deep(.el-input__wrapper) {
    background: transparent;
    border: none;
    border-radius: 0;
    border-bottom: 1.5px solid #dedad2;
    box-shadow: none !important;
    padding: 4px 0;
    transition: border-color .2s;

    &:hover, &.is-focus {
      border-bottom-color: #2d6a45;
    }
  }

  :deep(.el-input__inner) {
    font-size: 14px;
    color: #1a1a12;
    font-family: 'Inter', sans-serif;
    height: 38px;
    padding: 0;

    &::placeholder {
      color: #c8c8b8;
      font-weight: 300;
    }
  }

  :deep(.el-input__suffix) {
    color: #b0b0a0;
  }
}

// ── 按钮行 ──
.btn-row {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.login-btn {
  height: 46px;
  padding: 0 36px;
  background: #1a3a22;
  color: #f0ede8;
  border: none;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 2px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 2px;
  transition: background .2s, transform .1s;
  flex-shrink: 0;
  min-width: 100px;

  &:hover:not(:disabled) {
    background: #2d6a45;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
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
  0%, 80%, 100% { opacity: .3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.reg-link {
  font-size: 13px;
  color: #9a9a8a;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  transition: all .2s;
  font-family: 'Inter', sans-serif;
  white-space: nowrap;
  padding-bottom: 1px;

  &:hover {
    color: #2d6a45;
    border-bottom-color: #2d6a45;
  }
}

// ── 底部统计 ──
.form-footer {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 1px solid #e8e6e0;
  display: flex;
  align-items: center;
  gap: 0;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-num {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 600;
  color: #1a3a22;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-lbl {
  font-size: 10px;
  letter-spacing: 1px;
  color: #b0b0a0;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: #e0ddd6;
  flex-shrink: 0;
}

// ── 响应式 ──
@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
  }

  .art-side {
    min-height: 280px;
    flex: none;
    padding: 36px 32px;
  }

  .art-title {
    font-size: 28px;
  }

  .form-side {
    width: 100%;
    min-height: auto;
    padding: 40px 0;
  }

  .form-inner {
    padding: 0 32px;
  }
}
</style>