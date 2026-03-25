<template>
  <div class="farm-assistant">

    <!-- 非登录/注册页才显示导航栏 -->
    <header v-if="user && !isAuthPage">
      <h1 class="logo">智慧助农电商平台</h1>
      <button v-if="isMobile" class="menu-toggle" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav :class="{ 'mobile-menu': isMobile, open: menuOpen }">
        <RouterLink to="/" @click="menuOpen = false">首页</RouterLink>
        <RouterLink v-if="user.authority == 0||user.authority == 1" to="/products" @click="menuOpen = false">农产品管理</RouterLink>
        <RouterLink v-if="user.authority == 0" to="/farmers" @click="menuOpen = false">用户管理</RouterLink>
        <RouterLink to="/tasks" @click="menuOpen = false">助农社区</RouterLink>
        <RouterLink to="/orders" @click="menuOpen = false">订单管理</RouterLink>
        <RouterLink to="/statistics" @click="menuOpen = false">数据统计</RouterLink>
        <RouterLink to="/news" @click="menuOpen = false">问题咨询</RouterLink>
        <RouterLink to="/personal" @click="menuOpen = false">个人中心</RouterLink>
        <RouterLink to="#" @click="showLogoutConfirm" class="logout-link">退出登录</RouterLink>
      </nav>
    </header>

    <main :class="{
      'main-home':       isHome,
      'main-auth':       isAuthPage,
      'main-fullscreen': isFullscreen
    }">
      <RouterView />
    </main>

    <!-- 退出登录确认弹窗 -->
    <el-dialog v-model="logoutDialogVisible" title="确认退出" width="30%" center>
      <span>确定要退出登录吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="logoutDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmLogout">确认退出</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { ElMessage } from 'element-plus'

const isMobile            = ref(false)
const menuOpen            = ref(false)
const user                = ref(null)
const router              = useRouter()
const route               = useRoute()
const logoutDialogVisible = ref(false)

// 首页不加 padding
const isHome = computed(() => route.path === '/')

// 登录 / 注册页：隐藏 header，margin-top 归零
const isAuthPage = computed(() =>
  route.path === '/login' || route.path === '/register'
)

// 需要撑满剩余高度的页面（社区、咨询）
const isFullscreen = computed(() =>
  route.path === '/tasks' || route.path === '/news'
)

const checkScreenSize = () => { isMobile.value = window.innerWidth < 768 }

const showLogoutConfirm = (event) => {
  event.preventDefault()
  logoutDialogVisible.value = true
  if (isMobile.value) menuOpen.value = false
}

const confirmLogout = () => {
  logout()
  logoutDialogVisible.value = false
}

const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  ElMessage.success('已退出登录')
  router.push('/login')
}

const toggleMenu = () => { menuOpen.value = !menuOpen.value }

// 路由切换时同步 user（登录后 header 立即出现）
watch(() => route.path, () => {
  const s = localStorage.getItem('user')
  user.value = s ? JSON.parse(s) : null
})

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  const s = localStorage.getItem('user')
  if (s) user.value = JSON.parse(s)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped lang="scss">
.farm-assistant {
  max-width: 100%;
  margin: 0;
  padding: 0;
}

/* ── 导航栏 ── */
header {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  height: 60px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  z-index: 1000;
}

.logo {
  font-size: 1.2rem;
  font-weight: bold;
  color: #42b983;
  margin-right: 30px;
  white-space: nowrap;
}

nav a {
  margin-left: 4px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  &:hover { background: #f0faf5; color: #42b983; }
}

nav a.router-link-exact-active {
  color: #42b983;
  font-weight: bold;
  background: rgba(66,185,131,0.1);
}

/* ── main 区域 ── */

/* 默认：header 下方，有内边距 */
main {
  margin-top: 60px;
  padding: 24px 5%;
  min-height: calc(100vh - 60px);
  background: #f3f6f3;
}

/* 首页：铺满，无 padding */
main.main-home {
  padding: 0;
  margin-top: 60px;
  background: transparent;
}

/* 登录 / 注册页：完全脱离 header，撑满全屏 */
main.main-auth {
  margin-top: 0 !important;
  padding: 0 !important;
  min-height: 100vh;
  background: transparent;
}

/* 社区 / 咨询页：去掉 padding，交由子组件自己控制高度 */
main.main-fullscreen {
  padding: 0;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
  background: #f3f6f3;
}
/* ── 移动端 ── */

/* ── 退出登录 ── */
.logout-link {
  color: #f56c6c !important;
  font-weight: 500;
  background: transparent !important;
  &:hover { background: rgba(245,108,108,0.1) !important; color: #f56c6c !important; }
}
.mobile-menu .logout-link {
  margin: 0; padding: 12px 20px;
  border-bottom: 1px solid #eee; border-radius: 0;
}

/* ── 弹窗 ── */
.dialog-footer { display: flex; justify-content: center; gap: 20px; margin-top: 10px; }

:deep(.el-dialog__header) {
  text-align: center; font-weight: bold;
  border-bottom: 1px solid #eee; padding-bottom: 15px;
}
:deep(.el-dialog__body) { text-align: center; padding: 30px 20px; font-size: 16px; }
</style>