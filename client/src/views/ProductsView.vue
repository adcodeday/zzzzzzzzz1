<template>
  <div class="products-page">

    <div class="page-header">
      <div>
        <div class="page-eyebrow">Product Management</div>
        <h2 class="page-title">{{ isAdmin ? '农产品审核管理' : '我的农产品' }}</h2>
      </div>
      <div class="header-actions">
        <!-- 管理员：审核状态筛选 -->
        <div v-if="isAdmin" class="audit-tabs">
          <button
            v-for="t in auditTabs" :key="t.value"
            :class="['audit-tab', { active: auditFilter === t.value }]"
            @click="auditFilter = t.value; fetchProducts()"
          >
            {{ t.label }}
            <span v-if="t.value !== -1" class="tab-count">{{ auditCount(t.value) }}</span>
          </button>
        </div>
        <!-- 农户：新增按钮 -->
        <button v-if="!isAdmin" class="add-btn" @click="showAddDialog">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/>
          </svg>
          上架新产品
        </button>
      </div>
    </div>

    <!-- 审核提示（农户） -->
    <div v-if="!isAdmin && pendingCount > 0" class="audit-notice">
      <svg viewBox="0 0 16 16" fill="none" stroke="#854F0B" stroke-width="1.5" width="14" height="14">
        <circle cx="8" cy="8" r="6"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11" r="0.6" fill="#854F0B" stroke="none"/>
      </svg>
      你有 <b>{{ pendingCount }}</b> 件商品正在等待管理员审核
    </div>

    <!-- 商品表格 -->
    <div class="table-card">
      <el-table :data="products" border v-loading="loading" class="art-table">
        <el-table-column type="index" label="#" width="55"/>
        <el-table-column prop="name" label="产品名称" width="150"/>
        <el-table-column label="图片" width="80">
          <template #default="{ row }">
            <div class="prod-img-wrap">
              <img :src="row.image" :alt="row.name" class="prod-img" v-if="row.image"/>
              <div v-else class="prod-img-empty">暂无</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="90">
          <template #default="{ row }">
            <span class="money">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="原价" width="90">
          <template #default="{ row }">
            <span class="origin-price">¥{{ row.originalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="规格" width="100"/>
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            <span class="cat-badge">{{ getCategoryName(row.categoryId) }}</span>
          </template>
        </el-table-column>
        <!-- 管理员显示农户 -->
        <el-table-column v-if="isAdmin" label="上架农户" width="130">
          <template #default="{ row }">
            <span class="farmer-name">{{ row.farmer_nick || row.farmer_name || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="70"/>
        <el-table-column label="审核状态" width="110">
          <template #default="{ row }">
            <span :class="['audit-badge', 'audit-' + (row.audit_status ?? 0)]">
              {{ auditLabel(row.audit_status) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <!-- 管理员：审核操作 -->
            <template v-if="isAdmin">
              <button
                v-if="row.audit_status !== 1"
                class="tbl-btn approve"
                @click="handleAudit(row, 1)"
              >通过</button>
              <button
                v-if="row.audit_status !== 2"
                class="tbl-btn reject"
                @click="handleAudit(row, 2)"
              >拒绝</button>
              <button class="tbl-btn del" @click="handleDelete(row)">删除</button>
            </template>
            <!-- 农户：编辑/删除（仅待审核或已拒绝可编辑） -->
            <template v-else>
              <button
                class="tbl-btn edit"
                :disabled="row.audit_status === 1"
                :title="row.audit_status === 1 ? '已通过审核，不可修改' : ''"
                @click="handleEdit(row)"
              >编辑</button>
              <button class="tbl-btn del" @click="handleDelete(row)">删除</button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogType === 'add' ? '上架新产品' : '编辑产品'"
      v-model="dialogVisible" width="520px" class="art-dialog"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="0" class="dialog-form">
        <div class="form-grid">
          <div class="dialog-field full">
            <label class="dialog-label">产品名称</label>
            <el-form-item prop="name">
              <el-input v-model="form.name" class="art-input" placeholder="请输入产品名称"/>
            </el-form-item>
          </div>
          <div class="dialog-field">
            <label class="dialog-label">售价（元）</label>
            <el-form-item prop="price">
              <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" style="width:100%"/>
            </el-form-item>
          </div>
          <div class="dialog-field">
            <label class="dialog-label">原价（元）</label>
            <el-form-item prop="originalPrice">
              <el-input-number v-model="form.originalPrice" :precision="2" :step="0.1" :min="0" style="width:100%"/>
            </el-form-item>
          </div>
          <div class="dialog-field">
            <label class="dialog-label">规格</label>
            <el-form-item prop="amount">
              <el-input v-model="form.amount" class="art-input" placeholder="如：500g / 1斤 / 3个"/>
            </el-form-item>
          </div>
          <div class="dialog-field">
            <label class="dialog-label">分类</label>
            <el-form-item prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择分类" style="width:100%">
                <el-option v-for="c in categoryOptions" :key="c.id" :label="c.name" :value="c.id"/>
              </el-select>
            </el-form-item>
          </div>
          <div class="dialog-field full">
            <label class="dialog-label">产品图片</label>
            <el-upload action="#" :auto-upload="false" :show-file-list="false" :on-change="handleImageChange" accept="image/*">
              <div class="upload-area">
                <img v-if="imageUrl" :src="imageUrl" class="upload-preview"/>
                <div v-else class="upload-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#b0b0a0" stroke-width="1.5" width="22" height="22">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>点击上传图片</span>
                </div>
              </div>
            </el-upload>
          </div>
          <div class="dialog-field full">
            <label class="dialog-label">标签</label>
            <el-form-item prop="tags">
              <el-select v-model="form.tags" multiple placeholder="请选择标签" style="width:100%">
                <el-option label="热销" value="热销"/>
                <el-option label="新品" value="新品"/>
                <el-option label="推荐" value="推荐"/>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="submit-tip">
          <svg viewBox="0 0 14 14" fill="none" stroke="#854F0B" stroke-width="1.5" width="13" height="13">
            <circle cx="7" cy="7" r="5.5"/><line x1="7" y1="4.5" x2="7" y2="8"/><circle cx="7" cy="9.5" r="0.5" fill="#854F0B" stroke="none"/>
          </svg>
          提交后将进入审核队列，管理员审核通过后自动上架至商城
        </div>
      </el-form>
      <template #footer>
        <button class="dialog-cancel" @click="dialogVisible = false">取消</button>
        <button class="dialog-confirm" @click="handleSubmit">{{ dialogType === 'add' ? '提交审核' : '保存修改' }}</button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const apiUrl = import.meta.env.VITE_API_URL
const currentUser = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const isAdmin = computed(() => currentUser.value?.authority === 0)
const isFarmer = computed(() => currentUser.value?.authority === 1)

const loading       = ref(false)
const products      = ref([])
const auditFilter   = ref(-1) // -1=全部
const dialogVisible = ref(false)
const dialogType    = ref('add')
const formRef       = ref(null)
const imageUrl      = ref('')
const imageFile     = ref(null)

const form = ref({ name:'', price:0, originalPrice:0, categoryId:'', image:'', tags:[], sales:0, amount:'' })

const rules = {
  name:         [{ required:true, message:'请输入产品名称', trigger:'blur' }],
  price:        [{ required:true, message:'请输入价格', trigger:'change' }],
  originalPrice:[{ required:true, message:'请输入原价', trigger:'change' }],
  categoryId:   [{ required:true, message:'请选择分类', trigger:'change' }],
}

const auditTabs = [
  { label:'全部', value:-1 },
  { label:'待审核', value:0 },
  { label:'已通过', value:1 },
  { label:'已拒绝', value:2 },
]

const auditCount = (status) => products.value.filter(p => p.audit_status === status).length
const pendingCount = computed(() => products.value.filter(p => p.audit_status === 0).length)

const categoryOptions = [
  { id:1, name:'水果' },{ id:2, name:'蔬菜' },{ id:3, name:'粮油' },
  { id:4, name:'禽蛋' },{ id:5, name:'水产' },{ id:6, name:'坚果' },
  { id:7, name:'蜂蜜' },{ id:8, name:'茶叶' },{ id:9, name:'特产' },{ id:10, name:'干货' },
]

const categoryMap = Object.fromEntries(categoryOptions.map(c => [c.id, c.name]))
const getCategoryName = (id) => categoryMap[id] || '未知'

const auditLabel = (s) => ({ 0:'待审核', 1:'已通过', 2:'已拒绝' }[s ?? 0] ?? '待审核')

const fetchProducts = async () => {
  loading.value = true
  try {
    let res
    if (isAdmin.value) {
      // 管理员：调用审核接口，可按状态筛选
      const params = auditFilter.value !== -1 ? { audit_status: auditFilter.value } : {}
      res = await axios.get(`${apiUrl}/products/audit`, { params })
      products.value = res.data.data || []
    } else {
      // 农户：获取自己的商品
      res = await axios.get(`${apiUrl}/farmer/products`, { params: { farmer_id: currentUser.value.id } })
      products.value = res.data.data || []
    }
  } catch { ElMessage.error('获取产品列表失败') }
  finally { loading.value = false }
}

// 管理员审核
const handleAudit = async (row, status) => {
  const label = status === 1 ? '通过' : '拒绝'
  try {
    await ElMessageBox.confirm(`确定${label}商品「${row.name}」吗？`, '审核确认', { type: status === 1 ? 'info' : 'warning' })
    await axios.put(`${apiUrl}/products/${row.id}/audit`, { audit_status: status })
    ElMessage.success(`已${label}`)
    fetchProducts()
  } catch (e) { if (e !== 'cancel') ElMessage.error('操作失败') }
}

const handleImageChange = (file) => {
  imageFile.value = file.raw
  imageUrl.value  = URL.createObjectURL(file.raw)
  form.value.image = imageUrl.value
}

const convertToBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.readAsDataURL(file)
  r.onload  = () => res(r.result)
  r.onerror = (e) => rej(e)
})

const showAddDialog = () => {
  dialogType.value = 'add'
  form.value = { name:'', price:0, originalPrice:0, categoryId:'', image:'', tags:[], sales:0, amount:'' }
  imageUrl.value  = ''
  imageFile.value = null
  dialogVisible.value = true
  formRef.value?.resetFields()
}

const handleEdit = (row) => {
  if (row.audit_status === 1) return ElMessage.warning('已审核通过的商品不可修改')
  dialogType.value = 'edit'
  form.value = { ...row, tags: Array.isArray(row.tags) ? row.tags : [] }
  imageUrl.value  = row.image
  imageFile.value = null
  dialogVisible.value = true
  formRef.value?.resetFields()
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确认删除该产品吗？', '提示', { type:'warning' })
    await axios.delete(`${apiUrl}/tables/products/${row.id}`)
    ElMessage.success('删除成功')
    fetchProducts()
  } catch (e) { if (e !== 'cancel') ElMessage.error('删除失败') }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    if (imageFile.value) {
      form.value.image = await convertToBase64(imageFile.value)
    } else if (!form.value.image) {
      ElMessage.error('请上传产品图片')
      return
    }
    if (dialogType.value === 'add') {
      // 农户上架，调用新接口，附带 farmer_id
      await axios.post(`${apiUrl}/farmer/products`, {
        ...form.value,
        farmer_id: currentUser.value.id
      })
      ElMessage.success('已提交，等待管理员审核')
    } else {
      await axios.put(`${apiUrl}/tables/products/${form.value.id}`, form.value)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    fetchProducts()
  } catch (e) { if (e?.message) ElMessage.error('表单验证失败') }
}

onMounted(fetchProducts)
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400&family=Inter:wght@300;400;500&display=swap');

.products-page {
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
  margin-bottom: 16px;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.audit-tabs {
  display: flex;
  gap: 4px;
}

.audit-tab {
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
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 10px;
  .audit-tab:not(.active) & { background: #f0f0e8; color: #9a9a8a; }
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
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

/* 审核提示横幅 */
.audit-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #FAEEDA;
  border: 1px solid #F5C885;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 13px;
  color: #854F0B;
  margin-bottom: 16px;
  b { font-weight: 600; }
}

.table-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  overflow: hidden;
}

.art-table {
  :deep(th.el-table__cell) { background: #faf9f6 !important; font-size: 11px; color: #9a9a8a; font-weight: 500; letter-spacing: .5px; }
  :deep(td.el-table__cell) { font-size: 13px; }
  :deep(.el-button.is-disabled) { opacity: .4; }
}

.prod-img-wrap {
  width: 48px; height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eeebe4;
}
.prod-img { width: 100%; height: 100%; object-fit: cover; }
.prod-img-empty {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #b0b0a0; background: #f5f3ee;
}

.money       { color: #BA7517; font-weight: 600; font-size: 13px; }
.origin-price { color: #b0b0a0; text-decoration: line-through; font-size: 12px; }

.cat-badge {
  font-size: 11px;
  background: #EAF3DE;
  color: #3B6D11;
  padding: 2px 8px;
  border-radius: 20px;
  font-weight: 500;
}

.farmer-name { font-size: 12px; color: #4a4a3a; }

/* 审核状态徽章 */
.audit-badge {
  font-size: 11px;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 500;
}
.audit-0 { background: #FAEEDA; color: #854F0B; }
.audit-1 { background: #EAF3DE; color: #3B6D11; }
.audit-2 { background: #FCEBEB; color: #A32D2D; }

.tbl-btn {
  padding: 4px 10px;
  border-radius: 3px;
  font-size: 11px;
  cursor: pointer;
  border: 1px solid;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
  margin-right: 5px;
  &.edit    { border-color: #b8d8c0; color: #2d6a45; background: #f0faf4; &:hover { background: #2d6a45; color: white; } }
  &.approve { border-color: #b8d8c0; color: #3B6D11; background: #EAF3DE; &:hover { background: #2d6a45; color: white; } }
  &.reject  { border-color: #F7C1C1; color: #A32D2D; background: #FCEBEB; &:hover { background: #A32D2D; color: white; } }
  &.del     { border-color: #e0ddd6; color: #9a9a8a; background: white;   &:hover { background: #A32D2D; color: white; border-color: #A32D2D; } }
  &:disabled { opacity: .4; cursor: not-allowed; }
}

/* 弹窗 */
.art-dialog {
  :deep(.el-dialog__header) { border-bottom: 1px solid #eeebe4; padding-bottom: 14px; }
  :deep(.el-dialog__title) { font-family: 'Noto Serif SC', serif; font-size: 17px; font-weight: 400; }
  :deep(.el-dialog__footer) { border-top: 1px solid #eeebe4; display: flex; justify-content: flex-end; gap: 8px; padding-top: 14px; }
}

.dialog-form { :deep(.el-form-item) { margin-bottom: 0; } }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 20px;
}

.dialog-field {
  margin-bottom: 16px;
  &.full { grid-column: 1 / -1; }
}

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
    font-size: 13px; color: #1a1a12;
    font-family: 'Inter', sans-serif;
    height: 34px; padding: 0;
    &::placeholder { color: #c8c8b8; font-weight: 300; }
  }
}

.upload-area {
  width: 110px; height: 110px;
  border: 1.5px dashed #dedad2;
  border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
  transition: border-color .2s;
  &:hover { border-color: #2d6a45; }
}
.upload-preview { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; color: #b0b0a0; font-size: 11px;
}

.submit-tip {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #854F0B;
  background: #FAEEDA;
  border-radius: 4px;
  padding: 8px 12px;
  margin-top: 4px;
}

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
</style>