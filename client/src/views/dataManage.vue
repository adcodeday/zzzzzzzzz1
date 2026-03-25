<template>
  <div class="dashboard">

    <!-- 顶部标题 -->
    <div class="dash-header">
      <div>
        <div class="dash-eyebrow">Data Overview</div>
        <h2 class="dash-title">平台运营数据</h2>
        <p class="dash-sub">2025 年度实时统计</p>
      </div>
      <div class="dash-header-right">
        <div class="live-indicator">
          <span class="live-dot"></span>
          <span class="live-text">实时更新</span>
        </div>
        <span class="update-time">最后更新：2025-07-18 14:30</span>
      </div>
    </div>

    <!-- KPI 卡片行 -->
    <div class="kpi-row">
      <div class="kpi-card" v-for="k in kpiCards" :key="k.label">
        <div class="kpi-icon" :style="{ background: k.bg }">
          <svg viewBox="0 0 20 20" fill="none" :stroke="k.color" stroke-width="1.5" width="18" height="18" v-html="k.svg"></svg>
        </div>
        <div class="kpi-body">
          <div class="kpi-label">{{ k.label }}</div>
          <div class="kpi-value" :style="{ color: k.color }">{{ k.val }}<span class="kpi-unit">{{ k.unit }}</span></div>
          <div class="kpi-trend" :class="k.up ? 'up' : 'down'">
            {{ k.up ? '▲' : '▼' }} {{ k.trend }} 同比
          </div>
        </div>
        <svg class="kpi-spark" viewBox="0 0 80 32" fill="none" :stroke="k.color" stroke-width="1.8">
          <polyline :points="k.spark" fill="none"/>
        </svg>
      </div>
    </div>

    <!-- 中间行：月度趋势 + 品类占比 -->
    <div class="mid-row">

      <!-- 月度销售趋势 -->
      <div class="chart-card chart-wide">
        <div class="chart-card-header">
          <div>
            <div class="chart-title">月度销售趋势</div>
            <div class="chart-sub">销售额（万元）与订单量对比</div>
          </div>
          <div class="legend-row">
            <span class="legend-item"><em class="ld green"></em>销售额</span>
            <span class="legend-item"><em class="ld amber"></em>订单量</span>
          </div>
        </div>
        <div class="bar-chart">
          <div class="bar-y-axis">
            <span v-for="y in [60,45,30,15,0]" :key="y">{{ y }}</span>
          </div>
          <div class="bars-area">
            <div class="bar-group" v-for="(item, i) in monthData" :key="i">
              <div class="bar-pair">
                <div
                  class="bar bar-green"
                  :style="{ height: Math.round(item.sales / 60 * 130) + 'px' }"
                  :title="'销售额 ¥' + item.sales + '万'"
                >
                  <span class="bar-tip">{{ item.sales }}</span>
                </div>
                <div
                  class="bar bar-amber"
                  :style="{ height: Math.round(item.orders / 1500 * 130) + 'px' }"
                  :title="'订单量 ' + item.orders"
                >
                  <span class="bar-tip">{{ item.orders }}</span>
                </div>
              </div>
              <span class="bar-label">{{ item.month }}</span>
            </div>
            <div class="grid-lines">
              <div class="grid-line" v-for="n in 4" :key="n"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 品类占比 -->
      <div class="chart-card chart-narrow">
        <div class="chart-card-header">
          <div>
            <div class="chart-title">品类销售占比</div>
            <div class="chart-sub">按品类统计</div>
          </div>
        </div>
        <div class="donut-wrap">
          <svg class="donut-svg" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r="56" fill="none" stroke="#f0ede6" stroke-width="22"/>
            <circle cx="80" cy="80" r="56" fill="none" stroke="#2d6a45" stroke-width="22"
              stroke-dasharray="105.6 246.4" stroke-dashoffset="0"/>
            <circle cx="80" cy="80" r="56" fill="none" stroke="#6dbe8a" stroke-width="22"
              stroke-dasharray="69.3 282.7" stroke-dashoffset="-105.6"/>
            <circle cx="80" cy="80" r="56" fill="none" stroke="#BA7517" stroke-width="22"
              stroke-dasharray="50.3 301.7" stroke-dashoffset="-174.9"/>
            <circle cx="80" cy="80" r="56" fill="none" stroke="#E24B4A" stroke-width="22"
              stroke-dasharray="35.2 316.8" stroke-dashoffset="-225.2"/>
            <circle cx="80" cy="80" r="56" fill="none" stroke="#378ADD" stroke-width="22"
              stroke-dasharray="12.6 339.4" stroke-dashoffset="-260.4"/>
            <text x="80" y="74" text-anchor="middle" font-size="20" font-weight="600" fill="#1a1a12" font-family="Noto Serif SC">43%</text>
            <text x="80" y="90" text-anchor="middle" font-size="10" fill="#9a9a8a" font-family="Inter">蔬菜水果</text>
          </svg>
        </div>
        <div class="donut-legend">
          <div class="dl-item" v-for="c in categories" :key="c.name">
            <span class="dl-dot" :style="{ background: c.color }"></span>
            <span class="dl-name">{{ c.name }}</span>
            <span class="dl-pct">{{ c.pct }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 下方三列 -->
    <div class="bot-row">

      <!-- 热销排行 -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <div class="chart-title">热销产品 TOP 10</div>
            <div class="chart-sub">按销量排行</div>
          </div>
        </div>
        <div class="rank-list">
          <div class="rank-item" v-for="(p, i) in topProducts" :key="i">
            <span :class="['rank-no', i < 3 && 'rank-top']">{{ i + 1 }}</span>
            <span class="rank-name">{{ p.name }}</span>
            <div class="rank-bar-bg">
              <div class="rank-bar-fill" :style="{ width: Math.round(p.sales / topProducts[0].sales * 100) + '%', background: rankColor(i) }"></div>
            </div>
            <span class="rank-val">{{ p.sales }}</span>
          </div>
        </div>
      </div>

      <!-- 地区分布 -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <div class="chart-title">地区销售分布</div>
            <div class="chart-sub">按地区统计销售额</div>
          </div>
        </div>
        <div class="region-list">
          <div class="region-item" v-for="r in regions" :key="r.name">
            <div class="region-row">
              <span class="region-name">{{ r.name }}</span>
              <span class="region-amt">¥{{ r.amount }}万</span>
            </div>
            <div class="region-bar-bg">
              <div class="region-bar-fill" :style="{ width: Math.round(r.amount / regions[0].amount * 100) + '%' }"></div>
            </div>
            <div class="region-pct">占比 {{ r.pct }}%</div>
          </div>
        </div>
      </div>

      <!-- 任务状态 + 用户构成 + 评分 -->
      <div class="chart-card">
        <div class="chart-card-header">
          <div>
            <div class="chart-title">任务状态分布</div>
            <div class="chart-sub">平台助农任务情况</div>
          </div>
        </div>
        <div class="task-circles">
          <div class="task-circle-item" v-for="t in taskStatus" :key="t.label">
            <div class="task-circle" :style="{ background: t.bg, borderColor: t.color }">
              <span class="task-num" :style="{ color: t.color }">{{ t.count }}</span>
            </div>
            <span class="task-label">{{ t.label }}</span>
          </div>
        </div>

        <div class="section-divider"></div>

        <div class="chart-sub" style="margin-bottom:10px">用户构成</div>
        <div class="uc-bar">
          <div class="uc-seg" v-for="u in userComp" :key="u.label"
            :style="{ width: u.pct + '%', background: u.color }"
            :title="u.label + ' ' + u.pct + '%'"
          ></div>
        </div>
        <div class="uc-legend">
          <span class="uc-item" v-for="u in userComp" :key="u.label">
            <em :style="{ background: u.color }"></em>{{ u.label }} {{ u.pct }}%
          </span>
        </div>

        <div class="section-divider"></div>

        <div class="chart-sub" style="margin-bottom:10px">平台评分</div>
        <div class="rating-row">
          <div class="rating-big">4.8</div>
          <div class="rating-right">
            <div class="stars">★★★★★</div>
            <div class="rating-sub">基于 8,234 条评价</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 近7日趋势折线图 -->
    <div class="chart-card chart-full">
      <div class="chart-card-header">
        <div>
          <div class="chart-title">近 7 日订单与收入走势</div>
          <div class="chart-sub">实时数据追踪</div>
        </div>
        <div class="legend-row">
          <span class="legend-item"><em class="ld green"></em>订单数</span>
          <span class="legend-item"><em class="ld blue"></em>收入（元）</span>
        </div>
      </div>
      <div class="line-chart-wrap">
        <svg class="line-svg" viewBox="0 0 700 110" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#2d6a45" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#2d6a45" stop-opacity="0"/>
            </linearGradient>
            <linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#378ADD" stop-opacity="0.15"/>
              <stop offset="100%" stop-color="#378ADD" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <path :d="orderPath.area" fill="url(#lg1)"/>
          <path :d="orderPath.line" fill="none" stroke="#2d6a45" stroke-width="2" stroke-linejoin="round"/>
          <path :d="revPath.area"   fill="url(#lg2)"/>
          <path :d="revPath.line"   fill="none" stroke="#378ADD" stroke-width="2" stroke-linejoin="round"/>
          <circle v-for="(pt,i) in orderPoints" :key="'o'+i" :cx="pt.x" :cy="pt.y" r="3.5" fill="white" stroke="#2d6a45" stroke-width="1.5"/>
          <circle v-for="(pt,i) in revPoints"   :key="'r'+i" :cx="pt.x" :cy="pt.y" r="3.5" fill="white" stroke="#378ADD" stroke-width="1.5"/>
        </svg>
        <div class="line-labels">
          <span v-for="d in week7" :key="d">{{ d }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const kpiCards = [
  { label:'年度总收入', val:'284.7', unit:'万', up:true,  trend:'18.3%', color:'#2d6a45', bg:'#EAF3DE',
    svg:'<circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5h4a1 1 0 010 2h-4"/>',
    spark:'0,28 10,22 20,25 30,14 40,18 50,8 60,12 70,4 80,6' },
  { label:'累计订单数', val:'12,856', unit:'单', up:true, trend:'24.1%', color:'#185FA5', bg:'#E6F1FB',
    svg:'<rect x="2" y="3" width="16" height="13" rx="1.5"/><line x1="5" y1="7" x2="15" y2="7"/><line x1="5" y1="11" x2="11" y2="11"/>',
    spark:'0,26 10,20 20,22 30,12 40,16 50,6 60,10 70,2 80,4' },
  { label:'注册用户数', val:'3,420', unit:'人', up:true,  trend:'32.7%', color:'#854F0B', bg:'#FAEEDA',
    svg:'<circle cx="10" cy="7" r="4"/><path d="M3 18a7 7 0 0114 0"/>',
    spark:'0,30 10,26 20,28 30,18 40,20 50,10 60,14 70,6 80,8' },
  { label:'在售农产品', val:'286', unit:'种', up:true,    trend:'15.2%', color:'#3C3489', bg:'#EEEDFE',
    svg:'<path d="M10 2C6 5 3 8 3 12a7 7 0 0014 0c0-4-3-7-7-10z"/><line x1="10" y1="10" x2="10" y2="18"/>',
    spark:'0,24 10,20 20,22 30,14 40,16 50,8 60,10 70,4 80,6' },
  { label:'任务完成率', val:'89.4', unit:'%', up:false,   trend:'2.1%',  color:'#993C1D', bg:'#FAECE7',
    svg:'<circle cx="10" cy="10" r="8"/><polyline points="6.5,10 8.5,12.5 13.5,7.5"/>',
    spark:'0,10 10,14 20,12 30,18 40,16 50,20 60,18 70,22 80,24' },
]

const monthData = [
  { month:'1月',sales:18,orders:420 },{ month:'2月',sales:22,orders:510 },
  { month:'3月',sales:28,orders:640 },{ month:'4月',sales:35,orders:820 },
  { month:'5月',sales:42,orders:980 },{ month:'6月',sales:38,orders:880 },
  { month:'7月',sales:55,orders:1280},{ month:'8月',sales:48,orders:1100},
  { month:'9月',sales:52,orders:1200},{ month:'10月',sales:46,orders:1060},
  { month:'11月',sales:58,orders:1350},{ month:'12月',sales:62,orders:1420},
]

const categories = [
  { name:'蔬菜水果', pct:43, color:'#2d6a45' },
  { name:'粮油谷物', pct:28, color:'#6dbe8a' },
  { name:'禽蛋水产', pct:20, color:'#BA7517' },
  { name:'坚果干货', pct:14, color:'#E24B4A' },
  { name:'茶叶特产', pct:5,  color:'#378ADD' },
]

const topProducts = [
  { name:'新鲜草莓',   sales:3280 },{ name:'有机菠菜',   sales:2960 },
  { name:'农家土鸡蛋', sales:2740 },{ name:'黑木耳',     sales:2510 },
  { name:'红富士苹果', sales:2380 },{ name:'湖北莲藕',   sales:2100 },
  { name:'东北大米',   sales:1960 },{ name:'云南蜂蜜',   sales:1820 },
  { name:'板栗',       sales:1640 },{ name:'普洱茶叶',   sales:1480 },
]

const rankColor = (i) => ['#2d6a45','#6dbe8a','#BA7517','#9a9a8a','#b0b0a0'][Math.min(i,4)]

const regions = [
  { name:'华东地区', amount:89.2, pct:31.3 },{ name:'华南地区', amount:72.4, pct:25.4 },
  { name:'华北地区', amount:54.8, pct:19.3 },{ name:'华中地区', amount:38.6, pct:13.6 },
  { name:'西南地区', amount:18.2, pct:6.4  },{ name:'其他地区', amount:11.5, pct:4.0  },
]

const taskStatus = [
  { label:'进行中', count:38,  color:'#2d6a45', bg:'#EAF3DE' },
  { label:'已完成', count:142, color:'#185FA5', bg:'#E6F1FB' },
  { label:'待审核', count:24,  color:'#854F0B', bg:'#FAEEDA' },
  { label:'已下架', count:18,  color:'#993C1D', bg:'#FAECE7' },
]

const userComp = [
  { label:'买家', pct:58, color:'#2d6a45' },
  { label:'农户', pct:32, color:'#378ADD' },
  { label:'管理员', pct:10, color:'#BA7517' },
]

const week7   = ['7/12','7/13','7/14','7/15','7/16','7/17','7/18']
const orders7 = [320,480,390,560,620,510,740]
const rev7    = [12400,18600,15200,21800,24100,19800,28700]

const mkPath = (vals, maxVal, H=90, W=700) => {
  const pts = vals.map((v,i) => ({ x: Math.round(i*(W/(vals.length-1))), y: Math.round(H-(v/maxVal)*H+10) }))
  const line = pts.map((p,i) => (i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`)).join(' ')
  const area = line + ` L${pts[pts.length-1].x},${H+10} L0,${H+10} Z`
  return { line, area, pts }
}

const orderPath   = computed(() => mkPath(orders7, Math.max(...orders7)*1.1))
const revPath     = computed(() => mkPath(rev7,    Math.max(...rev7)*1.1))
const orderPoints = computed(() => orderPath.value.pts)
const revPoints   = computed(() => revPath.value.pts)
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600&family=Inter:wght@300;400;500&display=swap');
* { box-sizing: border-box; }

.dashboard {
  width: 100vw;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* ── 顶部 ── */
.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

.dash-eyebrow {
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #b0b0a0;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.dash-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 22px;
  font-weight: 400;
  color: #1a1a12;
  margin: 0 0 4px;
}

.dash-sub { font-size: 12px; color: #9a9a8a; margin: 0; }

.dash-header-right { display: flex; align-items: center; gap: 14px; }

.live-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #EAF3DE;
  padding: 5px 12px;
  border-radius: 20px;
}

.live-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #2d6a45;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:.5; transform:scale(1.3); }
}

.live-text  { font-size: 11px; font-weight: 500; color: #2d6a45; }
.update-time { font-size: 11px; color: #b0b0a0; }

/* ── KPI 卡片 ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 12px;
}

.kpi-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 16px 16px 12px;
  position: relative;
  overflow: hidden;
  transition: border-color .2s, transform .15s;
  &:hover { border-color: #c8d8c0; transform: translateY(-2px); }
}

.kpi-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 10px;
}

.kpi-label { font-size: 11px; color: #9a9a8a; margin-bottom: 4px; letter-spacing: .3px; }

.kpi-value {
  font-size: 22px;
  font-weight: 600;
  line-height: 1.1;
  font-family: 'Inter', sans-serif;
  margin-bottom: 5px;
}

.kpi-unit { font-size: 12px; font-weight: 400; margin-left: 2px; opacity: .7; }

.kpi-trend {
  font-size: 11px;
  font-weight: 500;
  &.up   { color: #2d6a45; }
  &.down { color: #E24B4A; }
}

.kpi-spark {
  position: absolute;
  bottom: 10px; right: 10px;
  width: 64px; height: 24px;
  opacity: .35;
}

/* ── 图表卡片基础 ── */
.chart-card {
  background: white;
  border: 1px solid #eeebe4;
  border-radius: 8px;
  padding: 18px 20px;
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.chart-title { font-size: 14px; font-weight: 500; color: #1a1a12; margin-bottom: 3px; }
.chart-sub   { font-size: 11px; color: #b0b0a0; }

.legend-row  { display: flex; gap: 12px; }
.legend-item { font-size: 11px; color: #9a9a8a; display: flex; align-items: center; gap: 5px; }

.ld {
  display: inline-block;
  width: 8px; height: 8px; border-radius: 2px;
  &.green  { background: #2d6a45; }
  &.amber  { background: #BA7517; }
  &.blue   { background: #378ADD; }
}

/* ── 中间行 ── */
.mid-row {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 14px;
}

/* ── 柱状图 ── */
.bar-chart {
  display: flex;
  gap: 8px;
  height: 160px;
}

.bar-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 11px;
  color: #b0b0a0;
  padding-bottom: 20px;
  text-align: right;
  min-width: 24px;
}

.bars-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  position: relative;
  padding-bottom: 20px;
}

.grid-lines {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 20px;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: #f5f3ee;
  &:nth-child(1) { top: 0; }
  &:nth-child(2) { top: 25%; }
  &:nth-child(3) { top: 50%; }
  &:nth-child(4) { top: 75%; }
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.bar-pair {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 130px;
}

.bar {
  width: 9px;
  border-radius: 3px 3px 0 0;
  position: relative;
  cursor: pointer;
  transition: opacity .2s;
  &:hover { opacity: .75; .bar-tip { display: block; } }
}

.bar-tip {
  display: none;
  position: absolute;
  bottom: 100%; left: 50%;
  transform: translateX(-50%);
  background: #1a1a12;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  white-space: nowrap;
  margin-bottom: 3px;
  z-index: 10;
}

.bar-green { background: #2d6a45; }
.bar-amber { background: #BA7517; }

.bar-label {
  font-size: 9px;
  color: #b0b0a0;
  position: absolute;
  bottom: 0;
  white-space: nowrap;
}

/* ── 环形图 ── */
.donut-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
.donut-svg  { width: 130px; height: 130px; }

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dl-item { display: flex; align-items: center; gap: 7px; font-size: 12px; }
.dl-dot  { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.dl-name { flex: 1; color: #4a4a3a; }
.dl-pct  { font-weight: 500; color: #1a1a12; font-size: 12px; }

/* ── 下方三列 ── */
.bot-row {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 14px;
}

/* ── 排行榜 ── */
.rank-list { display: flex; flex-direction: column; gap: 7px; }

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rank-no {
  width: 20px; height: 20px;
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600;
  background: #f5f3ee; color: #9a9a8a;
  flex-shrink: 0;
  &.rank-top { background: #1a3a22; color: white; }
}

.rank-name { font-size: 12px; color: #4a4a3a; width: 82px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.rank-bar-bg {
  flex: 1;
  height: 5px;
  background: #f5f3ee;
  border-radius: 3px;
  overflow: hidden;
}

.rank-bar-fill { height: 100%; border-radius: 3px; transition: width .5s ease; }
.rank-val { font-size: 11px; color: #9a9a8a; width: 42px; text-align: right; flex-shrink: 0; }

/* ── 地区 ── */
.region-list { display: flex; flex-direction: column; gap: 10px; }

.region-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.region-name { font-size: 12px; color: #4a4a3a; font-weight: 500; }
.region-amt  { font-size: 12px; font-weight: 600; color: #1a1a12; }

.region-bar-bg {
  height: 5px;
  background: #f5f3ee;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 2px;
}

.region-bar-fill {
  height: 100%;
  background: #2d6a45;
  border-radius: 3px;
  transition: width .5s ease;
}

.region-pct { font-size: 10px; color: #b0b0a0; }

/* ── 任务状态 ── */
.task-circles {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.task-circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.task-circle {
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid;
  display: flex; align-items: center; justify-content: center;
}

.task-num   { font-size: 15px; font-weight: 600; }
.task-label { font-size: 10px; color: #9a9a8a; text-align: center; }

.section-divider {
  height: 1px;
  background: #f5f3ee;
  margin: 14px 0;
}

/* ── 用户构成 ── */
.uc-bar {
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  margin-bottom: 8px;
}

.uc-seg { height: 100%; transition: width .5s; }

.uc-legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.uc-item {
  font-size: 11px;
  color: #9a9a8a;
  display: flex;
  align-items: center;
  gap: 4px;
  em {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 2px;
    font-style: normal;
  }
}

/* ── 评分 ── */
.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-big {
  font-family: 'Noto Serif SC', serif;
  font-size: 32px;
  font-weight: 600;
  color: #1a3a22;
  line-height: 1;
}

.stars     { color: #BA7517; font-size: 15px; letter-spacing: 1px; margin-bottom: 3px; }
.rating-sub { font-size: 10px; color: #b0b0a0; }

/* ── 折线图 ── */
.chart-full {}

.line-chart-wrap { position: relative; }

.line-svg {
  width: 100%; height: 110px;
  display: block;
}

.line-labels {
  display: flex;
  justify-content: space-between;
  padding: 5px 0 0;
  font-size: 11px;
  color: #b0b0a0;
}

/* ── 响应式 ── */
@media (max-width: 1100px) {
  .kpi-row  { grid-template-columns: repeat(3,1fr); }
  .mid-row  { grid-template-columns: 1fr; }
  .bot-row  { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 768px) {
  .dashboard { padding: 20px 16px; }
  .kpi-row   { grid-template-columns: repeat(2,1fr); }
  .bot-row   { grid-template-columns: 1fr; }
}
</style>