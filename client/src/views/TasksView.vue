<template>
  <div class="community">

    <!-- 顶部栏 -->
    <div class="community-header">
      <div class="header-left">
        <h2 class="header-title">助农社区</h2>
        <p class="header-sub">分享好物 · 发布任务 · 共助农业</p>
      </div>
      <div class="header-right">
        <div class="tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="['tab-btn', { active: activeTab === tab.value }]"
            @click="switchTab(tab.value)"
          >{{ tab.label }}</button>
        </div>
        <el-button
          v-if="canPost"
          type="primary"
          class="post-btn"
          @click="openPostDialog"
        >+ 发帖</el-button>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div v-loading="loading" class="post-list">
      <el-empty v-if="!loading && posts.length === 0" description="暂无帖子，快来发第一篇吧~" :image-size="80" />

      <template v-for="post in posts" :key="post.id">

        <!-- 好物推荐卡片 -->
        <div v-if="post.type === 1" class="post-card goods-card">
          <div class="card-main">
            <div class="card-left">
              <div class="author-row">
                <div class="avatar" :style="avatarStyle(post.user_nick || post.user_name)">
                  {{ (post.user_nick || post.user_name || '?')[0] }}
                </div>
                <div class="author-info">
                  <span class="author-name">{{ post.user_nick || post.user_name }}</span>
                  <span class="post-time">{{ formatTime(post.created_at) }}</span>
                </div>
                <span class="type-tag goods-tag">好物推荐</span>
              </div>
              <div class="post-title">{{ post.title }}</div>
              <div class="post-content">{{ post.content }}</div>
              <div class="action-row">
                <button :class="['action-btn', { liked: post.is_liked }]" @click="toggleLike(post)">
                  <svg viewBox="0 0 16 16" :fill="post.is_liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" width="15" height="15">
                    <path d="M8 14s-6-3.5-6-8a4 4 0 0 1 6-3.44A4 4 0 0 1 14 6c0 4.5-6 8-6 8z"/>
                  </svg>
                  {{ post.like_count }}
                </button>
                <button class="action-btn" @click="openComment(post)">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
                    <path d="M14 10a2 2 0 0 1-2 2H5l-3 2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/>
                  </svg>
                  {{ post.comment_count }}
                </button>
                <button
                  v-if="canDelete(post)"
                  class="action-btn delete-btn"
                  @click="deletePost(post)"
                >删除</button>
              </div>
            </div>
            <div v-if="post.image" class="card-img-wrap">
              <img :src="post.image" class="card-img" />
            </div>
          </div>

          <!-- 评论区 -->
          <div v-if="commentPostId === post.id" class="comment-section">
            <div v-if="post._comments && post._comments.length" class="comment-list">
              <div v-for="c in post._comments" :key="c.id" class="comment-item">
                <div class="c-avatar" :style="avatarStyle(c.user_nick || c.user_name)">
                  {{ (c.user_nick || c.user_name || '?')[0] }}
                </div>
                <div class="c-body">
                  <div class="c-header">
                    <span class="c-name">{{ c.user_nick || c.user_name }}</span>
                    <span class="c-time">{{ formatTime(c.created_at) }}</span>
                    <button
                      v-if="canDeleteComment(c)"
                      class="c-del-btn"
                      @click="deleteComment(post, c)"
                    >删除</button>
                  </div>
                  <div class="c-content">{{ c.content }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-comment">暂无评论，来说点什么吧</div>
            <div class="comment-input-row">
              <el-input
                v-model="commentText"
                placeholder="写下你的评论..."
                size="small"
                style="flex:1"
                @keyup.enter="submitComment(post)"
              />
              <el-button size="small" type="primary" @click="submitComment(post)">发送</el-button>
            </div>
          </div>
        </div>

        <!-- 助农任务卡片 -->
        <div v-if="post.type === 2" class="post-card task-card">
          <div class="task-main">
            <div class="task-content">
              <div class="author-row">
                <div class="avatar" :style="avatarStyle(post.user_nick || post.user_name)">
                  {{ (post.user_nick || post.user_name || '?')[0] }}
                </div>
                <div class="author-info">
                  <span class="author-name">{{ post.user_nick || post.user_name }}</span>
                  <span class="post-time">{{ formatTime(post.created_at) }}</span>
                </div>
                <span class="type-tag task-tag">助农任务</span>
                <span :class="['status-tag', statusClass(post)]">{{ statusText(post) }}</span>
              </div>
              <div class="post-title">{{ post.title }}</div>
              <div class="post-content">{{ post.content }}</div>

              <!-- 任务信息条 -->
              <div class="task-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M5 1v4M11 1v4M2 7h12"/></svg>
                  {{ formatDate(post.start_time) }} — {{ formatDate(post.end_time) }}
                </span>
                <span class="meta-item">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13"><circle cx="8" cy="6" r="3"/><path d="M2 14a6 6 0 0 1 12 0"/></svg>
                  {{ post.location }}
                </span>
                <span class="meta-item reward-text">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="13" height="13"><circle cx="8" cy="8" r="6"/><path d="M8 5v6M5.5 7.5h4a1 1 0 0 1 0 2h-4"/></svg>
                  {{ post.reward }}
                </span>
              </div>

              <!-- 报名进度条 -->
              <div class="signup-progress">
                <div class="progress-bar-bg">
                  <div
                    class="progress-bar-fill"
                    :style="{ width: progressWidth(post) + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ post.signup_count }} / {{ post.max_people }} 人</span>
              </div>

              <div class="action-row">
                <button :class="['action-btn', { liked: post.is_liked }]" @click="toggleLike(post)">
                  <svg viewBox="0 0 16 16" :fill="post.is_liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.5" width="15" height="15">
                    <path d="M8 14s-6-3.5-6-8a4 4 0 0 1 6-3.44A4 4 0 0 1 14 6c0 4.5-6 8-6 8z"/>
                  </svg>
                  {{ post.like_count }}
                </button>
                <button class="action-btn" @click="openComment(post)">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
                    <path d="M14 10a2 2 0 0 1-2 2H5l-3 2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/>
                  </svg>
                  {{ post.comment_count }}
                </button>
                <!-- 农户/管理员：查看报名名单 -->
                <button
                  v-if="canViewSignups(post)"
                  class="action-btn"
                  @click="openSignupList(post)"
                >查看报名</button>
                <!-- 客户：报名/取消报名 -->
                <template v-if="isClient">
                  <el-button
                    v-if="!post.is_signed_up"
                    size="small"
                    type="success"
                    :disabled="post.signup_count >= post.max_people || post.status === 2"
                    @click="signup(post)"
                  >{{ post.signup_count >= post.max_people ? '已满员' : '立即报名' }}</el-button>
                  <el-button
                    v-else
                    size="small"
                    type="warning"
                    @click="cancelSignup(post)"
                  >取消报名</el-button>
                </template>
                <button
                  v-if="canDelete(post)"
                  class="action-btn delete-btn"
                  @click="deletePost(post)"
                >删除</button>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div v-if="commentPostId === post.id" class="comment-section">
            <div v-if="post._comments && post._comments.length" class="comment-list">
              <div v-for="c in post._comments" :key="c.id" class="comment-item">
                <div class="c-avatar" :style="avatarStyle(c.user_nick || c.user_name)">
                  {{ (c.user_nick || c.user_name || '?')[0] }}
                </div>
                <div class="c-body">
                  <div class="c-header">
                    <span class="c-name">{{ c.user_nick || c.user_name }}</span>
                    <span class="c-time">{{ formatTime(c.created_at) }}</span>
                    <button
                      v-if="canDeleteComment(c)"
                      class="c-del-btn"
                      @click="deleteComment(post, c)"
                    >删除</button>
                  </div>
                  <div class="c-content">{{ c.content }}</div>
                </div>
              </div>
            </div>
            <div v-else class="no-comment">暂无评论，来说点什么吧</div>
            <div class="comment-input-row">
              <el-input
                v-model="commentText"
                placeholder="写下你的评论..."
                size="small"
                style="flex:1"
                @keyup.enter="submitComment(post)"
              />
              <el-button size="small" type="primary" @click="submitComment(post)">发送</el-button>
            </div>
          </div>
        </div>

      </template>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrap" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchPosts"
      />
    </div>

    <!-- ===== 发帖弹窗 ===== -->
    <el-dialog v-model="postDialogVisible" title="发布帖子" width="560px" :close-on-click-modal="false">
      <el-form :model="postForm" :rules="postRules" ref="postFormRef" label-width="90px">
        <el-form-item label="帖子类型" prop="type">
          <el-radio-group v-model="postForm.type">
            <el-radio :label="1">好物推荐</el-radio>
            <el-radio :label="2">助农任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="postForm.content" type="textarea" :rows="4" placeholder="分享详情..." maxlength="1000" show-word-limit />
        </el-form-item>

        <!-- 好物推荐：图片上传 -->
        <el-form-item v-if="postForm.type === 1" label="配图">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
            accept="image/*"
          >
            <div class="upload-area">
              <img v-if="postForm.image" :src="postForm.image" class="upload-preview" />
              <div v-else class="upload-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>点击上传图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>

        <!-- 助农任务：额外字段 -->
        <template v-if="postForm.type === 2">
          <el-form-item label="任务报酬" prop="reward">
            <el-input v-model="postForm.reward" placeholder="如：180元/天、面议" />
          </el-form-item>
          <el-form-item label="开始时间" prop="start_time">
            <el-date-picker
              v-model="postForm.start_time"
              type="datetime"
              placeholder="选择开始时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="end_time">
            <el-date-picker
              v-model="postForm.end_time"
              type="datetime"
              placeholder="选择结束时间"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width:100%"
            />
          </el-form-item>
          <el-form-item label="任务地点" prop="location">
            <el-input v-model="postForm.location" placeholder="如：云南昭通苹果园" />
          </el-form-item>
          <el-form-item label="招募人数" prop="max_people">
            <el-input-number v-model="postForm.max_people" :min="1" :max="9999" style="width:100%" />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button @click="postDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="postSubmitting" @click="submitPost">发布</el-button>
      </template>
    </el-dialog>

    <!-- ===== 报名名单弹窗 ===== -->
    <el-dialog v-model="signupListVisible" title="报名名单" width="480px">
      <el-empty v-if="signupList.length === 0" description="暂无报名" :image-size="60" />
      <div v-else class="signup-list">
        <div v-for="(s, i) in signupList" :key="s.id" class="signup-item">
          <span class="signup-no">{{ i + 1 }}</span>
          <div class="signup-avatar" :style="avatarStyle(s.user_nick || s.user_name)">
            {{ (s.user_nick || s.user_name || '?')[0] }}
          </div>
          <div class="signup-info">
            <span class="signup-name">{{ s.user_nick || s.user_name }}</span>
            <span class="signup-tel">{{ s.tel }}</span>
          </div>
          <span class="signup-time">{{ formatTime(s.created_at) }}</span>
        </div>
      </div>
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
const isClient = computed(() => currentUser.value?.authority === 2)
const canPost  = computed(() => isAdmin.value || isFarmer.value)

// ── Tab ──
const tabs = [
  { label: '全部',     value: 0 },
  { label: '好物推荐', value: 1 },
  { label: '助农任务', value: 2 },
]
const activeTab = ref(0)

// ── 列表状态 ──
const posts       = ref([])
const loading     = ref(false)
const total       = ref(0)
const currentPage = ref(1)
const pageSize    = ref(10)

// ── 评论状态 ──
const commentPostId = ref(null)
const commentText   = ref('')

// ── 报名名单 ──
const signupListVisible = ref(false)
const signupList        = ref([])

// ── 发帖弹窗 ──
const postDialogVisible = ref(false)
const postSubmitting    = ref(false)
const postFormRef       = ref(null)
const postForm = ref({
  type: 1, title: '', content: '', image: '',
  reward: '', start_time: '', end_time: '', location: '', max_people: 1
})

const postRules = {
  type:       [{ required: true, message: '请选择类型', trigger: 'change' }],
  title:      [{ required: true, message: '请输入标题', trigger: 'blur' },
               { max: 100, message: '标题最多100个字符', trigger: 'blur' }],
  content:    [{ required: true, message: '请输入正文', trigger: 'blur' }],
  reward:     [{ required: true, message: '请输入任务报酬', trigger: 'blur' }],
  start_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  end_time:   [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  location:   [{ required: true, message: '请输入任务地点', trigger: 'blur' }],
  max_people: [{ required: true, type: 'number', message: '请输入招募人数', trigger: 'blur' }],
}

// ── 获取帖子列表 ──
const fetchPosts = async () => {
  loading.value = true
  try {
    const params = { page: currentPage.value, limit: pageSize.value }
    if (activeTab.value !== 0) params.type = activeTab.value
    const res = await axios.get(`${apiUrl}/community/posts`, { params })
    // 为每条帖子注入当前用户是否点赞/报名（详情接口才有，列表先给默认值）
    posts.value = (res.data.data || []).map(p => ({ ...p, _comments: null, is_liked: false, is_signed_up: false }))
    total.value = res.data.total || 0
    // 批量拉取每条帖子的点赞/报名状态
    if (currentUser.value?.id) {
      posts.value.forEach(async (post) => {
        try {
          const detail = await axios.get(`${apiUrl}/community/posts/${post.id}`, {
            params: { user_id: currentUser.value.id }
          })
          post.is_liked      = detail.data.data.is_liked
          post.is_signed_up  = detail.data.data.is_signed_up
        } catch {}
      })
    }
  } catch {
    ElMessage.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

const switchTab = (val) => {
  activeTab.value   = val
  currentPage.value = 1
  fetchPosts()
}

// ── 点赞 ──
const toggleLike = async (post) => {
  if (!currentUser.value?.id) return ElMessage.warning('请先登录')
  try {
    const res = await axios.post(`${apiUrl}/community/posts/${post.id}/like`, {
      user_id: currentUser.value.id
    })
    post.is_liked   = res.data.liked
    post.like_count += res.data.liked ? 1 : -1
  } catch {
    ElMessage.error('操作失败')
  }
}

// ── 评论 ──
const openComment = async (post) => {
  if (commentPostId.value === post.id) {
    commentPostId.value = null
    return
  }
  commentPostId.value = post.id
  commentText.value   = ''
  if (!post._comments) {
    try {
      const res = await axios.get(`${apiUrl}/community/posts/${post.id}/comments`)
      post._comments = res.data.data || []
    } catch {
      post._comments = []
    }
  }
}

const submitComment = async (post) => {
  if (!commentText.value.trim()) return ElMessage.warning('评论内容不能为空')
  if (!currentUser.value?.id) return ElMessage.warning('请先登录')
  try {
    await axios.post(`${apiUrl}/community/posts/${post.id}/comments`, {
      user_id: currentUser.value.id,
      content: commentText.value.trim()
    })
    post.comment_count++
    // 重新拉取评论列表
    const res = await axios.get(`${apiUrl}/community/posts/${post.id}/comments`)
    post._comments = res.data.data || []
    commentText.value = ''
    ElMessage.success('评论成功')
  } catch {
    ElMessage.error('评论失败')
  }
}

const deleteComment = async (post, comment) => {
  try {
    await ElMessageBox.confirm('确定删除该评论吗？', '提示', { type: 'warning' })
    await axios.delete(`${apiUrl}/community/posts/${post.id}/comments/${comment.id}`, {
      data: { user_id: currentUser.value.id, authority: currentUser.value.authority }
    })
    post._comments    = post._comments.filter(c => c.id !== comment.id)
    post.comment_count = Math.max(0, post.comment_count - 1)
    ElMessage.success('删除成功')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// ── 删除帖子 ──
const deletePost = async (post) => {
  try {
    await ElMessageBox.confirm('确定删除该帖子吗？', '提示', { type: 'warning' })
    await axios.delete(`${apiUrl}/community/posts/${post.id}`, {
      data: { user_id: currentUser.value.id, authority: currentUser.value.authority }
    })
    posts.value = posts.value.filter(p => p.id !== post.id)
    ElMessage.success('删除成功')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

// ── 报名 ──
const signup = async (post) => {
  if (!currentUser.value?.id) return ElMessage.warning('请先登录')
  try {
    await ElMessageBox.confirm(`确定报名「${post.title}」吗？`, '提示', { type: 'info' })
    await axios.post(`${apiUrl}/community/posts/${post.id}/signup`, {
      user_id: currentUser.value.id
    })
    post.is_signed_up = true
    post.signup_count++
    ElMessage.success('报名成功！')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error(e?.response?.data?.message || '报名失败')
  }
}

const cancelSignup = async (post) => {
  try {
    await ElMessageBox.confirm('确定取消报名吗？', '提示', { type: 'warning' })
    await axios.delete(`${apiUrl}/community/posts/${post.id}/signup`, {
      data: { user_id: currentUser.value.id }
    })
    post.is_signed_up = false
    post.signup_count = Math.max(0, post.signup_count - 1)
    ElMessage.success('已取消报名')
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('取消失败')
  }
}

// ── 查看报名名单 ──
const openSignupList = async (post) => {
  try {
    const res = await axios.get(`${apiUrl}/community/posts/${post.id}/signups`, {
      params: { user_id: currentUser.value.id, authority: currentUser.value.authority }
    })
    signupList.value        = res.data.data || []
    signupListVisible.value = true
  } catch {
    ElMessage.error('获取报名名单失败')
  }
}

// ── 发帖 ──
const openPostDialog = () => {
  postForm.value = {
    type: 1, title: '', content: '', image: '',
    reward: '', start_time: '', end_time: '', location: '', max_people: 1
  }
  postDialogVisible.value = true
}

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => { postForm.value.image = e.target.result }
  reader.readAsDataURL(file.raw)
}

const submitPost = async () => {
  if (!postFormRef.value) return
  // 动态校验：只有 type=2 才校验任务字段
  const rulesToValidate = ['type', 'title', 'content']
  if (postForm.value.type === 2) {
    rulesToValidate.push('reward', 'start_time', 'end_time', 'location', 'max_people')
  }
  try {
    await postFormRef.value.validateField(rulesToValidate)
  } catch {
    return
  }
  postSubmitting.value = true
  try {
    await axios.post(`${apiUrl}/community/posts`, {
      user_id:    currentUser.value.id,
      type:       postForm.value.type,
      title:      postForm.value.title,
      content:    postForm.value.content,
      image:      postForm.value.image || null,
      reward:     postForm.value.type === 2 ? postForm.value.reward     : null,
      start_time: postForm.value.type === 2 ? postForm.value.start_time : null,
      end_time:   postForm.value.type === 2 ? postForm.value.end_time   : null,
      location:   postForm.value.type === 2 ? postForm.value.location   : null,
      max_people: postForm.value.type === 2 ? postForm.value.max_people : null,
    })
    ElMessage.success('发布成功')
    postDialogVisible.value = false
    currentPage.value = 1
    fetchPosts()
  } catch {
    ElMessage.error('发布失败')
  } finally {
    postSubmitting.value = false
  }
}

// ── 权限判断 ──
const canDelete = (post) => {
  if (!currentUser.value?.id) return false
  return isAdmin.value || post.user_id === currentUser.value.id
}
const canDeleteComment = (comment) => {
  if (!currentUser.value?.id) return false
  return isAdmin.value || comment.user_id === currentUser.value.id
}
const canViewSignups = (post) => {
  if (!currentUser.value?.id) return false
  return isAdmin.value || (isFarmer.value && post.user_id === currentUser.value.id)
}

// ── 工具函数 ──
const progressWidth = (post) => {
  if (!post.max_people) return 0
  return Math.min(Math.round((post.signup_count / post.max_people) * 100), 100)
}

const statusText = (post) => {
  if (post.status === 0) return '已下架'
  if (post.status === 2) return '已结束'
  if (post.signup_count >= post.max_people) return '已满员'
  return '招募中'
}
const statusClass = (post) => {
  if (post.status === 0 || post.status === 2) return 'tag-ended'
  if (post.signup_count >= post.max_people)   return 'tag-full'
  return 'tag-open'
}

const formatTime = (t) => {
  if (!t) return ''
  const d = new Date(t)
  const now = new Date()
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60)     return '刚刚'
  if (diff < 3600)   return Math.floor(diff / 60) + '分钟前'
  if (diff < 86400)  return Math.floor(diff / 3600) + '小时前'
  if (diff < 604800) return Math.floor(diff / 86400) + '天前'
  return d.toLocaleDateString('zh-CN')
}
const formatDate = (t) => {
  if (!t) return '—'
  return new Date(t).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

const avatarColors = ['#C0DD97,#3B6D11', '#B5D4F4,#185FA5', '#F5C4B3,#993C1D', '#CECBF6,#3C3489', '#9FE1CB,#0F6E56', '#FAC775,#854F0B']
const avatarStyle = (name) => {
  const idx = name ? name.charCodeAt(0) % avatarColors.length : 0
  const [bg, color] = avatarColors[idx].split(',')
  return { background: bg, color }
}

onMounted(fetchPosts)
</script>

<style scoped lang="scss">
.community {
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

// ── 顶部栏 ──
.community-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.header-title {
  font-size: 22px;
  font-weight: 600;
  color: #1a2e1a;
  margin: 0 0 2px;
}
.header-sub {
  font-size: 13px;
  color: #7a9a7a;
  margin: 0;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.tabs {
  display: flex;
  background: #f3f6f3;
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}
.tab-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  color: #7a9a7a;
  font-family: inherit;
  transition: all .15s;
  &.active {
    background: white;
    color: #1a2e1a;
    font-weight: 500;
    box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
}
.post-btn {
  height: 34px;
}

// ── 帖子列表 ──
.post-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 200px;
}

// ── 通用卡片 ──
.post-card {
  background: white;
  border-radius: 14px;
  border: 0.5px solid #e8ede8;
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
  &:hover {
    border-color: #c8d8c8;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
}

// ── 好物推荐卡片 ──
.goods-card .card-main {
  display: flex;
  gap: 0;
  padding: 18px 20px 14px;
}
.card-left {
  flex: 1;
  min-width: 0;
}
.card-img-wrap {
  width: 110px;
  height: 110px;
  flex-shrink: 0;
  margin-left: 16px;
  border-radius: 10px;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// ── 助农任务卡片 ──
.task-card .task-main {
  padding: 18px 20px 14px;
}
.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 10px 0;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #7a9a7a;
}
.reward-text {
  color: #BA7517;
  font-weight: 500;
}
.signup-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0 2px;
}
.progress-bar-bg {
  flex: 1;
  height: 5px;
  background: #f0f4f0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: #42b983;
  border-radius: 3px;
  transition: width .3s;
}
.progress-text {
  font-size: 12px;
  color: #7a9a7a;
  white-space: nowrap;
}

// ── 通用行 ──
.author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}
.author-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}
.author-name {
  font-size: 13px;
  font-weight: 500;
  color: #2a3a2a;
}
.post-time {
  font-size: 11px;
  color: #aaa;
}
.type-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}
.goods-tag {
  background: #EAF3DE;
  color: #3B6D11;
}
.task-tag {
  background: #E6F1FB;
  color: #185FA5;
}
.status-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
}
.tag-open   { background: #EAF3DE; color: #3B6D11; }
.tag-full   { background: #F1EFE8; color: #5F5E5A; }
.tag-ended  { background: #FCEBEB; color: #A32D2D; }

.post-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2e1a;
  margin-bottom: 6px;
  line-height: 1.4;
}
.post-content {
  font-size: 13px;
  color: #4a6a4a;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// ── 操作行 ──
.action-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #7a9a7a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-family: inherit;
  transition: all .15s;
  &:hover { background: #f3f6f3; color: #2d8a5e; }
  &.liked { color: #E24B4A; }
  &.delete-btn {
    color: #E24B4A;
    margin-left: auto;
    &:hover { background: #FCEBEB; }
  }
}

// ── 评论区 ──
.comment-section {
  border-top: 0.5px solid #f0f4f0;
  background: #fafcfa;
  padding: 14px 20px 16px;
}
.comment-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 12px;
}
.comment-item {
  display: flex;
  gap: 8px;
}
.c-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  margin-top: 2px;
}
.c-body { flex: 1; min-width: 0; }
.c-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}
.c-name { font-size: 12px; font-weight: 500; color: #2a3a2a; }
.c-time { font-size: 11px; color: #bbb; }
.c-del-btn {
  margin-left: auto;
  font-size: 11px;
  color: #E24B4A;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  &:hover { text-decoration: underline; }
}
.c-content { font-size: 13px; color: #4a6a4a; line-height: 1.5; }
.no-comment {
  font-size: 12px;
  color: #bbb;
  text-align: center;
  padding: 12px 0;
  margin-bottom: 10px;
}
.comment-input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

// ── 分页 ──
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

// ── 发帖弹窗 ──
.upload-area {
  width: 120px;
  height: 120px;
  border: 1px dashed #d0d8d0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color .15s;
  &:hover { border-color: #42b983; }
}
.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #aaa;
  font-size: 12px;
}

// ── 报名名单 ──
.signup-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.signup-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 0.5px solid #f0f4f0;
  &:last-child { border-bottom: none; }
}
.signup-no {
  font-size: 12px;
  color: #bbb;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}
.signup-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}
.signup-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.signup-name { font-size: 13px; font-weight: 500; color: #2a3a2a; }
.signup-tel  { font-size: 12px; color: #7a9a7a; }
.signup-time { font-size: 11px; color: #bbb; white-space: nowrap; }
</style>