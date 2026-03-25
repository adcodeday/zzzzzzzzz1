<template>
  <div class="orders-page">

    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">订单管理</h2>
        <p class="page-sub">{{ isAdmin ? '平台全部交易记录' : '我的购买记录' }}</p>
      </div>
      <div class="header-right">
        <div class="search-wrap">
          <svg viewBox="0 0 16 16" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="14" height="14" style="flex-shrink:0">
            <circle cx="6.5" cy="6.5" r="4.5"/><line x1="10" y1="10" x2="14" y2="14"/>
          </svg>
          <input v-model="searchKeyword" class="search-input" placeholder="搜索订单、商品、买家..."/>
        </div>
        <button v-if="isAdmin" class="add-btn" @click="handleAdd">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
          新增订单
        </button>
      </div>
    </div>

    <!-- 统计卡片（非管理员） -->
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

    <!-- 管理员：用户 + 展开订单表格 -->
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
                <el-table-column label="状态" width="90">
                  <template #default="{ row }">
                    <span :class="['status-pill', 'status-' + row.order_status]">{{ statusText(row.order_status) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130" fixed="right">
                  <template #default="{ row }">
                    <button class="tbl-btn edit" @click="handleEdit(row)">编辑</button>
                    <button class="tbl-btn del" @click="handleDelete(row)">删除</button>
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

    <!-- 普通用户：卡片列表 -->
    <div v-else>
      <!-- 状态筛选 Tab -->
      <div class="filter-tabs">
        <button
          v-for="t in statusTabs"
          :key="t.value"
          :class="['filter-tab', { active: activeStatus === t.value }]"
          @click="activeStatus = t.value"
        >
          {{ t.label }}
          <span v-if="statusCount(t.value)" class="tab-count">{{ statusCount(t.value) }}</span>
        </button>
      </div>

      <el-empty v-if="filteredUserOrders.length === 0" description="暂无相关订单" :image-size="80"/>

      <div v-else class="order-cards">
        <div class="order-card" v-for="order in filteredUserOrders" :key="order.order_id">
          <div class="card-head">
            <div class="card-id">
              <svg viewBox="0 0 14 14" fill="none" stroke="#9a9a8a" stroke-width="1.5" width="13" height="13">
                <rect x="1" y="2" width="12" height="10" rx="1.5"/>
                <line x1="4" y1="6" x2="10" y2="6"/><line x1="4" y1="9" x2="8" y2="9"/>
              </svg>
              <span>{{ order.order_id }}</span>
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
        </div>
      </div>

      <div class="pagination-wrap" v-if="filteredUserOrders.length > pageSize">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredUserOrders.length"
          layout="prev, pager, next"
        />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
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
            <el-option :value="0" label="未支付"/>
            <el-option :value="1" label="已支付"/>
            <el-option :value="2" label="已发货"/>
            <el-option :value="3" label="已完成"/>
            <el-option :value="4" label="已取消"/>
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
const isAdmin = computed(() => currentUser.value?.authority === 0)

const orders  = ref([])
const users   = ref([])
const loading = ref(false)
const searchKeyword = ref('')
const currentPage   = ref(1)
const pageSize      = ref(12)
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
  order_status: [{ required: true, message: '请选择状态',     trigger: 'change' }],
}

const statusTabs = [
  { label: '全部',   value: -1 },
  { label: '未支付', value: 0  },
  { label: '已支付', value: 1  },
  { label: '已发货', value: 2  },
  { label: '已完成', value: 3  },
  { label: '已取消', value: 4  },
]

const userOrders = computed(() => {
  if (!currentUser.value) return []
  return orders.value.filter(o => o.user_id === currentUser.value.id)
})

const filteredUserOrders = computed(() => {
  let list = activeStatus.value === -1 ? userOrders.value
    : userOrders.value.filter(o => o.order_status === activeStatus.value)
  const kw = searchKeyword.value.toLowerCase()
  if (kw) list = list.filter(o =>
    o.order_id?.toString().includes(kw) ||
    o.goods?.toLowerCase().includes(kw) ||
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

const getUserOrders = (uid) => orders.value.filter(o => o.user_id === uid)

const statusCount = (val) => {
  if (val === -1) return 0
  return userOrders.value.filter(o => o.order_status === val).length
}

const stats = computed(() => [
  { label: '全部订单', val: userOrders.value.length,
    color: '#2d6a45', bg: '#EAF3DE',
    svg: '<rect x="2" y="3" width="16" height="13" rx="1.5"/><line x1="5" y1="7" x2="15" y2="7"/><line x1="5" y1="11" x2="11" y2="11"/>' },
  { label: '已完成',
    val: userOrders.value.filter(o => o.order_status === 3).length,
    color: '#185FA5', bg: '#E6F1FB',
    svg: '<circle cx="10" cy="10" r="8"/><polyline points="6.5,10 8.5,12.5 13.5,7.5"/>' },
  { label: '累计消费',
    val: '¥' + userOrders.value.reduce((s,o) => s + Number(o.order_amount||0), 0).toFixed(0),
    color: '#BA7517', bg: '#FAEEDA',
    svg: '<circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5h4a1 1 0 010 2h-4"/>' },
  { label: '待支付',
    val: userOrders.value.filter(o => o.order_status === 0).length,
    color: '#993C1D', bg: '#FAECE7',
    svg: '<circle cx="10" cy="10" r="8"/><line x1="10" y1="6" x2="10" y2="10"/><circle cx="10" cy="13" r="0.8" fill="#993C1D" stroke="none"/>' },
])

const formatDate = (t) => {
  if (!t) return '—'
  return new Date(t).toLocaleString('zh-CN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
}

const statusText = (s) => ({ 0:'未支付', 1:'已支付', 2:'已发货', 3:'已完成', 4:'已取消' }[s] ?? '—')

const avatarColors = ['#C0DD97,#3B6D11','#B5D4F4,#185FA5','#F5C4B3,#993C1D','#CECBF6,#3C3489','#9FE1CB,#0F6E56']
const avatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0
  const [bg, color] = avatarColors[idx].split(',')
  return { background: bg, color }
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiUrl}/tables/orders`)
    orders.value = res.data.data || []
  } catch { ElMessage.error('获取订单失败') }
  finally { loading.value = false }
}

const fetchUsers = async () => {
  try {
    const res = await axios.get(`${apiUrl}/tables/user`)
    users.value = res.data.data || []
  } catch {}
}

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
  form.value = { ...row }
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

onMounted(() => { fetchOrders(); fetchUsers() })
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&family=Inter:wght@300;400;500&display=swap');

.orders-page {
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* ── 顶部 ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
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

.page-sub {
  font-size: 12px;
  color: #9a9a8a;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  padding: 7px 12px;
  transition: border-color .2s;
  &:focus-within { border-color: #2d6a45; }
}

.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  color: #1a1a12;
  background: transparent;
  width: 200px;
  font-family: 'Inter', sans-serif;
  &::placeholder { color: #c8c8b8; }
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1a3a22;
  color: #f0ede8;
  border: none;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .2s;
  white-space: nowrap;
  &:hover { background: #2d6a45; }
}

/* ── 统计卡片 ── */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-val {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 3px;
  font-family: 'Inter', sans-serif;
}

.stat-lbl {
  font-size: 11px;
  color: #9a9a8a;
  letter-spacing: .5px;
}

/* ── 状态筛选 Tab ── */
.filter-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 14px;
  border: 1px solid #e8e5de;
  border-radius: 4px;
  background: white;
  font-size: 12px;
  color: #6a6a5a;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
  &.active { background: #1a3a22; border-color: #1a3a22; color: #f0ede8; }
}

.tab-count {
  background: rgba(255,255,255,0.25);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 10px;
  .filter-tab:not(.active) & { background: #f0f0e8; color: #9a9a8a; }
}

/* ── 订单卡片 ── */
.order-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.order-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #faf9f6;
  border-bottom: 1px solid #eeebe4;
}

.card-id {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #7a7a6a;
  font-family: 'Inter', sans-serif;
}

.card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-label {
  font-size: 11px;
  color: #9a9a8a;
  letter-spacing: .3px;
}

.card-val {
  font-size: 13px;
  color: #1a1a12;
  font-weight: 500;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 状态标签 ── */
.status-pill {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: .3px;
}
.status-0 { background: #FAEEDA; color: #854F0B; }
.status-1 { background: #E6F1FB; color: #185FA5; }
.status-2 { background: #EEEDFE; color: #3C3489; }
.status-3 { background: #EAF3DE; color: #3B6D11; }
.status-4 { background: #F1EFE8; color: #5F5E5A; }

/* ── 金额 ── */
.money { color: #BA7517; font-weight: 600; }
.money.large { font-size: 15px; }

/* ── 表格 ── */
.table-wrap { background: white; border-radius: 8px; overflow: hidden; border: 1px solid #eeebe4; }

.art-table {
  :deep(th) { background: #faf9f6 !important; font-size: 12px; color: #7a7a6a; font-weight: 500; letter-spacing: .3px; }
  :deep(td) { font-size: 13px; }
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.expand-orders {
  padding: 16px 24px;
  background: #faf9f6;
}

.expand-title {
  font-size: 13px;
  font-weight: 500;
  color: #2d6a45;
  margin-bottom: 12px;
}

.inner-table {
  :deep(th) { background: #f3f0e8 !important; font-size: 12px; }
}

.tbl-btn {
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  margin-right: 6px;
  &.edit { border-color: #b8d8c0; color: #2d6a45; background: #f0faf4; &:hover { background: #2d6a45; color: white; } }
  &.del  { border-color: #F7C1C1; color: #A32D2D; background: #FCEBEB; &:hover { background: #A32D2D; color: white; } }
}

.order-count { font-size: 13px; color: #6a6a5a; b { color: #1a1a12; } }

/* ── 分页 ── */
.pagination-wrap { display: flex; justify-content: center; margin-top: 20px; }

/* ── 弹窗 ── */
.art-dialog {
  :deep(.el-dialog__header) { border-bottom: 1px solid #eeebe4; padding-bottom: 16px; }
  :deep(.el-dialog__title) { font-family: 'Noto Serif SC', serif; font-size: 18px; font-weight: 400; }
  :deep(.el-dialog__footer) { border-top: 1px solid #eeebe4; padding-top: 16px; display: flex; justify-content: flex-end; gap: 10px; }
}

.dialog-form {
  :deep(.el-form-item__label) { font-size: 12px; color: #7a7a6a; }
}

.dialog-cancel {
  padding: 8px 20px;
  border: 1px solid #e8e5de;
  border-radius: 3px;
  background: white;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  color: #6a6a5a;
  &:hover { border-color: #b8d8c0; color: #2d6a45; }
}

.dialog-confirm {
  padding: 8px 24px;
  border: none;
  border-radius: 3px;
  background: #1a3a22;
  font-size: 13px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  color: #f0ede8;
  font-weight: 500;
  &:hover { background: #2d6a45; }
}

/* ── 响应式 ── */
@media (max-width: 900px) {
  .orders-page { padding: 20px 16px; }
  .stat-row { grid-template-columns: repeat(2,1fr); }
  .order-cards { grid-template-columns: 1fr; }
}
</style>