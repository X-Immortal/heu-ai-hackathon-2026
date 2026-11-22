export interface TrackSpec {
  id: "knowledge" | "companion" | "global";
  code: string;
  name: string;
  englishTag: string;
  accent: string;
  problemFocus: string;
  examples: string[];
  judgingFocus: string;
  requirementHint: string;
}

export interface TimelineNode {
  step: string;
  date: string;
  title: string;
  summary: string;
  status: "completed" | "live" | "upcoming";
}

export interface ScoreMetric {
  label: string;
  points: number;
  summary: string;
  accent: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  detail: string;
}

export const EVENT_META = {
  organizer: "河北工程大学计算机协会",
  coOrganizer: "夏野黑客松",
  supporters: ["OpenDev", "连尚集团", "连尚孵化器"],
  title: "看见问题，就是开始。",
  subTitle: "与其被技术的浪潮推着走，不如自己掌舵。这一次远航，我们不预设终点。",
  shortBanner: "2026 年 AI 黑客松 · 全程线上开发 · 12 月 6 日路演开奖",
  issueDate: "2026 年 11 月 18 日",
  submissionStart: "2026-11-23T00:00:00+08:00",
  submissionEnd: "2026-11-30T23:59:59+08:00",
  demoDay: "2026-12-06T19:00:00+08:00",
  teamRule: "1–5 人组队（可单人）· 0 元免费 · 不限技术栈与模型",
};

export const HERO_STATS = [
  { value: 500, prefix: "$", suffix: "", label: "OpenDev 单人算力上限", highlight: true },
  { value: 3000, prefix: "¥", suffix: "+", label: "综合奖现金池 · 6 支席位", highlight: false },
  { value: 3, prefix: "", suffix: " 条", label: "主赛道并行 · 单项再加奖", highlight: false },
  { value: 12.06, prefix: "", suffix: "", label: "19:00 路演点评与开奖", highlight: false, raw: "12.06" },
];

export const PIPELINE_STEPS = [
  {
    code: "01",
    title: "看见问题",
    subtitle: "DISCOVER",
    featured: false,
    items: [
      { name: "自选真实痛点", tag: "不设统一命题", note: "从身边真实障碍出发，界定具体问题" },
      { name: "校内自由组队", tag: "1–5 人 · 0 元", note: "鼓励计算机与跨学院同学混合组队" },
    ],
  },
  {
    code: "02",
    title: "构建验证",
    subtitle: "BUILD & SHIP",
    featured: true,
    badge: "LIVE · 11.23—11.30",
    items: [
      { name: "可运行产品原型", tag: "拒绝 PPT / 套壳", note: "提交源码与实机演示，不限技术栈" },
      { name: "OpenDev 算力护航", tag: "基础 $200/人", note: "开赛前按人发放，用于模型与云资源" },
    ],
  },
  {
    code: "03",
    title: "孵化远航",
    subtitle: "SCALE",
    featured: false,
    items: [
      { name: "连尚集团实习直通", tag: "评委举荐通道", note: "综合奖、单项奖与优秀骨干直推实习" },
      { name: "连尚孵化器入驻", tag: "技术与投资对接", note: "提交申请表即可纳入早期孵化评估" },
    ],
  },
];

export const TRACKS: TrackSpec[] = [
  {
    id: "knowledge",
    code: "01",
    name: "AI × 知识与探索",
    englishTag: "KNOWLEDGE & DISCOVERY",
    accent: "#ff2d78",
    problemFocus: "资料散落 · 路径不清 · 验证困难",
    examples: ["课程资料助手", "文献梳理", "领域知识问答", "复杂内容讲解"],
    judgingFocus: "知识可靠可查证 · 路径清晰切实可用",
    requirementHint: "先行明确「何人在何种情形下需要弄清何事」",
  },
  {
    id: "companion",
    code: "02",
    name: "AI × 陪伴与交互",
    englishTag: "COMPANION & INTERACTION",
    accent: "#8b7bff",
    problemFocus: "需被理解承接 · 持续协助 · 无障碍沟通",
    examples: ["对话式学习伙伴", "生活/工作助手", "特定人群陪伴", "自然人机交互"],
    judgingFocus: "交互自然稳定 · 愿意反复使用 · 陪伴切实发生",
    requirementHint: "宜在同学中完成一次真实试用，说明开启与边界",
  },
  {
    id: "global",
    code: "03",
    name: "AI × 出海",
    englishTag: "GLOBAL LAUNCH",
    accent: "#22d3ee",
    problemFocus: "海外真实需求 · 语言习惯 · 本地化渠道",
    examples: ["海外学生/开发者工具", "垂直跨境原型", "目标市场可演示服务"],
    judgingFocus: "目标用户明确 · 完整可演示 · 出海路径成立",
    requirementHint: "明确目标市场用户、语言落地方式与反馈获取途径",
  },
];

