<template>
  <div class="chat-page">

    <!-- 左侧：历史会话列表 -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">历史咨询</span>
        <button class="new-btn" @click="createNewSession" title="新建对话">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <line x1="7" y1="1" x2="7" y2="13"/>
            <line x1="1" y1="7" x2="13" y2="7"/>
          </svg>
        </button>
      </div>

      <div class="session-list">
        <div
          v-for="session in sessions"
          :key="session.id"
          :class="['session-item', { active: currentSessionId === session.id }]"
          @click="switchSession(session.id)"
        >
          <div class="session-item-main">
            <div class="session-title">{{ session.title }}</div>
            <div class="session-time">{{ session.time }}</div>
            <div class="session-preview">{{ session.preview }}</div>
          </div>
          <button
            class="session-del-btn"
            @click.stop="deleteSession(session.id)"
            title="删除"
          >
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11">
              <line x1="2" y1="2" x2="10" y2="10"/>
              <line x1="10" y1="2" x2="2" y2="10"/>
            </svg>
          </button>
        </div>

        <div v-if="sessions.length === 0" class="session-empty">
          暂无历史咨询
        </div>
      </div>
    </aside>

    <!-- 右侧：对话区 -->
    <div class="chat-area">

      <!-- 顶部标题 -->
      <div class="chat-header">
        <div class="chat-header-icon">
          <svg viewBox="0 0 20 20" fill="none" stroke="#42b983" stroke-width="1.5" width="20" height="20">
            <circle cx="10" cy="10" r="8"/>
            <path d="M7 10.5s.8 1.5 3 1.5 3-1.5 3-1.5"/>
            <circle cx="7.5" cy="8" r="0.8" fill="#42b983"/>
            <circle cx="12.5" cy="8" r="0.8" fill="#42b983"/>
          </svg>
        </div>
        <div>
          <div class="chat-header-title">AI 农业助手</div>
          <div class="chat-header-sub">{{ currentSession ? currentSession.title : '新对话' }}</div>
        </div>
        <span class="context-badge">上下文记忆中</span>
      </div>

      <!-- 消息列表 -->
      <div class="messages-wrap" ref="messagesWrap">
        <div v-if="!currentSession || currentSession.messages.length === 0" class="chat-welcome">
          <div class="welcome-icon">
            <svg viewBox="0 0 48 48" fill="none" stroke="#42b983" stroke-width="1.5" width="48" height="48">
              <circle cx="24" cy="24" r="20"/>
              <path d="M16 28s2 4 8 4 8-4 8-4"/>
              <circle cx="18" cy="21" r="2" fill="#42b983" stroke="none"/>
              <circle cx="30" cy="21" r="2" fill="#42b983" stroke="none"/>
            </svg>
          </div>
          <p class="welcome-text">你好！我是 AI 农业助手</p>
          <p class="welcome-sub">可以问我农事活动、种植技术、病虫害防治、农产品行情等问题</p>
          <div class="suggest-grid">
            <div
              v-for="s in suggestions"
              :key="s"
              class="suggest-card"
              @click="fillInput(s)"
            >{{ s }}</div>
          </div>
        </div>

        <template v-if="currentSession">
          <div
            v-for="(msg, index) in currentSession.messages"
            :key="index"
            :class="['message', msg.role === 'user' ? 'message-user' : 'message-ai']"
          >
            <div :class="['msg-avatar', msg.role === 'user' ? 'user-avatar' : 'ai-avatar']">
              {{ msg.role === 'user' ? '我' : 'AI' }}
            </div>
            <div class="msg-body">
              <div
                :class="['bubble', msg.role === 'user' ? 'bubble-user' : 'bubble-ai']"
                v-html="formatMessage(msg.content)"
              ></div>
              <div class="msg-time">{{ msg.time }}</div>
            </div>
          </div>

          <!-- 加载动画 -->
          <div v-if="isLoading" class="message message-ai">
            <div class="msg-avatar ai-avatar">AI</div>
            <div class="msg-body">
              <div class="bubble bubble-ai typing-bubble">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- 快捷提问词（有消息后显示） -->
      <div v-if="currentSession && currentSession.messages.length > 0 && !isLoading" class="suggest-row">
        <div
          v-for="s in quickSuggests"
          :key="s"
          class="suggest-chip"
          @click="fillInput(s)"
        >{{ s }}</div>
      </div>

      <!-- 输入区 -->
      <div class="input-area">
        <div class="input-wrap" :class="{ focused: inputFocused }">
          <textarea
            v-model="inputText"
            ref="inputRef"
            placeholder="输入你的农业问题，按 Enter 发送，Shift+Enter 换行..."
            rows="1"
            :disabled="isLoading"
            @focus="inputFocused = true"
            @blur="inputFocused = false"
            @keydown.enter.exact.prevent="sendMessage"
            @input="autoResize"
          ></textarea>
        </div>
        <button
          class="send-btn"
          :disabled="isLoading || !inputText.trim()"
          @click="sendMessage"
        >
          <svg v-if="!isLoading" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="2" width="15" height="15">
            <line x1="14" y1="2" x2="2" y2="8"/>
            <line x1="14" y1="2" x2="8" y2="14"/>
            <line x1="2" y1="8" x2="8" y2="14"/>
          </svg>
          <svg v-else viewBox="0 0 16 16" fill="white" width="14" height="14">
            <circle cx="4" cy="8" r="1.5"><animate attributeName="opacity" values="1;0.3;1" dur="1s" begin="0s" repeatCount="indefinite"/></circle>
            <circle cx="8" cy="8" r="1.5"><animate attributeName="opacity" values="1;0.3;1" dur="1s" begin="0.2s" repeatCount="indefinite"/></circle>
            <circle cx="12" cy="8" r="1.5"><animate attributeName="opacity" values="1;0.3;1" dur="1s" begin="0.4s" repeatCount="indefinite"/></circle>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import OpenAI from 'openai'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// ── DeepSeek 配置 ──
