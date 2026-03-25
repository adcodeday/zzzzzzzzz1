<template>
  <div class="orders-page">

    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">订单管理</h2>
        <p class="page-sub">
          {{ isAdmin ? '平台全部交易记录' : isFarmer ? '购买我农产品的订单' : '我的购买记录' }}
        </p>
      </div>
      <div class="header-right">
        <div class="search-wrap">
          <svg viewBox="0 0 16 16" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="14" height="14" style="flex-shrink:0">
            <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
          </svg>
          <input v-model="searchKeyword" class="search-input" placeholder="搜索订单、商品、买家..."/>
        </div>
        <button v-if="isAdmin" class="add-btn" @click="handleAdd">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
          </svg>
          新增订单
        </button>
      </div>
    </div>

    <!-- 统计卡片（买家 / 农户） -->
    <div v-if="!isAdmin" class="stat-row">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg }">
          <svg viewBox="0 0 20 20" fill="none" :stroke="s.color" stroke-width="1.5" width="18" height="18" v-html="s.svg"></svg>
        </div>
        <div>
          <div class="stat-val" :style="{ color: s.color }">{{ s.val }}</div>
          <div class="stat-lbl">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <!-- 状态筛选 Tab -->
    <div class="filter-tabs">
      <button
        v-for="t in statusTabs"
        :key="t.value"
        :class="['filter-tab', { active: activeStatus === t.value }]"
        @click="activeStatus = t.value"
      >
        {{ t.label }}
        <span v-if="t.value !== -1 && statusCount(t.value)" class="tab-count">{{ statusCount(t.value) }}</span>
      </button>
    </div>

    <!-- 管理员：用户展开表格 -->
    <div v-if="isAdmin" class="table-wrap">
      <el-table :data="filteredUsers" border stripe v-loading="loading" class="art-table">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-orders">
              <div class="expand-title">{{ row.nickName || row.userName }} 的订单</div>
              <el-empty v-if="getUserOrders(row.id).length === 0" description="暂无订单" :image-size="50"/>
              <el-table v-else :data="getUserOrders(row.id)" border class="inner-table">
                <el-table-column prop="order_id" label="订单号" width="80"/>
                <el-table-column prop="goods" label="商品" min-width="140" show-overflow-tooltip/>
                <el-table-column prop="buyer" label="买家" width="100"/>
                <el-table-column prop="seller" label="卖家" width="100"/>
                <el-table-column label="时间" width="150">
                  <template #default="{ row }">{{ formatDate(row.order_time) }}</template>
                </el-table-column>
                <el-table-column label="金额" width="100">
                  <template #default="{ row }">
                    <span class="money">¥{{ Number(row.order_amount).toFixed(2) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="110">
                  <template #default="{ row }">
                    <span :class="['status-pill', 'status-' + row.order_status]">{{ statusText(row.order_status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130" fixed="right">
                  <template #default="{ row }">
                    <button class="tbl-btn edit" @click="handleEdit(row)">编辑</button>
                    <button class="tbl-btn del"  @click="handleDelete(row)">删除</button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column label="用户" width="180">
          <template #default="{ row }">
            <div class="user-cell">
              <div class="user-avatar" :style="avatarStyle(row.nickName || row.userName)">
                {{ (row.nickName || row.userName || '?')[0] }}
              </div>
              <span>{{ row.nickName || row.userName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tel" label="电话" width="130"/>
        <el-table-column prop="local" label="地区" width="120" show-overflow-tooltip/>
        <el-table-column label="订单统计" min-width="200">
          <template #default="{ row }">
            <span class="order-count">
              共 <b>{{ getUserOrders(row.id).length }}</b> 单 &nbsp;
              合计 <b class="money">¥{{ getUserOrders(row.id).reduce((s,o) => s + Number(o.order_amount||0), 0).toFixed(2) }}</b>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110" fixed="right">
          <template #default="{ row }">
            <button class="tbl-btn edit" @click="handleAddOrderForUser(row)">新增订单</button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 农户：接单视图 -->
    <div v-else-if="isFarmer">
      <el-empty v-if="filteredOrders.length === 0" description="暂无相关订单" :image-size="80"/>
      <div v-else class="order-cards">
        <div class="order-card farmer-card" v-for="order in filteredOrders" :key="order.order_id">
          <div class="card-head">
            <div class="card-id">
              <svg viewBox="0 0 14 14" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="13" height="13">
                <rect x="1" y="2" width="12" height="10" rx="1.5"/>
                <line x1="4" y1="6" x2="10" y2="6"/><line x1="4" y1="9" x2="8" y2="9"/>
              </svg>
              <span>No.{{ order.order_id }}</span>
            </div>
            <span :class="['status-pill', 'status-' + order.order_status]">{{ statusText(order.order_status) }}</span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">商品</span>
              <span class="card-val">{{ order.goods || '—' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">买家</span>
              <span class="card-val">{{ order.buyer || '—' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">下单时间</span>
              <span class="card-val">{{ formatDate(order.order_time) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">金额</span>
              <span class="card-val money large">¥{{ Number(order.order_amount).toFixed(2) }}</span>
            </div>
          </div>
          <!-- 农户操作按钮 -->
          <div class="card-actions" v-if="farmerCanOperate(order)">
            <button
              v-if="order.order_status === 1"
              class="action-btn-filled green"
              @click="updateOrderStatus(order, 2)"
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="white" stroke-width="1.5" width="12" height="12">
                <path d="M1 7h9M7 4l3 3-3 3"/>
              </svg>
              确认发货
            </button>
            <button
              v-if="order.order_status === 2"
              class="action-btn-filled blue"
              @click="updateOrderStatus(order, 3)"
            >已发货，等待签收</button>
            <span v-if="order.order_status === 3" class="status-hint">买家签收后自动完成</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 买家：卡片列表 -->
    <div v-else>
      <el-empty v-if="filteredOrders.length === 0" description="暂无相关订单" :image-size="80"/>
      <div v-else class="order-cards">
        <div class="order-card" v-for="order in filteredOrders" :key="order.order_id">
          <div class="card-head">
            <div class="card-id">
              <svg viewBox="0 0 14 14" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="13" height="13">
                <rect x="1" y="2" width="12" height="10" rx="1.5"/>
                <line x1="4" y1="6" x2="10" y2="6"/><line x1="4" y1="9" x2="8" y2="9"/>
              </svg>
              <span>No.{{ order.order_id }}</span>
            </div>
            <span :class="['status-pill', 'status-' + order.order_status]">{{ statusText(order.order_status) }}</span>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">商品</span>
              <span class="card-val">{{ order.goods || '—' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">卖家</span>
              <span class="card-val">{{ order.seller || '—' }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">下单时间</span>
              <span class="card-val">{{ formatDate(order.order_time) }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">金额</span>
              <span class="card-val money large">¥{{ Number(order.order_amount).toFixed(2) }}</span>
            </div>
          </div>
          <!-- 买家操作：待付款可取消，已发货可签收 -->
          <div class="card-actions">
            <button
              v-if="order.order_status === 0"
              class="action-btn-outlined red"
              @click="buyerCancelOrder(order)"
            >取消订单</button>
            <button
              v-if="order.order_status === 2"
              class="action-btn-filled green"
              @click="buyerConfirmReceive(order)"
            >确认签收</button>
            <button
              v-if="order.order_status === 4"
              class="action-btn-outlined amber"
              @click="buyerApplyRefund(order)"
            >申请退款</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗（管理员） -->
    <el-dialog :title="dialogType === 'add' ? '新增订单' : '编辑订单'" v-model="dialogVisible" width="500px" class="art-dialog">
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="90px" class="dialog-form">
        <el-form-item label="用户" prop="user_id" v-if="isAdmin">
          <el-select v-model="form.user_id" placeholder="请选择用户" filterable style="width:100%">
            <el-option v-for="u in users" :key="u.id" :label="`${u.nickName || u.userName}（ID:${u.id}）`" :value="u.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="goods"><el-input v-model="form.goods"/></el-form-item>
        <el-form-item label="买家" prop="buyer"><el-input v-model="form.buyer"/></el-form-item>
        <el-form-item label="卖家" prop="seller"><el-input v-model="form.seller"/></el-form-item>
        <el-form-item label="下单时间" prop="order_time">
          <el-date-picker v-model="form.order_time" type="datetime" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%"/>
        </el-form-item>
        <el-form-item label="订单金额" prop="order_amount">
          <el-input-number v-model="form.order_amount" :min="0" :precision="2" style="width:100%"/>
        </el-form-item>
        <el-form-item label="订单状态" prop="order_status">
          <el-select v-model="form.order_status" style="width:100%">
            <el-option v-for="s in allStatusOptions" :key="s.value" :label="s.label" :value="s.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <button class="dialog-cancel" @click="dialogVisible = false">取消</button>
        <button class="dialog-confirm" @click="submitForm">确定</button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const apiUrl = import.meta.env.VITE_API_URL || ''
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const isAdmin  = computed(() => currentUser.value?.authority === 0)
const isFarmer = computed(() => currentUser.value?.authority === 1)
const isBuyer  = computed(() => currentUser.value?.authority === 2)

const orders  = ref([])
const users   = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const activeStatus  = ref(-1)
const dialogVisible = ref(false)
const dialogType    = ref('add')
const formRef       = ref(null)

const form = ref({
  order_id: null, user_id: null, goods: '', buyer: '', seller: '',
  order_time: new Date().toISOString().slice(0,19).replace('T',' '),
  order_amount: 0, order_status: 0
})

const formRules = {
  goods:        [{ required: true, message: '请输入商品信息', trigger: 'blur' }],
  buyer:        [{ required: true, message: '请输入买家',     trigger: 'blur' }],
  seller:       [{ required: true, message: '请输入卖家',     trigger: 'blur' }],
  order_time:   [{ required: true, message: '请选择时间',     trigger: 'change' }],
  order_amount: [{ required: true, message: '请输入金额',     trigger: 'blur' }],
}

// 新增多种订单状态
const allStatusOptions = [
  { value: 0, label: '待付款' },
  { value: 1, label: '已付款待发货' },
  { value: 2, label: '已发货' },
  { value: 3, label: '已签收' },
  { value: 4, label: '已完成' },
  { value: 5, label: '已取消' },
  { value: 6, label: '退款中' },
  { value: 7, label: '已退款' },
]

const statusTabs = computed(() => {
  const base = [{ label: '全部', value: -1 }]
  if (isFarmer.value) {
    return [...base,
      { label: '待付款', value: 0 },
      { label: '待发货', value: 1 },
      { label: '已发货', value: 2 },
      { label: '已签收', value: 3 },
      { label: '已完成', value: 4 },
      { label: '退款中', value: 6 },
    ]
  }
  if (isBuyer.value) {
    return [...base,
      { label: '待付款', value: 0 },
      { label: '待发货', value: 1 },
      { label: '已发货', value: 2 },
      { label: '已完成', value: 4 },
      { label: '已取消', value: 5 },
      { label: '退款中', value: 6 },
    ]
  }
  return [...base, ...allStatusOptions]
})

const statusText = (s) => allStatusOptions.find(o => o.value === s)?.label ?? '—'

// 农户：只看涉及自己的订单；买家：看自己下的订单
const myOrders = computed(() => {
  if (isFarmer.value) return orders.value
  return orders.value.filter(o => o.user_id === currentUser.value.id)
})

const filteredOrders = computed(() => {
  let list = activeStatus.value === -1 ? myOrders.value
    : myOrders.value.filter(o => o.order_status === activeStatus.value)
  const kw = searchKeyword.value.toLowerCase()
  if (kw) list = list.filter(o =>
    o.order_id?.toString().includes(kw) ||
    o.goods?.toLowerCase().includes(kw) ||
    o.buyer?.toLowerCase().includes(kw) ||
    o.seller?.toLowerCase().includes(kw)
  )
  return list
})

const filteredUsers = computed(() => {
  const kw = searchKeyword.value.toLowerCase()
  if (!kw) return users.value
  return users.value.filter(u =>
    u.id?.toString().includes(kw) ||
    u.userName?.toLowerCase().includes(kw) ||
    u.nickName?.toLowerCase().includes(kw)
  )
})

const getUserOrders = (uid) => {
  let list = orders.value.filter(o => o.user_id === uid)
  if (activeStatus.value !== -1) list = list.filter(o => o.order_status === activeStatus.value)
  return list
}

const statusCount = (val) => myOrders.value.filter(o => o.order_status === val).length

const stats = computed(() => {
  if (isFarmer.value) {
    return [
      { label: '全部订单', val: myOrders.value.length, color: '#2d6a45', bg: '#EAF3DE',
        svg: '<rect x="2" y="3" width="16" height="13" rx="1.5"/><line x1="5" y1="7" x2="15" y2="7"/><line x1="5" y1="11" x2="11" y2="11"/>' },
      { label: '待发货', val: myOrders.value.filter(o => o.order_status === 1).length,
        color: '#854F0B', bg: '#FAEEDA',
        svg: '<path d="M2 8h12M2 8l3-4M14 8l-3-4M2 8v5a1 1 0 001 1h10a1 1 0 001-1V8"/>' },
      { label: '已完成', val: myOrders.value.filter(o => o.order_status === 4).length,
        color: '#185FA5', bg: '#E6F1FB',
        svg: '<circle cx="10" cy="10" r="8"/><polyline points="6.5,10 8.5,12.5 13.5,7.5"/>' },
      { label: '总收入', val: '¥' + myOrders.value.filter(o => [3,4].includes(o.order_status))
          .reduce((s,o) => s + Number(o.order_amount||0), 0).toFixed(0),
        color: '#BA7517', bg: '#FAEEDA',
        svg: '<circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5h4a1 1 0 010 2h-4"/>' },
    ]
  }
  return [
    { label: '全部订单', val: myOrders.value.length, color: '#2d6a45', bg: '#EAF3DE',
      svg: '<rect x="2" y="3" width="16" height="13" rx="1.5"/><line x1="5" y1="7" x2="15" y2="7"/><line x1="5" y1="11" x2="11" y2="11"/>' },
    { label: '已完成', val: myOrders.value.filter(o => o.order_status === 4).length,
      color: '#185FA5', bg: '#E6F1FB',
      svg: '<circle cx="10" cy="10" r="8"/><polyline points="6.5,10 8.5,12.5 13.5,7.5"/>' },
    { label: '累计消费', val: '¥' + myOrders.value.reduce((s,o) => s + Number(o.order_amount||0), 0).toFixed(0),
      color: '#BA7517', bg: '#FAEEDA',
      svg: '<circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5h4a1 1 0 010 2h-4"/>' },
    { label: '待付款', val: myOrders.value.filter(o => o.order_status === 0).length,
      color: '#993C1D', bg: '#FAECE7',
      svg: '<circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><circle cx="10" cy="13" r="0.8" fill="#993C1D" stroke="none"/>' },
  ]
})

const farmerCanOperate = (order) => [1, 2].includes(order.order_status)

const formatDate = (t) => {
  if (!t) return '—'
  return new Date(t).toLocaleString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

const avatarColors = ['#C0DD97,#3B6D11','#B5D4F4,#185FA5','#F5C4B3,#993C1D','#CECBF6,#3C3489','#9FE1CB,#0F6E56']
const avatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0
  const [bg, color] = avatarColors[idx].split(',')
  return { background: bg, color }
}

// ── 数据获取 ──
const fetchOrders = async () => {
  loading.value = true
  try {
    if (isFarmer.value) {
      // 农户：拉取涉及自己的订单
      const res = await axios.get(`${apiUrl}/farmer/orders`, {
        params: { farmer_id: currentUser.value.id }
      })
      orders.value = res.data.data || []
    } else {
      const res = await axios.get(`${apiUrl}/tables/orders`)
      orders.value = res.data.data || []
    }
  } catch { ElMessage.error('获取订单失败') }
  finally { loading.value = false }
}

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${apiUrl}/tables/user`)
    users.value = res.data.data || []
  } catch {}
}

// ── 农户操作 ──
const updateOrderStatus = async (order, newStatus) => {
  const label = statusText(newStatus)
  try {
    await ElMessageBox.confirm(`确认将订单状态更新为「${label}」？`, '确认操作', { type: 'info' })
    await axios.put(`${apiUrl}/farmer/orders/${order.order_id}/status`, { order_status: newStatus })
    order.order_status = newStatus
    ElMessage.success(`已更新为${label}`)
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

// ── 买家操作 ──
const buyerCancelOrder = async (order) => {
  try {
    await ElMessageBox.confirm('确定取消该订单吗？', '提示', { type: 'warning' })
    await axios.put(`${apiUrl}/tables/orders/${order.order_id}`, { ...order, order_status: 5 })
    order.order_status = 5
    ElMessage.success('订单已取消')
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

const buyerConfirmReceive = async (order) => {
  try {
    await ElMessageBox.confirm('确认已收到货物？签收后订单将完成', '确认签收', { type: 'info' })
    await axios.put(`${apiUrl}/tables/orders/${order.order_id}`, { ...order, order_status: 4 })
    order.order_status = 4
    ElMessage.success('签收成功，订单已完成')
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

const buyerApplyRefund = async (order) => {
  try {
    await ElMessageBox.confirm('确定申请退款吗？', '提示', { type: 'warning' })
    await axios.put(`${apiUrl}/tables/orders/${order.order_id}`, { ...order, order_status: 6 })
    order.order_status = 6
    ElMessage.success('退款申请已提交')
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

// ── 管理员操作 ──
const handleAdd = () => {
  dialogType.value = 'add'
  form.value = { order_id:null, user_id:null, goods:'', buyer:'', seller:'',
    order_time: new Date().toISOString().slice(0,19).replace('T',' '), order_amount:0, order_status:0 }
  dialogVisible.value = true
}

const handleAddOrderForUser = (user) => {
  dialogType.value = 'add'
  form.value = { order_id:null, user_id:user.id, goods:'', buyer: user.nickName||user.userName, seller:'',
    order_time: new Date().toISOString().slice(0,19).replace('T',' '), order_amount:0, order_status:0 }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  form.value = { ...row, order_status: parseInt(row.order_status) || 0 }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这个订单吗？', '提示', { type:'warning' }).then(async () => {
    await axios.delete(`${apiUrl}/tables/orders/${row.order_id}`)
    ElMessage.success('删除成功')
    fetchOrders()
  }).catch(() => {})
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    try {
      if (dialogType.value === 'add') {
        await axios.post(`${apiUrl}/tables/orders`, form.value)
        ElMessage.success('添加成功')
      } else {
        await axios.put(`${apiUrl}/tables/orders/${form.value.order_id}`, form.value)
        ElMessage.success('更新成功')
      }
      dialogVisible.value = false
      fetchOrders()
    } catch { ElMessage.error('操作失败') }
  })
}

onMounted(() => { fetchOrders(); if (isAdmin.value) fetchUsers() })
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&family=Inter:wght@300;400;500&display=swap');

.orders-page {
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1a1a12;
  margin: 0 0 4px;
}

.page-sub { font-size: 12px; color: #9a9a8a; margin: 0; }

.header-right { display: flex; align-items: center; gap: 10px; }

.search-wrap {
  display: flex; align-items: center; gap: 8px;
  background: white; border: 1px solid #e8e5de; border-radius: 4px;
  padding: 7px 12px; transition: border-color .2s;
  &:focus-within { border-color: #2d6a45; }
}

.search-input {
  border: none; outline: none; font-size: 13px; color: #1a1a12;
  background: transparent; width: 200px; font-family: 'Inter', sans-serif;
  &::placeholder { color: #c8c8b8; }
}

.add-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 16px; background: #1a3a22; color: #f0ede8;
  border: none; border-radius: 4px; font-size: 13px; font-weight: 500;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .2s;
  white-space: nowrap;
  &:hover { background: #2d6a45; }
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  background: white; border: 1px solid #eeebe4; border-radius: 8px;
  padding: 16px 18px; display: flex; align-items: center; gap: 14px;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
}

.stat-icon {
  width: 40px; height: 40px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

.stat-val { font-size: 22px; font-weight: 600; line-height: 1.2; margin-bottom: 3px; }
.stat-lbl { font-size: 11px; color: #9a9a8a; letter-spacing: .5px; }

.filter-tabs {
  display: flex; gap: 4px; margin-bottom: 16px; flex-wrap: wrap;
}

.filter-tab {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border: 1px solid #e8e5de; border-radius: 4px;
  background: white; font-size: 12px; color: #6a6a5a; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
  &.active { background: #1a3a22; border-color: #1a3a22; color: #f0ede8; }
}

.tab-count {
  background: rgba(255,255,255,0.2); border-radius: 10px; padding: 1px 6px; font-size: 10px;
  .filter-tab:not(.active) & { background: #f0f0e8; color: #9a9a8a; }
}

.order-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
}

.order-card {
  background: white; border: 1px solid #eeebe4; border-radius: 8px; overflow: hidden;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
  &.farmer-card { border-left: 3px solid #2d6a45; }
}

.card-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; background: #faf9f6; border-bottom: 1px solid #eeebe4;
}

.card-id {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #7a7a6a;
}

.card-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 9px; }

.card-row { display: flex; justify-content: space-between; align-items: center; }

.card-label { font-size: 11px; color: #9a9a8a; }
.card-val { font-size: 13px; color: #1a1a12; font-weight: 500; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.card-actions {
  padding: 12px 16px;
  border-top: 1px solid #f5f3ee;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.action-btn-filled {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px; border: none; border-radius: 4px;
  font-size: 12px; font-weight: 500; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .15s;
  &.green { background: #1a3a22; color: white; &:hover { background: #2d6a45; } }
  &.blue  { background: #185FA5; color: white; &:hover { background: #1250A0; } cursor: default; }
}

.action-btn-outlined {
  padding: 6px 14px; border-radius: 4px;
  font-size: 12px; font-weight: 500; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .15s;
  background: white;
  &.red   { border: 1px solid #F7C1C1; color: #A32D2D; &:hover { background: #A32D2D; color: white; } }
  &.amber { border: 1px solid #F5C885; color: #854F0B; &:hover { background: #854F0B; color: white; } }
}

.status-hint { font-size: 11px; color: #9a9a8a; }

/* 状态 pill（8种状态） */
.status-pill { font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 20px; letter-spacing: .3px; }
.status-0 { background: #F1EFE8; color: #5F5E5A; }   /* 待付款 */
.status-1 { background: #FAEEDA; color: #854F0B; }   /* 已付款待发货 */
.status-2 { background: #EEEDFE; color: #3C3489; }   /* 已发货 */
.status-3 { background: #E6F1FB; color: #185FA5; }   /* 已签收 */
.status-4 { background: #EAF3DE; color: #3B6D11; }   /* 已完成 */
.status-5 { background: #F1EFE8; color: #9a9a8a; }   /* 已取消 */
.status-6 { background: #FCEBEB; color: #A32D2D; }   /* 退款中 */
.status-7 { background: #F1EFE8; color: #5F5E5A; }   /* 已退款 */

.money { color: #BA7517; font-weight: 600; }
.money.large { font-size: 15px; }

/* 表格 */
.table-wrap { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eeebe4; }
.art-table {
  :deep(th) { background: #faf9f6 !important; font-size: 12px; color: #7a7a6a; font-weight: 500; }
  :deep(td) { font-size: 13px; }
}
.user-cell { display: flex; align-items: center; gap: 8px; }
.user-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; flex-shrink: 0;
}
.expand-orders { padding: 16px 24px; background: #faf9f6; }
.expand-title { font-size: 13px; font-weight: 500; color: #2d6a45; margin-bottom: 12px; }
.inner-table { :deep(th) { background: #f3f0e8 !important; font-size: 12px; } }
.tbl-btn {
  padding: 3px 10px; border-radius: 3px; font-size: 12px; cursor: pointer;
  border: 1px solid; font-family: 'Inter', sans-serif; transition: all .15s; margin-right: 6px;
  &.edit { border-color: #b8d8c0; color: #2d6a45; background: #f0faf4; &:hover { background: #2d6a45; color: white; } }
  &.del  { border-color: #F7C1C1; color: #A32D2D; background: #FCEBEB; &:hover { background: #A32D2D; color: white; } }
}
.order-count { font-size: 13px; color: #6a6a5a; b { color: #1a1a12; } }

/* 弹窗 */
.art-dialog {
  :deep(.el-dialog__header) { border-bottom: 1px solid #eeebe4; padding-bottom: 16px; }
  :deep(.el-dialog__title) { font-family: 'Noto Serif SC', serif; font-size: 18px; font-weight: 400; }
  :deep(.el-dialog__footer) { border-top: 1px solid #eeebe4; padding-top: 16px; display: flex; justify-content: flex-end; gap: 10px; }
}
.dialog-form { :deep(.el-form-item__label) { font-size: 12px; color: #7a7a6a; } }
.dialog-cancel {
  padding: 8px 20px; border: 1px solid #e8e5de; border-radius: 3px;
  background: white; font-size: 13px; cursor: pointer; font-family: 'Inter', sans-serif; color: #6a6a5a;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}
.dialog-confirm {
  padding: 8px 24px; border: none; border-radius: 3px;
  background: #1a3a22; font-size: 13px; cursor: pointer;
  font-family: 'Inter', sans-serif; color: #f0ede8; font-weight: 500;
  &:hover { background: #2d6a45; }
}

@media (max-width: 900px) {
  .stat-row { grid-template-columns: repeat(2,1fr); }
  .order-cards { grid-template-columns: 1fr; }
}
</style>