export const DISQUALIFY_RULES = [
  "仅有构想或 PPT，无法演示运行",
  "开源/已有产品浅层套壳换皮",
  "数据来源不明或侵权泄密",
  "堆砌模型参数代替问题回应",
];

export const TIMELINE_NODES: TimelineNode[] = [
  {
    step: "PHASE 01",
    date: "11 月 23 日",
    title: "开赛启航",
    summary: "规则生效，00:00 开放提交通道",
    status: "live",
  },
  {
    step: "PHASE 02",
    date: "11.23 — 11.30",
    title: "开发与提交",
    summary: "提交可运行作品、完整源码及孵化器申请表",
    status: "live",
  },
  {
    step: "PHASE 03",
    date: "11.30 后一周内",
    title: "线上初评",
    summary: "评委审查源码与实机演示，遴选入围名单",
    status: "upcoming",
  },
  {
    step: "PHASE 04",
    date: "12 月 06 日 19:00",
    title: "路演与开奖",
    summary: "特邀专家现场点评裁定，启动实习与孵化对接",
    status: "upcoming",
  },
];

export const CASH_AWARDS = [
  { tier: "一等奖", amount: "¥1,200", quota: "1 支", note: "决赛总分最高" },
  { tier: "二等奖", amount: "¥600", quota: "2 支", note: "决赛总分次之" },
  { tier: "三等奖", amount: "¥200", quota: "3 支", note: "按决赛总分依次产生" },
];

export const SPECIAL_AWARDS = [
  { name: "最佳知识探索奖", scope: "AI × 知识与探索 · 1 支" },
  { name: "最佳陪伴交互奖", scope: "AI × 陪伴与交互 · 1 支" },
  { name: "最佳出海潜力奖", scope: "AI × 出海 · 1 支" },
  { name: "人气奖", scope: "现场及线上投票 · 1 支" },
  { name: "官方参赛证书", scope: "全部有效提交队伍" },
];

export const SCORE_METRICS: ScoreMetric[] = [
  { label: "问题真实性", points: 25, summary: "源于真实需求，目标用户明确", accent: "#ff2d78" },
  { label: "方案与完成度", points: 25, summary: "功能闭环完整，演示稳定且诚实写明限制", accent: "#ff2d78" },
  { label: "技术实现", points: 20, summary: "选型合理，关键环节生效，工程可复现", accent: "#8b7bff" },
  { label: "价值与潜力", points: 20, summary: "对他人有用，产品/公益/创业路径成立", accent: "#8b7bff" },
  { label: "表达与演示", points: 10, summary: "问题与方法清晰，答辩直击要点", accent: "#22d3ee" },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "c1", title: "队伍与主赛道已填", detail: "作品名、队名、1–5 名成员与单选主赛道" },
  { id: "c2", title: "完整源码与运行步骤", detail: "含依赖说明，保证评委可复现运行" },
  { id: "c3", title: "核心功能可运行演示", detail: "支持现场或远程实机演示" },
  { id: "c4", title: "产品说明（≤3 页）", detail: "问题、用户、方案、验证与后续安排" },
  { id: "c5", title: "无硬编码密钥", detail: "如需环境变量须提供 .env.example" },
  { id: "c6", title: "开源组件来源声明", detail: "列出模型、数据集与素材许可" },
  { id: "c7", title: "个人/校内数据脱敏", detail: "涉及敏感数据须脱敏并说明授权" },
  { id: "c8", title: "指定通道与申请表", detail: "11.30 前提交并登记孵化器项目编号" },
];

export interface MapHub {
  id: string;
  label: string;
  tag: string;
  metric: string;
  x: number;
  y: number;
  isHq?: boolean;
}

// Coordinates mapped to 150x65 Equirectangular SVG viewBox
export const VOYAGE_HUBS: MapHub[] = [
  {
    id: "heu",
    label: "HEU · 邯郸 [HQ]",
    tag: "// 起航原点",
    metric: "11.23 开赛 · 不预设终点",
    x: 118,
    y: 23.5,
    isHq: true,
  },
  {
    id: "shanghai",
    label: "Shanghai · 连尚孵化器",
    tag: "// 产业生态",
    metric: "连尚集团实习 + 早期投资对接",
    x: 122.5,
    y: 26.8,
  },
  {
    id: "tokyo",
    label: "Tokyo · 出海航线",
    tag: "// AI × 出海",
    metric: "跨境工具 · 东亚开发者生态",
    x: 132,
    y: 24.5,
  },
  {
    id: "singapore",
    label: "Singapore · APAC",
    tag: "// OpenDev Cloud",
    metric: "$200–$500 算力护航",
    x: 114,
    y: 38.5,
  },
  {
    id: "london",
    label: "London · Europe",
    tag: "// 全球协作",
    metric: "英文界面与本地化场景落地",
    x: 74,
    y: 17.5,
  },
  {
    id: "sf",
    label: "San Francisco · US",
    tag: "// 前沿模型",
    metric: "技术栈与底层模型完全不限",
    x: 24,
    y: 23,
  },
];