const apiKey = 'sk-4478a000a36f43ec828df825e6a28f30'
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey,
  dangerouslyAllowBrowser: true
})

// ── 系统提示词 ──
const SYSTEM_PROMPT = `你是一个专业的农业助手，服务于"智慧助农电商平台"。你擅长解答：
- 农作物种植技术与管理
- 病虫害识别与防治
- 土壤肥料与施肥方案
- 农产品市场行情与定价
- 大棚/温室管理
- 农业政策与补贴咨询
请用简洁、专业、易懂的语言回答，必要时给出具体的操作建议。`

// ── 静态历史会话（演示用） ──
const staticSessions = [
  {
    id: 1,
    title: '苹果树病虫害防治',
    time: '今天 09:12',
    preview: '苹果树叶片出现黄斑...',
    messages: [
      { role: 'assistant', content: '你好！我是 AI 农业助手，有什么农业问题都可以问我，包括种植技术、病虫害防治、施肥方案等。', time: '09:12' },
      { role: 'user', content: '我的苹果树叶片出现黄色斑点，边缘有红褐色晕圈，直径大概3-5mm，是什么病？', time: '09:13' },
      { role: 'assistant', content: '根据你描述的**圆形黄斑、直径3-5mm、边缘红褐色晕圈**，这是典型的**斑点落叶病**症状。\n\n**防治方案：**\n- 喷施 50% 扑海因可湿性粉剂 1000 倍液，每7天一次，连喷2-3次\n- 也可使用 70% 代森锰锌 500 倍液替代，成本更低\n- 及时清除病叶，集中烧毁，减少菌源\n- 加强果园通风，降低湿度\n\n发病初期防治效果最好，请尽快处理。目前发病面积大概有多少？', time: '09:14' },
      { role: 'user', content: '大概30%的叶片有问题，已经有几片叶子开始脱落了', time: '09:16' },
      { role: 'assistant', content: '发病率30%且已有落叶，属于**中度发病**，需要立即采取措施。\n\n**紧急处理步骤：**\n1. 今天就清除并销毁已发病叶片\n2. 明天早晨（露水干后）喷第一次药\n3. 喷药要均匀，叶片正反面都要覆盖\n4. 7天后喷第二次，共喷3次\n\n**注意事项：**\n- 喷药避开中午高温时段，早晨或傍晚为佳\n- 近期若有降雨，雨后需补喷一次\n- 同时可叶面喷施0.3%磷酸二氢钾，增强树体抗病能力\n\n处理后大约2周可以看到明显好转。', time: '09:17' },
    ]
  },
  {
    id: 2,
    title: '冬季大棚温度管理',
    time: '昨天 14:33',
    preview: '冬季大棚应该保持什么温度...',
    messages: [
      { role: 'assistant', content: '你好！我是 AI 农业助手，关于大棚种植管理有什么问题都可以问我。', time: '14:33' },
      { role: 'user', content: '冬季大棚应该保持什么温度比较合适？我种的是番茄和黄瓜', time: '14:34' },
      { role: 'assistant', content: '番茄和黄瓜都属于喜温蔬菜，冬季大棚温度管理如下：\n\n**番茄：**\n- 白天：20-25°C（最适生长温度）\n- 夜间：不低于 10°C，最好保持在 12-15°C\n- 低于 8°C 会导致落花落果\n\n**黄瓜：**\n- 白天：25-30°C\n- 夜间：不低于 12°C，最好 15°C 以上\n- 对低温更敏感，低于 10°C 生长停滞\n\n**实用建议：**\n- 晴天上午揭帘后及时通风，防止温度过高\n- 下午3点前关闭通风口，保温\n- 寒潮来临前加盖一层保温被或无纺布\n- 可在棚内设置温度计，重点监测凌晨最低温', time: '14:36' },
      { role: 'user', content: '最近几天有寒潮，夜间最低气温会到-8°C，怎么保温？', time: '14:38' },
      { role: 'assistant', content: '遇到-8°C的极寒天气，普通大棚保温压力很大，需要多重措施叠加：\n\n**外部保温：**\n- 外层加盖防寒草帘或保温被，这是最关键的\n- 大棚四周底部用土压实，防止冷风灌入\n- 检查棚膜有无破损，及时修补\n\n**内部保温：**\n- 在大棚内搭二层膜（小拱棚），可额外保温3-5°C\n- 棚内走道覆盖稻草或麦秸，减少地面散热\n\n**加温措施（如果条件允许）：**\n- 临时使用热风炉或暖风机，寒潮期间夜间开启\n- 烧蜂窝煤炉也可以，注意通风防一氧化碳中毒\n\n寒潮预计持续几天？如果超过3天，建议一定要配备加温设备。', time: '14:40' },
    ]
  },
  {
    id: 3,
    title: '土壤施肥方案咨询',
    time: '7月15日',
    preview: '有机肥和化肥的比例怎么配...',
    messages: [
      { role: 'assistant', content: '你好！关于土壤改良和施肥方案，我来帮你分析。', time: '10:20' },
      { role: 'user', content: '有机肥和化肥的比例怎么搭配比较好？我种的是蔬菜，土地用了十几年了', time: '10:21' },
      { role: 'assistant', content: '种了十几年蔬菜的老菜地，土壤板结和盐分积累是常见问题，施肥方案需要侧重改良土壤。\n\n**推荐配比（以每亩为例）：**\n- 有机肥：3000-4000斤（腐熟农家肥或商品有机肥）\n- 化肥：氮磷钾复合肥 50 斤左右\n- 有机肥占比约 70%，化肥约 30%\n\n**为什么要多施有机肥：**\n- 改善板结土壤，提高透气性\n- 补充土壤微生物，增强自净能力\n- 降低盐分浓度，改善根系环境\n- 减少化肥用量，降低成本\n\n**施用方法：**\n- 有机肥在整地前撒施翻入土中\n- 化肥分两次施：底肥50%、追肥50%\n- 建议每2-3年做一次土壤检测', time: '10:23' },
      { role: 'user', content: '土壤检测在哪里做？大概多少钱？', time: '10:25' },
      { role: 'assistant', content: '土壤检测有几个渠道可以选择：\n\n**免费渠道：**\n- 当地**农业农村局**或**土肥站**：很多地区提供免费检测服务，建议先打电话咨询\n- **农技推广站**：部分地区有补贴，可免费检测基础项目（pH、有机质、氮磷钾）\n\n**付费渠道：**\n- 农业大学或农科院检测中心：基础套餐 50-150 元，全套 200-500 元\n- 专业土壤检测机构：价格类似，但出报告更快\n- 电商平台也有土壤检测试剂盒：20-50 元，自己操作，精度较低但够用\n\n**建议检测项目：**\n- pH值、有机质含量、氮磷钾含量（基础项，够用）\n- 如果蔬菜长势异常，加测微量元素\n\n你在哪个省市？我可以给你更具体的建议。', time: '10:27' },
    ]
  }
]

