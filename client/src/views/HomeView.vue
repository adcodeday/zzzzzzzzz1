<template>
  <div class="home">

    <!-- 顶部搜索栏 -->
    <div class="topbar">
      <div class="topbar-logo">
        <div class="logo-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f0ede8" stroke-width="1.5" width="18" height="18">
            <path d="M12 2C8 5 4 8 4 13a8 8 0 0016 0c0-5-4-8-8-11z"/>
            <path d="M12 7v8M9 12h6"/>
          </svg>
        </div>
        <span class="logo-text">助农商城</span>
      </div>
      <div class="topbar-search">
        <svg viewBox="0 0 16 16" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="14" height="14" style="flex-shrink:0">
          <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
        </svg>
        <input v-model="searchText" @keyup.enter="onSearch" placeholder="搜索新鲜农产品..." class="search-input"/>
        <button class="search-btn" @click="onSearch">搜索</button>
      </div>
      <div class="topbar-right">
        <div class="cart-trigger" @click="toggleCart">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" width="17" height="17">
            <path d="M1 1h2l2.4 12h9.6l2-8H5"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/>
          </svg>
          <span>购物车</span>
          <span class="cart-badge" v-if="cartItems.length">{{ cartItems.length }}</span>
        </div>
      </div>
    </div>

    <!-- 主体 -->
    <div class="main-layout">

      <!-- 左侧分类 -->
      <aside class="sidebar">
        <div class="sidebar-label">商品分类</div>
        <div
          v-for="cat in [{ id:0, name:'全部商品', icon:'◈' }, ...categories]"
          :key="cat.id"
          :class="['cat-item', { active: activeCategory === cat.id }]"
          @click="filterByCategory(cat.id)"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </div>
      </aside>

      <!-- 右侧内容 -->
      <div class="content-area">

        <!-- 轮播 -->
        <div class="banner-box">
          <div class="banner-slides">
            <div class="banner-slide" v-for="(b,i) in banners" :key="b.id" v-show="i === currentBanner">
              <img :src="b.image" :alt="b.title" class="banner-img"/>
              <div class="banner-overlay">
                <span class="banner-tag">{{ b.tag }}</span>
                <h2 class="banner-title">{{ b.title }}</h2>
                <p class="banner-desc">{{ b.desc }}</p>
              </div>
            </div>
          </div>
          <button class="bn-arrow bn-left"  @click="prevBanner">‹</button>
          <button class="bn-arrow bn-right" @click="nextBanner">›</button>
          <div class="bn-dots">
            <span v-for="(b,i) in banners" :key="b.id" :class="{ active: i === currentBanner }" @click="goToBanner(i)"></span>
          </div>
          <div class="banner-side">
            <div class="side-card side-green">
              <div class="side-tag">新品上市</div>
              <div class="side-title">春季时蔬</div>
              <div class="side-sub">产地直发 · 次日达</div>
              <div class="side-emoji">🥬</div>
            </div>
            <div class="side-card side-amber">
              <div class="side-tag">限时特惠</div>
              <div class="side-title">有机水果</div>
              <div class="side-sub">满99减20元</div>
              <div class="side-emoji">🍊</div>
            </div>
          </div>
        </div>

        <!-- 特色行 -->
        <div class="feature-row">
          <div class="feature-item" v-for="f in features" :key="f.title">
            <div class="fi-icon">
              <svg viewBox="0 0 20 20" fill="none" :stroke="f.color" stroke-width="1.5" width="18" height="18" v-html="f.svg"></svg>
            </div>
            <div>
              <div class="fi-title">{{ f.title }}</div>
              <div class="fi-sub">{{ f.sub }}</div>
            </div>
          </div>
        </div>

        <!-- 商品区 -->
        <div class="product-section">
          <div class="ps-header">
            <div class="ps-title-wrap">
              <div class="ps-accent"></div>
              <span class="ps-title">{{ activeCategory === 0 ? '全部商品' : categories.find(c=>c.id===activeCategory)?.name }}</span>
              <span class="ps-count">{{ filteredProducts.length }} 件</span>
            </div>
            <div class="sort-row">
              <button
                v-for="s in sorts" :key="s.key"
                :class="['sort-btn', { active: currentSort === s.key }]"
                @click="currentSort = s.key"
              >{{ s.label }}</button>
            </div>
          </div>

          <div v-if="loading" class="state-wrap">
            <div class="spinner"></div>
            <p>正在加载农产品...</p>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="state-wrap">
            <svg viewBox="0 0 48 48" fill="none" stroke="#c8c8b8" stroke-width="1.5" width="48" height="48">
              <path d="M24 4C14 10 8 18 8 26a16 16 0 0032 0c0-8-6-16-16-22z"/>
            </svg>
            <p style="color:#9a9a8a;margin-top:8px">暂无相关农产品</p>
          </div>

          <div v-else class="product-grid">
            <div class="product-card" v-for="p in sortedProducts" :key="p.id">
              <div class="pc-badges">
                <span v-if="p.tags && p.tags.includes('热销')" class="badge-hot">热销</span>
                <span v-if="p.tags && p.tags.includes('新品')" class="badge-new">新品</span>
              </div>
              <div class="pc-img-wrap">
                <img :src="p.image" :alt="p.name" class="pc-img"/>
                <div class="pc-overlay">
                  <button class="overlay-btn" @click="addToCart(p)">加入购物车</button>
                </div>
              </div>
              <div class="pc-info">
                <div class="pc-name">{{ p.name }}</div>
                <div class="pc-amount" v-if="p.amount">{{ p.amount }}</div>
                <div class="pc-price-row">
                  <span class="pc-price">¥{{ p.price }}</span>
                  <span class="pc-origin" v-if="p.originalPrice > p.price">¥{{ p.originalPrice }}</span>
                </div>
                <div class="pc-footer">
                  <span class="pc-sales">已售 {{ p.sales }}</span>
                  <button class="pc-add-btn" @click="addToCart(p)">
                    <svg viewBox="0 0 12 12" fill="none" stroke="white" stroke-width="2" width="10" height="10"><line x1="6" y1="1" x2="6" y2="11"/><line x1="1" y1="6" x2="11" y2="6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮购物车 -->
    <div class="float-cart" @click="toggleCart">
      <svg viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="1.5" width="18" height="18">
        <path d="M1 1h2l2.4 12h9.6l2-8H5"/><circle cx="9" cy="17" r="1" fill="white" stroke="none"/><circle cx="15" cy="17" r="1" fill="white" stroke="none"/>
      </svg>
      <span class="float-badge" v-if="cartItems.length">{{ cartItems.length }}</span>
    </div>

    <!-- 遮罩 -->
    <div class="cart-mask" :class="{ show: isCartVisible }" @click="toggleCart"></div>

    <!-- 购物车抽屉 -->
    <div class="cart-drawer" :class="{ open: isCartVisible }">
      <div class="cd-header">
        <span class="cd-title">购物车</span>
        <button class="cd-close" @click="toggleCart">
          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" width="12" height="12"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
        </button>
      </div>

      <div v-if="cartItems.length" class="cd-body">
        <div class="cd-list">
          <div class="cd-item" v-for="item in cartItems" :key="item.id">
            <div class="cdi-info">
              <div class="cdi-name">{{ item.name }}</div>
              <div class="cdi-price">¥{{ item.price }} / 件</div>
            </div>
            <div class="cdi-ctrl">
              <button class="ctrl-btn" @click="updateQuantity(item.id, -1)">−</button>
              <span class="ctrl-num">{{ item.quantity }}</span>
              <button class="ctrl-btn" @click="updateQuantity(item.id, 1)">+</button>
            </div>
            <div class="cdi-sub">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
            <button class="cdi-del" @click="removeFromCart(item.id)">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" width="11" height="11"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
            </button>
          </div>
        </div>
        <div class="cd-footer">
          <div class="cd-summary">
            <span>共 {{ cartItems.reduce((s,i) => s+i.quantity,0) }} 件</span>
            <span class="cd-total">合计 <em>¥{{ cartTotal.toFixed(2) }}</em></span>
          </div>
          <button class="cd-checkout" @click="showPaymentModal">去结算</button>
        </div>
      </div>

      <div v-else class="cd-empty">
        <svg viewBox="0 0 48 48" fill="none" stroke="#ddd" stroke-width="1.5" width="48" height="48">
          <path d="M4 4h5l6 28h22l5-20H14"/><circle cx="20" cy="40" r="2.5" fill="#ddd" stroke="none"/><circle cx="34" cy="40" r="2.5" fill="#ddd" stroke="none"/>
        </svg>
        <p>购物车是空的</p>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div class="pay-mask" v-if="showModal" @click.self="closeModal">
      <div class="pay-modal">
        <div class="pm-header">
          <span class="pm-title">扫码支付</span>
          <button class="pm-close" @click="closeModal">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" width="12" height="12"><line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/></svg>
          </button>
        </div>
        <img src="../assets/png/shou.jpg" alt="收款码" class="pm-qr"/>
        <div class="pm-amount">
          <span class="pm-label">支付金额</span>
          <span class="pm-price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
        <p class="pm-tip">请使用微信 / 支付宝扫码完成支付</p>
        <div class="pm-actions">
          <button class="pm-cancel" @click="closeModal">取消</button>
          <button class="pm-confirm" @click="completePayment" :disabled="paying">
            {{ paying ? '处理中...' : '已完成支付' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL
const searchText     = ref('')
const activeCategory = ref(0)
const currentBanner  = ref(0)
const currentSort    = ref('default')
const showModal      = ref(false)
const totalPrice     = ref(0)
const paying         = ref(false)
const isCartVisible  = ref(false)
const products       = ref([])
const loading        = ref(false)
const cartItems      = ref([])
let bannerTimer = null

const banners = [
  { id:1, tag:'产地直发', title:'新鲜时令蔬菜', desc:'每日清晨采摘 · 冷链直达您家',
    image:'https://img14.360buyimg.com/jdcms/s480x480_jfs/t1/281446/9/26519/84223/680aecd4F98b9ab3f/d9ab87124113aab7.jpg.avif' },
  { id:2, tag:'限时特惠', title:'有机水果精选', desc:'无农药残留 · 健康好滋味',
    image:'https://img30.360buyimg.com/jdcms/s480x480_jfs/t1/271088/1/28044/246693/680ae6e0F51787a5f/5b791bff8b26a8d2.jpg.avif' },
  { id:3, tag:'农家好货', title:'土鸡蛋礼盒装', desc:'散养土鸡 · 营养更丰富',
    image:'https://img30.360buyimg.com/jdcms/s480x480_jfs/t1/271465/17/10177/97665/67e36179F26d37c5d/b159286121a51756.jpg.avif' },
  { id:4, tag:'新品上市', title:'云南高原蜂蜜', desc:'百花酿造 · 原味纯正',
    image:'https://img20.360buyimg.com/jdcms/s480x480_jfs/t1/270478/39/27925/150115/680aed67F3ac8a8b6/ed84c79b11dedc9f.jpg.avif' },
]

const categories = [
  { id:1, name:'水果', icon:'🍎' }, { id:2, name:'蔬菜', icon:'🥦' },
  { id:3, name:'粮油', icon:'🌾' }, { id:4, name:'禽蛋', icon:'🥚' },
  { id:5, name:'水产', icon:'🐟' }, { id:6, name:'坚果', icon:'🥜' },
  { id:7, name:'蜂蜜', icon:'🍯' }, { id:8, name:'茶叶', icon:'🍵' },
  { id:9, name:'特产', icon:'🎁' }, { id:10, name:'干货', icon:'🍄' },
]

const features = [
  { title:'极速配送', sub:'次日达 · 冷链保鲜', color:'#2d6a45',
    svg:'<path d="M13 2H7L4 8h4l-2 9 9-10H11l2-6z"/>' },
  { title:'产地直发', sub:'源头品控 · 品质保证', color:'#185FA5',
    svg:'<circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 3"/>'},
  { title:'七天退换', sub:'无忧购物 · 放心下单', color:'#BA7517',
    svg:'<path d="M3 10a7 7 0 1013 0M3 10L1 8m2 2l2-2"/>' },
  { title:'安全支付', sub:'多种方式 · 全程加密', color:'#993556',
    svg:'<rect x="2" y="5" width="16" height="12" rx="2"/><path d="M6 5V3a4 4 0 018 0v2"/>' },
  { title:'专属客服', sub:'7×12h · 在线答疑', color:'#3C3489',
    svg:'<path d="M14 9a5 5 0 00-10 0v2a5 5 0 0010 0V9z"/><path d="M3 11H2a1 1 0 00-1 1v1a1 1 0 001 1h1M17 11h1a1 1 0 011 1v1a1 1 0 01-1 1h-1"/>'},
]

const sorts = [
  { key:'default',    label:'综合' },
  { key:'price_asc',  label:'价格↑' },
  { key:'price_desc', label:'价格↓' },
  { key:'sales',      label:'销量' },
]

const filteredProducts = computed(() => {
  const list = products.value
  if (!searchText.value) return list
  return list.filter(p => p.name.toLowerCase().includes(searchText.value.toLowerCase()))
})

const sortedProducts = computed(() => {
  const list = [...filteredProducts.value]
  if (currentSort.value === 'price_asc')  return list.sort((a,b) => a.price - b.price)
  if (currentSort.value === 'price_desc') return list.sort((a,b) => b.price - a.price)
  if (currentSort.value === 'sales')      return list.sort((a,b) => b.sales - a.sales)
  return list
})

const cartTotal = computed(() => cartItems.value.reduce((s,i) => s + i.price * i.quantity, 0))

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiUrl}/tables/products`)
    const approved = (res.data.data || []).filter(p => p.audit_status === 1)
    products.value = activeCategory.value === 0
      ? approved
      : approved.filter(p => p.categoryId === activeCategory.value)
  } catch {}
  finally { loading.value = false }
}

const filterByCategory = async (id) => { activeCategory.value = id; await fetchProducts() }
const onSearch = () => { activeCategory.value = 0 }
const nextBanner = () => { currentBanner.value = (currentBanner.value + 1) % banners.length }
const prevBanner = () => { currentBanner.value = (currentBanner.value - 1 + banners.length) % banners.length }
const goToBanner = (i) => { currentBanner.value = i }
const toggleCart = () => { isCartVisible.value = !isCartVisible.value }

const addToCart = (p) => {
  const ex = cartItems.value.find(i => i.id === p.id)
  if (ex) { ex.quantity++ } else { cartItems.value.push({ id:p.id, name:p.name, price:p.price, quantity:1 }) }
}
const updateQuantity = (id, d) => {
  const item = cartItems.value.find(i => i.id === id)
  if (item) { item.quantity += d; if (item.quantity <= 0) removeFromCart(id) }
}
const removeFromCart = (id) => {
  const idx = cartItems.value.findIndex(i => i.id === id)
  if (idx !== -1) cartItems.value.splice(idx, 1)
}

const showPaymentModal = () => { totalPrice.value = cartTotal.value; showModal.value = true }
const closeModal = () => { showModal.value = false }

const completePayment = async () => {
  if (paying.value) return
  paying.value = true
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    for (const item of cartItems.value) {
      await axios.post(`${apiUrl}/tables/orders`, {
        user_id: user.id,
        goods: `${item.name} x${item.quantity}`,
        buyer: user.nickName || user.userName,
        seller: '助农平台',
        order_time: new Date().toISOString().slice(0,19).replace('T',' '),
        order_amount: item.price * item.quantity,
        order_status: 1
      })
    }
    showModal.value = false
    cartItems.value = []
    isCartVisible.value = false
    alert('支付成功！订单已生成，可在订单管理中查看')
  } catch { alert('订单生成失败，请联系客服') }
  finally { paying.value = false }
}

onMounted(() => { fetchProducts(); bannerTimer = setInterval(nextBanner, 4000) })
onUnmounted(() => { if (bannerTimer) clearInterval(bannerTimer) })
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&family=Inter:wght@300;400;500&display=swap');
* { box-sizing: border-box; }

.home {
  margin-top: -60px;
  margin-left: -5vw;
  margin-right: -5vw;
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* ── 顶部搜索栏 ── */
.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 58px;
  background: white;
  border-bottom: 1px solid #eeebe4;
  position: sticky;
  top: 60px;
  z-index: 200;
}

.topbar-logo { display: flex; align-items: center; gap: 9px; flex-shrink: 0; }

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #1a3a22;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  font-weight: 400;
  color: #1a1a12;
  letter-spacing: .5px;
}

.topbar-search {
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #faf9f6;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  padding: 0 4px 0 12px;
  transition: border-color .2s;
  &:focus-within { border-color: #2d6a45; background: white; }
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  padding: 10px 0;
  font-family: 'Inter', sans-serif;
  color: #1a1a12;
  &::placeholder { color: #c8c8b8; }
}

.search-btn {
  background: #1a3a22;
  color: #f0ede8;
  border: none;
  padding: 7px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 3px;
  transition: background .2s;
  letter-spacing: .5px;
  &:hover { background: #2d6a45; }
}

.topbar-right { margin-left: auto; }

.cart-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #4a4a3a;
  position: relative;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}

.cart-badge {
  position: absolute;
  top: -6px; right: -6px;
  background: #BA7517;
  color: white;
  border-radius: 50%;
  width: 18px; height: 18px;
  font-size: 10px;
  font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
}

/* ── 主体布局 ── */
.main-layout {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 16px;
  gap: 16px;
}

/* ── 左侧分类 ── */
.sidebar {
  width: 128px;
  flex-shrink: 0;
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 12px 8px;
  height: fit-content;
  position: sticky;
  top: 120px;
}

.sidebar-label {
  font-size: 10px;
  letter-spacing: 1.5px;
  color: #b0b0a0;
  text-transform: uppercase;
  padding: 4px 8px 10px;
  font-weight: 500;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all .15s;
  &:hover { background: #f5faf5; }
  &.active { background: #EAF3DE; .cat-name { color: #2d6a45; font-weight: 500; } }
}

.cat-icon { font-size: 14px; width: 18px; text-align: center; }
.cat-name { font-size: 12px; color: #4a4a3a; }

/* ── 内容区 ── */
.content-area { flex: 1; min-width: 0; }

/* ── 轮播 ── */
.banner-box {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  position: relative;
}

.banner-slides {
  flex: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  min-height: 220px;
}

.banner-slide { position: relative; width: 100%; }

.banner-img {
  width: 100%; height: 220px;
  object-fit: cover; display: block;
}

.banner-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 24px 20px 18px;
  background: linear-gradient(to top, rgba(10,26,15,0.7), transparent);
  color: white;
}

.banner-tag {
  display: inline-block;
  background: #2d6a45;
  padding: 2px 9px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: .5px;
  margin-bottom: 7px;
}

.banner-title { font-family: 'Noto Serif SC', serif; font-size: 20px; font-weight: 400; margin: 0 0 4px; }
.banner-desc  { font-size: 12px; opacity: .8; margin: 0; }

.bn-arrow {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  background: rgba(255,255,255,0.9);
  border: none; cursor: pointer;
  width: 30px; height: 30px; border-radius: 50%;
  font-size: 18px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s; z-index: 2;
  &:hover { background: white; transform: translateY(-50%) scale(1.1); }
}
.bn-left  { left: 10px; }
.bn-right { right: 148px; }

.bn-dots {
  position: absolute;
  bottom: 12px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 5px; z-index: 2;
  span {
    width: 5px; height: 5px; border-radius: 50%;
    background: rgba(255,255,255,0.5); cursor: pointer;
    transition: all .3s;
    &.active { background: white; width: 14px; border-radius: 3px; }
  }
}

.banner-side {
  width: 136px;
  display: flex; flex-direction: column; gap: 10px; flex-shrink: 0;
}

.side-card {
  flex: 1;
  border-radius: 10px;
  padding: 14px 12px;
  position: relative; overflow: hidden;
  cursor: pointer;
  transition: transform .2s;
  &:hover { transform: translateY(-2px); }
}
.side-green { background: #EAF3DE; }
.side-amber { background: #FAEEDA; }

.side-tag   { font-size: 10px; font-weight: 600; color: #2d6a45; background: rgba(255,255,255,0.6); padding: 2px 7px; border-radius: 10px; display: inline-block; margin-bottom: 6px; }
.side-amber .side-tag { color: #854F0B; }
.side-title { font-size: 13px; font-weight: 600; color: #1a1a12; margin-bottom: 3px; }
.side-sub   { font-size: 10px; color: #7a7a6a; }
.side-emoji { position: absolute; right: 8px; bottom: 8px; font-size: 28px; opacity: .65; }

/* ── 特色行 ── */
.feature-row {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.feature-item {
  flex: 1;
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 11px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fi-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #faf9f6;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.fi-title { font-size: 12px; font-weight: 500; color: #1a1a12; }
.fi-sub   { font-size: 10px; color: #9a9a8a; margin-top: 1px; }

/* ── 商品区 ── */
.product-section {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 16px;
}

.ps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ps-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ps-accent {
  width: 3px; height: 16px;
  background: #2d6a45;
  border-radius: 2px;
}

.ps-title { font-family: 'Noto Serif SC', serif; font-size: 16px; font-weight: 400; color: #1a1a12; }
.ps-count { font-size: 12px; color: #b0b0a0; }

.sort-row { display: flex; gap: 4px; }

.sort-btn {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: #7a7a6a;
  background: #faf9f6;
  border: 1px solid #e8e5de;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
  &.active { background: #1a3a22; border-color: #1a3a22; color: #f0ede8; }
}

/* ── 加载/空状态 ── */
.state-wrap {
  text-align: center;
  padding: 50px 0;
  color: #b0b0a0;
  font-size: 13px;
}

.spinner {
  width: 32px; height: 32px;
  border: 2px solid #eeebe4;
  border-top-color: #2d6a45;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── 商品网格 ── */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(162px, 1fr));
  gap: 12px;
}

.product-card {
  background: #faf9f6;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all .2s;
  cursor: pointer;
  &:hover {
    border-color: #c8d8c0;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.07);
    .pc-overlay { opacity: 1; }
    .pc-img { transform: scale(1.05); }
  }
}

.pc-badges {
  position: absolute;
  top: 7px; left: 7px;
  display: flex; gap: 4px;
  z-index: 2;
}

.badge-hot { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; background: #FAECE7; color: #993C1D; }
.badge-new { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; background: #EAF3DE; color: #3B6D11; }

.pc-img-wrap { width: 100%; height: 152px; overflow: hidden; position: relative; }
.pc-img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }

.pc-overlay {
  position: absolute; inset: 0;
  background: rgba(10,26,15,0.4);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity .2s;
}

.overlay-btn {
  background: white; color: #1a3a22;
  border: none; padding: 7px 14px;
  border-radius: 3px; font-size: 12px; font-weight: 500;
  cursor: pointer; font-family: 'Inter', sans-serif;
  &:hover { background: #EAF3DE; }
}

.pc-info { padding: 10px 11px 11px; }
.pc-name {
  font-size: 13px; color: #1a1a12; font-weight: 500;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  min-height: 34px; margin-bottom: 4px;
}
.pc-amount { font-size: 10px; color: #b0b0a0; margin-bottom: 6px; }
.pc-price-row { display: flex; align-items: baseline; gap: 5px; margin-bottom: 8px; }
.pc-price  { font-size: 16px; font-weight: 600; color: #BA7517; }
.pc-origin { font-size: 10px; color: #ccc; text-decoration: line-through; }
.pc-footer { display: flex; align-items: center; justify-content: space-between; }
.pc-sales  { font-size: 10px; color: #b0b0a0; }

.pc-add-btn {
  width: 24px; height: 24px; border-radius: 50%;
  background: #1a3a22; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .15s;
  &:hover { background: #2d6a45; }
}

/* ── 悬浮购物车 ── */
.float-cart {
  position: fixed; right: 22px; bottom: 22px;
  width: 48px; height: 48px; border-radius: 50%;
  background: #1a3a22;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(26,58,34,0.4);
  z-index: 100;
  transition: all .2s;
  &:hover { background: #2d6a45; transform: scale(1.08); }
}

.float-badge {
  position: absolute; top: -4px; right: -4px;
  background: #BA7517; color: white;
  border-radius: 50%; width: 18px; height: 18px;
  font-size: 10px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid white;
}

/* ── 购物车遮罩 & 抽屉 ── */
.cart-mask {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.25); z-index: 300;
  opacity: 0; pointer-events: none; transition: opacity .3s;
  &.show { opacity: 1; pointer-events: all; }
}

.cart-drawer {
  position: fixed; top: 0; right: -400px; bottom: 0;
  width: 380px; background: white;
  border-left: 1px solid #eeebe4;
  z-index: 400; transition: right .3s ease;
  display: flex; flex-direction: column;
  &.open { right: 0; }
}

.cd-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #eeebe4;
  background: #faf9f6;
}

.cd-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px; font-weight: 400; color: #1a1a12;
}

.cd-close {
  width: 28px; height: 28px; border-radius: 50%;
  background: none; border: 1px solid #e8e5de;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #9a9a8a;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}

.cd-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.cd-list { flex: 1; overflow-y: auto; padding: 12px 16px; }

.cd-item {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 0; border-bottom: 1px solid #f5f3ee;
  &:last-child { border-bottom: none; }
}

.cdi-info { flex: 1; min-width: 0; }
.cdi-name  { font-size: 13px; font-weight: 500; color: #1a1a12; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cdi-price { font-size: 11px; color: #9a9a8a; margin-top: 2px; }

.cdi-ctrl { display: flex; align-items: center; gap: 6px; }

.ctrl-btn {
  width: 22px; height: 22px;
  border: 1px solid #e8e5de; background: white;
  border-radius: 4px; cursor: pointer;
  font-size: 13px; display: flex; align-items: center; justify-content: center;
  transition: all .15s;
  &:hover { border-color: #2d6a45; color: #2d6a45; }
}

.ctrl-num { font-size: 13px; font-weight: 600; min-width: 16px; text-align: center; }
.cdi-sub  { font-size: 13px; font-weight: 600; color: #BA7517; min-width: 58px; text-align: right; }

.cdi-del {
  background: none; border: none; cursor: pointer;
  color: #c8c8b8; padding: 4px;
  transition: color .15s;
  &:hover { color: #E24B4A; }
}

.cd-footer {
  padding: 14px 20px;
  border-top: 1px solid #eeebe4;
  background: #faf9f6;
}

.cd-summary {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 12px; font-size: 13px; color: #6a6a5a;
}

.cd-total {
  font-size: 13px; color: #1a1a12;
  em { font-style: normal; font-size: 18px; font-weight: 600; color: #BA7517; }
}

.cd-checkout {
  width: 100%; padding: 11px;
  background: #1a3a22; color: #f0ede8;
  border: none; border-radius: 4px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: 'Inter', sans-serif;
  letter-spacing: .5px;
  transition: background .15s;
  &:hover { background: #2d6a45; }
}

.cd-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: #9a9a8a; font-size: 13px; gap: 10px;
}

/* ── 支付弹窗 ── */
.pay-mask {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45); z-index: 500;
  display: flex; align-items: center; justify-content: center;
}

.pay-modal {
  background: white; border-radius: 10px; padding: 28px;
  width: 300px; text-align: center;
  border: 1px solid #eeebe4;
}

.pm-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 16px;
}

.pm-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px; font-weight: 400; color: #1a1a12;
}

.pm-close {
  width: 26px; height: 26px; border-radius: 50%;
  background: none; border: 1px solid #e8e5de;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #9a9a8a;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}

.pm-qr { width: 170px; height: 170px; border-radius: 8px; border: 1px solid #eeebe4; margin-bottom: 14px; }

.pm-amount { display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 6px; }
.pm-label  { font-size: 12px; color: #9a9a8a; }
.pm-price  { font-size: 24px; font-weight: 600; color: #BA7517; }
.pm-tip    { font-size: 11px; color: #b0b0a0; margin-bottom: 18px; }

.pm-actions { display: flex; gap: 8px; }

.pm-cancel, .pm-confirm {
  flex: 1; padding: 10px; border-radius: 4px;
  font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif;
  transition: all .15s;
}

.pm-cancel  { border: 1px solid #e8e5de; background: white; color: #6a6a5a; &:hover { border-color: #c8c8b8; } }
.pm-confirm {
  border: none; background: #1a3a22; color: #f0ede8; font-weight: 500;
  &:hover { background: #2d6a45; }
  &:disabled { opacity: .6; cursor: not-allowed; }
}

/* ── 响应式 ── */
@media (max-width: 900px) {
  .sidebar     { display: none; }
  .banner-side { display: none; }
  .feature-row { flex-wrap: wrap; .feature-item { flex: 1 1 45%; } }
  .bn-right    { right: 10px; }
}

@media (max-width: 600px) {
  .main-layout   { padding: 12px 10px; }
  .product-grid  { grid-template-columns: repeat(2,1fr); gap: 8px; }
  .cart-drawer   { width: 100%; }
  .topbar-right  { display: none; }
}
</style>