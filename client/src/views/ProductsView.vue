<template>
  <div class="products-page">

    <div class="page-header">
      <div>
        <div class="page-eyebrow">Product Management</div>
        <h2 class="page-title">农产品管理</h2>
      </div>
      <button class="add-btn" @click="showAddDialog">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><line x1="7" y1="1" x2="7" y2="13"/><line x1="1" y1="7" x2="13" y2="7"/></svg>
        新增产品
      </button>
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
        <el-table-column prop="sales" label="销量" width="80"/>
        <el-table-column label="标签" width="120">
          <template #default="{ row }">
            <div class="tag-wrap">
              <span v-for="t in (Array.isArray(row.tags) ? row.tags : [])" :key="t" :class="['tag', 'tag-' + t]">{{ t }}</span>
            </div>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增产品' : '编辑产品'"
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
      </el-form>
      <template #footer>
        <button class="dialog-cancel" @click="dialogVisible = false">取消</button>
        <button class="dialog-confirm" @click="handleSubmit">{{ dialogType === 'add' ? '发布' : '保存' }}</button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

const apiUrl = import.meta.env.VITE_API_URL
const loading       = ref(false)
const products      = ref([])
const dialogVisible = ref(false)
const dialogType    = ref('add')
const formRef       = ref(null)
const imageUrl      = ref('')
const imageFile     = ref(null)

const form = ref({ name:'', price:0, originalPrice:0, categoryId:'', image:'', tags:[], sales:0, amount:'' })

const rules = {
  name:        [{ required:true, message:'请输入产品名称', trigger:'blur' }],
  price:       [{ required:true, message:'请输入价格',     trigger:'change' }],
  originalPrice:[{ required:true, message:'请输入原价',   trigger:'change' }],
  categoryId:  [{ required:true, message:'请选择分类',     trigger:'change' }],
}

const categoryOptions = [
  { id:1, name:'水果' },{ id:2, name:'蔬菜' },{ id:3, name:'粮油' },
  { id:4, name:'禽蛋' },{ id:5, name:'水产' },{ id:6, name:'坚果' },
  { id:7, name:'蜂蜜' },{ id:8, name:'茶叶' },{ id:9, name:'特产' },{ id:10, name:'干货' },
]

const categoryMap = Object.fromEntries(categoryOptions.map(c => [c.id, c.name]))
const getCategoryName = (id) => categoryMap[id] || '未知'

const fetchProducts = async () => {
  loading.value = true
  try {
    const res = await axios.get(`${apiUrl}/tables/products`)
    products.value = res.data.data || []
  } catch { ElMessage.error('获取产品列表失败') }
  finally { loading.value = false }
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
  dialogType.value = 'edit'
  form.value = { ...row }
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
    await fetchProducts()
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
      await axios.post(`${apiUrl}/tables/products`, form.value)
      ElMessage.success('发布成功')
    } else {
      await axios.put(`${apiUrl}/tables/products/${form.value.id}`, form.value)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    await fetchProducts()
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
  &:hover { background: #2d6a45; }
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
}

.prod-img-wrap {
  width: 48px; height: 48px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #eeebe4;
}

.prod-img {
  width: 100%; height: 100%;
  object-fit: cover;
}

.prod-img-empty {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: #b0b0a0;
  background: #f5f3ee;
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

.tag-wrap { display: flex; flex-wrap: wrap; gap: 4px; }

.tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
  font-weight: 500;
}
.tag-热销 { background: #FAECE7; color: #993C1D; }
.tag-新品 { background: #EAF3DE; color: #3B6D11; }
.tag-推荐 { background: #E6F1FB; color: #185FA5; }

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
  &.del  { border-color: #F7C1C1; color: #A32D2D; background: #FCEBEB; &:hover { background: #A32D2D; color: white; } }
}

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

.upload-preview {
  width: 100%; height: 100%;
  object-fit: cover;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #b0b0a0;
  font-size: 11px;
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

@media (max-width: 768px) {
  .products-page { padding: 20px 16px; }
}
</style>