// ── 状态 ──
const sessions     = ref([...staticSessions])
const currentSessionId = ref(1)
const inputText    = ref('')
const isLoading    = ref(false)
const inputFocused = ref(false)
const messagesWrap = ref(null)
const inputRef     = ref(null)

// ── 建议词 ──
const suggestions = [
  '我的蔬菜叶片发黄是什么原因？',
  '如何提高农产品的销售价格？',
  '冬季大棚怎么保温？',
  '土壤板结怎么改良？',
  '有机肥和化肥怎么搭配？',
  '最近有什么农业补贴政策？',
]

const quickSuggests = ref([
  '能详细说说防治方法吗？',
  '有没有更便宜的替代方案？',
  '大概需要多长时间见效？',
])

// ── 计算属性 ──
const currentSession = computed(() =>
  sessions.value.find(s => s.id === currentSessionId.value) || null
)

// ── 工具函数 ──
const getTime = () => {
  const n = new Date()
  return n.getHours().toString().padStart(2, '0') + ':' + n.getMinutes().toString().padStart(2, '0')
}

const formatMessage = (content) => {
  return DOMPurify.sanitize(marked.parse(content || ''))
}

const scrollToBottom = async () => {
  await nextTick()
  if (messagesWrap.value) {
    messagesWrap.value.scrollTop = messagesWrap.value.scrollHeight
  }
}

const autoResize = () => {
  const el = inputRef.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 120) + 'px'
}

// ── 会话管理 ──
const switchSession = (id) => {
  currentSessionId.value = id
  nextTick(scrollToBottom)
}

const createNewSession = () => {
  const id = Date.now()
  sessions.value.unshift({
    id,
    title: '新对话',
    time: getTime(),
    preview: '刚刚创建...',
    messages: []
  })
  currentSessionId.value = id
}

const deleteSession = (id) => {
  const idx = sessions.value.findIndex(s => s.id === id)
  if (idx === -1) return
  sessions.value.splice(idx, 1)
  // 删完后切到第一个，没有则清空
  if (sessions.value.length > 0) {
    currentSessionId.value = sessions.value[0].id
  } else {
    currentSessionId.value = null
  }
}

// ── 发送消息 ──
const fillInput = (text) => {
  inputText.value = text
  nextTick(() => {
    inputRef.value?.focus()
    autoResize()
  })
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  // 如果没有当前会话，自动新建
  if (!currentSession.value) createNewSession()

  const session = currentSession.value
  inputText.value = ''
  nextTick(() => {
    if (inputRef.value) inputRef.value.style.height = 'auto'
  })

  // 自动命名（第一条消息时）
  if (session.messages.length === 0) {
    session.title   = text.slice(0, 12) + (text.length > 12 ? '...' : '')
    session.preview = text.slice(0, 20)
  }

  // 添加用户消息
  session.messages.push({ role: 'user', content: text, time: getTime() })
  await scrollToBottom()

  isLoading.value = true

  try {
    // 构建完整历史（携带上下文）
    const historyMessages = session.messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content
    }))

    let fullReply = ''

    // 尝试流式响应
    try {
      const stream = await openai.chat.completions.create({
        model: 'deepseek-chat',
        stream: true,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...historyMessages,
          { role: 'user', content: text }
        ]
      })

      // 先插入一条空的 AI 消息，再流式填充
      session.messages.push({ role: 'assistant', content: '', time: getTime() })
      const aiMsg = session.messages[session.messages.length - 1]

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          fullReply += delta
          aiMsg.content = fullReply
          await scrollToBottom()
        }
      }
    } catch {
      // 流式失败，降级普通请求
      const res = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...historyMessages,
          { role: 'user', content: text }
        ]
      })
      fullReply = res.choices[0].message.content
      session.messages.push({ role: 'assistant', content: fullReply, time: getTime() })
    }

    // 更新侧边栏预览
    session.preview = fullReply.slice(0, 20).replace(/[#*`]/g, '') + '...'
    session.time    = getTime()

    // 更新快捷提问词（简单轮换）
    quickSuggests.value = [
      '能详细说说吗？',
      '有没有更简单的方法？',
      '还有其他需要注意的吗？',
    ]

  } catch (e) {
    session.messages.push({
      role: 'assistant',
      content: '抱歉，请求出错了，请检查网络后重试。',
      time: getTime()
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

// ── 监听消息变化自动滚动 ──
watch(
  () => currentSession.value?.messages?.length,
  () => scrollToBottom(),
  { flush: 'post' }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped lang="scss">
.chat-page {
  width: 1200px;
  display: flex;
  height: calc(100vh - 60px - 48px);
  min-height: 500px;
  flex: 1;
  background: #f3f6f3;
  overflow: hidden;
}

// ── 左侧侧边栏 ──
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: white;
  border-right: 1px solid #e8ede8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px 12px;
  border-bottom: 1px solid #f0f4f0;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a2e1a;
}

.new-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid #e0e8e0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7a9a7a;
  transition: all .15s;
  &:hover {
    border-color: #42b983;
    color: #42b983;
    background: #f0faf5;
  }
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 8px;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #d8e8d8; border-radius: 2px; }
}

.session-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 3px;
  border: 1px solid transparent;
  transition: all .15s;

  &:hover {
    background: #f5faf5;
    border-color: #e0ece0;
    .session-del-btn { opacity: 1; }
  }
  &.active {
    background: #EAF3DE;
    border-color: #C0DD97;
    .session-title { color: #3B6D11; font-weight: 500; }
  }
}

.session-item-main {
  flex: 1;
  min-width: 0;
}

.session-title {
  font-size: 13px;
  color: #2a3a2a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}

.session-time {
  font-size: 11px;
  color: #aaa;
  margin-bottom: 2px;
}

.session-preview {
  font-size: 11px;
  color: #7a9a7a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.session-del-btn {
  opacity: 0;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  color: #bbb;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-top: 1px;
  transition: all .15s;
  &:hover { background: #FCEBEB; color: #E24B4A; }
}

.session-empty {
  text-align: center;
  font-size: 12px;
  color: #bbb;
  padding: 32px 0;
}

// ── 右侧对话区 ──
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f8faf8;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 13px 20px;
  background: white;
  border-bottom: 1px solid #e8ede8;
  flex-shrink: 0;
}

.chat-header-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #EAF3DE;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a2e1a;
  line-height: 1.2;
}

.chat-header-sub {
  font-size: 12px;
  color: #7a9a7a;
  margin-top: 1px;
}

.context-badge {
  margin-left: auto;
  font-size: 11px;
  background: #EAF3DE;
  color: #3B6D11;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 500;
  flex-shrink: 0;
}

// ── 消息列表 ──
.messages-wrap {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #d0d8d0; border-radius: 3px; }
}

// ── 欢迎页 ──
.chat-welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}

.welcome-icon {
  margin-bottom: 16px;
  opacity: .8;
}

.welcome-text {
  font-size: 18px;
  font-weight: 600;
  color: #1a2e1a;
  margin-bottom: 8px;
}

.welcome-sub {
  font-size: 13px;
  color: #7a9a7a;
  margin-bottom: 28px;
  line-height: 1.6;
}

.suggest-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 480px;
}

.suggest-card {
  padding: 10px 14px;
  background: white;
  border: 1px solid #e8ede8;
  border-radius: 10px;
  font-size: 13px;
  color: #4a6a4a;
  cursor: pointer;
  text-align: left;
  transition: all .15s;
  &:hover {
    border-color: #42b983;
    background: #f0faf5;
    color: #1a3a1a;
  }
}

// ── 消息气泡 ──
.message {
  display: flex;
  gap: 10px;
  align-items: flex-start;

  &.message-user {
    flex-direction: row-reverse;
  }
}

.msg-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.ai-avatar {
  background: #EAF3DE;
  color: #3B6D11;
}

.user-avatar {
  background: #E6F1FB;
  color: #185FA5;
}

.msg-body {
  max-width: 72%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message-user .msg-body {
  align-items: flex-end;
}

.bubble {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.65;
  word-break: break-word;

  :deep(p) { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  :deep(ul), :deep(ol) { margin: 6px 0; padding-left: 20px; }
  :deep(li) { margin-bottom: 4px; }
  :deep(strong) { font-weight: 600; }
  :deep(code) { background: rgba(0,0,0,0.06); padding: 1px 5px; border-radius: 4px; font-size: 13px; }
  :deep(pre) { background: #2d3748; color: #e2e8f0; padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0; code { background: none; padding: 0; color: inherit; } }
}

.bubble-ai {
  background: white;
  border: 1px solid #e8ede8;
  border-top-left-radius: 4px;
  color: #1a2e1a;
}

.bubble-user {
  background: #42b983;
  border-top-right-radius: 4px;
  color: white;
  :deep(strong) { color: white; }
}

.msg-time {
  font-size: 11px;
  color: #bbb;
  padding: 0 4px;
}

// ── 打字动画 ──
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 16px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #bbb;
  animation: typing 1.2s infinite ease-in-out;
  &:nth-child(2) { animation-delay: .2s; }
  &:nth-child(3) { animation-delay: .4s; }
}

@keyframes typing {
  0%, 80%, 100% { opacity: .3; transform: scale(1); }
  40% { opacity: 1; transform: scale(1.2); }
}

// ── 快捷提问 ──
.suggest-row {
  display: flex;
  gap: 6px;
  padding: 0 24px 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.suggest-chip {
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #d8e8d8;
  background: white;
  color: #4a6a4a;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
  &:hover {
    border-color: #42b983;
    background: #f0faf5;
    color: #1a3a1a;
  }
}

// ── 输入区 ──
.input-area {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  padding: 12px 20px 16px;
  background: white;
  border-top: 1px solid #e8ede8;
  flex-shrink: 0;
}

.input-wrap {
  flex: 1;
  border: 1.5px solid #e0e8e0;
  border-radius: 12px;
  overflow: hidden;
  background: #fafcfa;
  transition: border-color .2s;

  &.focused {
    border-color: #42b983;
    background: white;
  }
}

textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  padding: 10px 14px;
  font-size: 14px;
  font-family: inherit;
  color: #1a2e1a;
  resize: none;
  line-height: 1.6;
  min-height: 42px;
  max-height: 120px;
  display: block;

  &::placeholder { color: #b0c4b0; }
  &:disabled { cursor: not-allowed; opacity: .6; }
}

.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #42b983;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background .15s;

  &:hover:not(:disabled) { background: #2d8a5e; }
  &:disabled { background: #b0d8c4; cursor: not-allowed; }
}

// ── 响应式 ──
@media (max-width: 768px) {
  .chat-page { margin: -16px -16px; }
  .sidebar { width: 180px; }
  .suggest-grid { grid-template-columns: 1fr; }
}
</style>