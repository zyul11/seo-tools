/* ── i18n: Chinese/English Bilingual ── */
const translations = {
  en: {
    // Nav
    'nav.logo': 'SEO',
    'nav.textools': 'Text Tools',
    'nav.blog': 'Blog',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.login': '🔑 Login',
    'nav.dashboard': '👤 Dashboard',
    
    // Hero
    'hero.badge': '🧬 Self-Evolving SEO System · Weekly Updated',
    'hero.h1': 'Stay Visible in the Age of AI',
    'hero.sub': '24-Point Professional SEO Audit + AI Visibility Analysis<br>Automatically adapts to the latest Google rules every Wednesday — helping you capture both traditional and AI search traffic.',
    'hero.input.placeholder': 'https://yoursite.com',
    'hero.cta': 'Scan Free →',
    'hero.trust': '⚡ Results in 10-30s · Free scan · No signup',
    'hero.login': 'Already have a key?',
    'hero.login.link': 'Login here',

    // Hero mockup
    'hero.mockup.title': 'SEO Audit: example.com',
    'hero.mockup.critical': '2 Critical',
    'hero.mockup.warning': '3 Warning',
    'hero.mockup.pass': '2 Pass',
    'hero.mockup.issue1': '❌ Title tag missing or too short',
    'hero.mockup.issue2': '⚠️ Meta description length suboptimal',
    'hero.mockup.issue3': '💡 H1 tag present but could improve',
    'hero.mockup.locked': '🔒 <strong>4+ hidden issues</strong> · Unlock full report',
    'hero.ai': '🤖 AI Visibility: Moderate',
    'hero.ai.score': '65/100',

    // Sample Report
    'sample.title': '📋 Professional SEO Audit Report',
    'sample.desc': 'Free scan gives you an overall health score + top 3 issues + AI Visibility assessment.<br>Every issue includes an estimated traffic impact rating. Upgrade for the complete 24-point breakdown.',
    'sample.cta': '🔍 Scan Your Site for Free',
    'sample.footer': '⚡ 10-30 seconds · Weekly rule updates · <a href="#pricing" style="color:#89b4fa;text-decoration:none;font-weight:600">Unlock full report →</a>',

    // Self-Evolving
    'evolve.title': 'What Is a Self-Evolving SEO Engine?',
    'evolve.desc': 'We monitor Google Search Central, web.dev, and AI search updates every week. Every Wednesday, your next scan reflects the latest rules — not a static checklist from months ago.',

    // How it Works
    'how.title': '⚙️ How It Works',
    'how.step1.title': 'Enter Your URL',
    'how.step1.desc': 'Paste your website address — our engine deeply crawls and analyzes 20+ SEO dimensions in seconds',
    'how.step2.title': 'Real-Time Detection',
    'how.step2.desc': '24 detection rules run against your page. Each issue gets a confidence score — you see why it matters',
    'how.step3.title': 'Weekly Evolution',
    'how.step3.desc': 'Every Wednesday, our engine pulls the latest Google and AI search rules. Your next scan is always up to date',

    // 24-Point Check
    'checks.title': '📋 24-Point Detection Matrix',
    'checks.sub': 'Updated weekly from Google Search Central, web.dev, and verified best practices',

    // Value Props
    'value.title': '🧬 Why a Self-Evolving SEO Tool?',
    'value.sub': 'Static checklists go stale. Every Wednesday our engine updates — your audits always reflect the latest landscape.',
    'value.card1.title': 'Self-Evolving Weekly Updates',
    'value.card1.desc': 'Google and AI search rules change constantly. Our engine auto-updates every Wednesday — your next scan catches what static tools miss.',
    'value.card2.title': 'AI Visibility (GEO) Specialized',
    'value.card2.desc': 'Beyond traditional SEO. We analyze how ChatGPT, Perplexity, Gemini & Bing Copilot see your content — and show you how to get cited.',
    'value.card3.title': 'Real Impact, Not Just Scores',
    'value.card3.desc': 'Every issue includes an estimated traffic impact rating plus a copy-paste fix template. You know what to fix and why it matters.',

    // Pricing
    'pricing.title': 'Choose Your SEO Plan',
    'pricing.badge': '🕐 Launch Special',
    'pricing.sub': 'Weekly auto-updates · AI Visibility (GEO) included · Lock in the lowest rates',
    'pricing.countdown': '⚡ Launch special expires in:',
    'pricing.free.name': 'Free Scan',
    'pricing.free.benefit1': 'Overall SEO score + Top 3 issues',
    'pricing.free.benefit2': '24-point live detection + AI Visibility score',
    'pricing.free.benefit3': 'Full 24 issues report',
    'pricing.free.benefit4': 'Fix code templates',
    'pricing.free.benefit5': 'Priority-sorted issues',
    'pricing.free.cta': 'Scan Your Site Free →',
    'pricing.starter.name': 'Starter Pack',
    'pricing.starter.benefit1': 'Complete 24-point SEO audit per scan',
    'pricing.starter.benefit2': 'Copy-paste fix templates per issue',
    'pricing.starter.benefit3': 'PDF report export',
    'pricing.starter.benefit4': '5 scans — any URL, any time',
    'pricing.starter.benefit5': 'Optimized HTML output',
    'pricing.starter.benefit6': 'Weekly push monitoring',
    'pricing.starter.cta': 'Get Starter Pack',
    'pricing.growth.name': 'Growth Pack',
    'pricing.growth.badge': '🔥 Most Popular',
    'pricing.growth.benefit1': 'Full audit + fixes + PDF + unlocked issues',
    'pricing.growth.benefit2': 'Auto-generated SEO page with fixes applied',
    'pricing.growth.benefit3': '25 scans — register URLs for weekly push',
    'pricing.growth.benefit4': 'Score history — compare week over week',
    'pricing.growth.benefit5': 'AI Visibility (GEO) detailed analysis',
    'pricing.growth.benefit6': '150 scans',
    'pricing.growth.cta': '🚀 Get Growth Pack →',
    'pricing.growth.urgency': '⚡ 25 scans = 6+ months of weekly monitoring · Best for serious site owners',
    'pricing.pro.name': 'Pro Pack',
    'pricing.pro.benefit1': 'All Growth Benefits — full audit · fixes · PDF',
    'pricing.pro.benefit2': '150 scans — register unlimited URLs for weekly push',
    'pricing.pro.benefit3': 'Score trend dashboard — watch SEO improve',
    'pricing.pro.benefit4': 'Priority alerts for new Google rule impacts',
    'pricing.pro.benefit5': 'Every future feature included — no extra cost',
    'pricing.pro.cta': 'Get Pro Pack',
    'pricing.weekly.name': 'Weekly Subscription',
    'pricing.weekly.desc': 'Pay once, get 30 days. Renew when you want.',
    'pricing.weekly.cta': 'Subscribe →',
    'pricing.notice': '🕐 These are launch prices. Regular pricing applies once we hit our first 100 paid users.',

    // Growth Flywheel
    'growth.title': '🔄 The Growth Flywheel',
    'growth.card1.title': 'Share Your Score',
    'growth.card1.desc': 'After a free audit, one-click copy a shareable score card. Post it on Twitter, LinkedIn, forums — every share brings free traffic.',
    'growth.card2.title': 'Refer & Earn',
    'growth.card2.desc': 'Subscribers get a unique referral link. Each referral earns scan credits: Starter → +2, Growth → +5, Pro → +20. Credits stack with no cap.',
    'growth.card3.title': 'Network Effect',
    'growth.card3.desc': 'More sites analyzed = richer detection data. Every audit helps our self-evolving engine understand what issues matter most across the web.',

    // FAQ
    'faq.title': '❓ FAQ',
    'faq.q1': 'What does "self-evolving" actually mean?',
    'faq.a1': 'Our detection engine is connected to Google Search Central, web.dev, and verified SEO best practices. Every Wednesday, it checks for new articles, policy changes, and rule updates. Your audit results always reflect the latest SEO landscape.',
    'faq.q2': 'How is this different from other SEO tools?',
    'faq.a2': 'Most SEO tools have a fixed checklist that updates a few times a year. Our rules update weekly. Each check has a confidence level and source attribution.',
    'faq.q3': 'What happens after I pay?',
    'faq.a3': 'Instant key delivery via email for PayPal. USDT (TRC-20): key issued automatically within ~2 minutes after on-chain confirmation. Starter/Growth/Pro packs are one-time purchases.',
    'faq.q4': 'Can I share my audit score?',
    'faq.a4': 'Yes! After any free audit, click the "Share Score" button to generate a badge. Post it anywhere. Each share has your referral link.',
    'faq.q5': 'Which plan should I choose?',
    'faq.a5': 'Quick check → Starter Pack ($14.9, 5 scans). Actively fixing issues → Growth Pack ($49, 25 scans + weekly push). All-in → Pro Pack ($149, 150 scans + priority alerts).',
    'faq.q6': 'How does the referral system work?',
    'faq.a6': 'Your confirmation email includes a unique referral link. Share it. Credits earned: Starter → +2, Growth → +5, Pro → +20. Multiple verification layers prevent abuse.',
    'faq.q7': 'Can I get a refund?',
    'faq.a7': 'Yes. Contact us within 7 days for a full refund.',

    // Footer
    'footer.slogan': '🧬 Self-evolving since 2026 · Rules updated weekly',
    'footer.showMore': 'Show more details',
    'footer.showLess': 'Show less',

    // Report modal
    'report.score': 'Score',
    'report.grade.good': 'Good',
    'report.grade.needsWork': 'Needs Work',
    'report.grade.poor': 'Poor',
    'report.issues.found': 'issues found',
    'report.issues.critical': 'Critical',
    'report.checks': 'checkpoints',
    'report.rules': 'rules',
    'report.detected': 'Detected as:',
    'report.cta1': '🔧 Upgrade Growth Pack — Unlock Full 24-Point Report + 25 Scans',
    'report.cta2': '📊 Ready to fix these issues?',
    'report.cta2.desc': 'Get priority-sorted fix templates + weekly monitoring + PDF export',
    'report.cta2.btn': '🚀 Get Growth Pack — <span style="text-decoration:line-through;opacity:.6">$69</span>$49 <span style="font-size:10px;opacity:.7"> · 25 scans</span>',
    'report.ai.title': '🚀 AI Visibility (GEO)',
    'report.ai.checking': 'Checking AI visibility...',
    'report.ai.checking.desc': 'Detecting analytics · querying AI citation sources',
    'report.ai.banner': '<strong>⚠️ AI search is reshaping the web.</strong> ChatGPT, Perplexity, Gemini now handle a significant share of search queries. If AI can\'t understand your content, you\'re losing future traffic.',
    'report.paywall.title': '🔑 Full Report — Complete Your SEO Picture',
    'report.paywall.desc': 'See all issues with fix templates, optimized HTML snippets, and weekly monitoring',
    'report.paywall.input': 'Enter your seo_ key...',
    'report.paywall.unlock': 'Unlock',
    'report.paywall.or': '— or purchase a scan pack —',
    'report.email.title': '📬 Want the full report + fix templates sent to your inbox?',
    'report.email.input': 'your@email.com',
    'report.email.btn': '📧 Send Me the Report',
    'report.email.sent': '✅ Report sent! Check your inbox.',
    'report.email.error': '❌ Failed to send. Try again.',
    'report.email.invalid': 'Please enter a valid email address.',

    // Loading
    'loading.analyzing': '🔍 Analyzing your website...',
    'loading.ai': '🤖 Checking AI Visibility...',
  },

  zh: {
    'nav.logo': 'SEO',
    'nav.textools': '工具站',
    'nav.blog': '博客',
    'nav.pricing': '定价',
    'nav.faq': '常见问题',
    'nav.login': '🔑 登录',
    'nav.dashboard': '👤 控制台',

    'hero.badge': '🧬 自进化SEO系统 · 每周更新',
    'hero.h1': '在AI时代，让你的网站持续被看见',
    'hero.sub': '24点深度SEO审计 + AI可见度分析<br>每周三自动适配最新Google规则，帮你同时抓住传统搜索与AI搜索流量',
    'hero.input.placeholder': 'https://你的网站.com',
    'hero.cta': '立即免费扫描 →',
    'hero.trust': '⚡ 10-30秒出报告 · 免费扫描 · 无需注册',
    'hero.login': '已有Key？',
    'hero.login.link': '点此登录',

    'hero.mockup.title': 'SEO审计报告: example.com',
    'hero.mockup.critical': '2个严重',
    'hero.mockup.warning': '3个警告',
    'hero.mockup.pass': '2个通过',
    'hero.mockup.issue1': '❌ 标题标签缺失或过短',
    'hero.mockup.issue2': '⚠️ Meta描述长度不达标',
    'hero.mockup.issue3': '💡 H1标签存在但可优化',
    'hero.mockup.locked': '🔒 <strong>4+个隐藏问题</strong> · 解锁完整报告',
    'hero.ai': '🤖 AI可见度: 中等',
    'hero.ai.score': '65/100',

    'sample.title': '📋 专业SEO审计报告示例',
    'sample.desc': '免费扫描即可获得总体健康分数 + Top 3关键问题 + AI可见度评估。<br>每条问题附带预期流量影响预估。升级后解锁完整24点分析。',
    'sample.cta': '🔍 免费扫描你的网站',
    'sample.footer': '⚡ 10-30秒 · 每周规则更新 · <a href="#pricing" style="color:#89b4fa;text-decoration:none;font-weight:600">解锁完整报告 →</a>',

    'evolve.title': '什么是自进化SEO引擎？',
    'evolve.desc': '我们每周监控Google Search Central、web.dev和AI搜索更新。每周三你的下一次扫描都会反映最新规则——而非几个月前的静态清单。',

    'how.title': '⚙️ 工作原理',
    'how.step1.title': '输入网址',
    'how.step1.desc': '粘贴你的网站地址——我们的引擎深度抓取并分析20+个SEO维度，秒级出结果',
    'how.step2.title': '实时检测',
    'how.step2.desc': '24条检测规则同时运行。每条问题附带置信度评分——你知道为什么需要修复',
    'how.step3.title': '每周进化',
    'how.step3.desc': '每周三引擎自动拉取最新Google和AI搜索规则。你的下次扫描总是最新版本',

    'checks.title': '📋 24点检测矩阵',
    'checks.sub': '每周从Google Search Central、web.dev和已验证的最佳实践中更新',

    'value.title': '🧬 为什么选择自进化SEO工具？',
    'value.sub': '静态清单终将过时。每周三我们的引擎自动更新——你的审计始终反映最新搜索生态。',
    'value.card1.title': '自进化每周更新',
    'value.card1.desc': 'Google和AI搜索规则不断变化。我们的引擎每周三自动升级——你的下次扫描总能捕捉到静态工具遗漏的问题。',
    'value.card2.title': 'AI可见度(GEO)专精',
    'value.card2.desc': '不止传统SEO。我们分析你的内容在ChatGPT、Perplexity、Gemini等AI工具中的可见度，并告诉你如何被引用。',
    'value.card3.title': '真正可执行的方案',
    'value.card3.desc': '每条问题附带预期流量影响评估和可复制修复模板。你知道要修什么，以及为什么要修。',

    'pricing.title': '选择你的SEO进化计划',
    'pricing.badge': '🕐 首发特价',
    'pricing.sub': '每周自动更新 · 含AI可见度分析 · 锁定最低价',
    'pricing.countdown': '⚡ 首发特价倒计时：',
    'pricing.free.name': '免费扫描',
    'pricing.free.benefit1': '总体SEO分数 + Top 3问题',
    'pricing.free.benefit2': '24点实时检测 + AI可见度评分',
    'pricing.free.benefit3': '完整24项问题报告',
    'pricing.free.benefit4': '修复代码模板',
    'pricing.free.benefit5': '按优先级排序的问题',
    'pricing.free.cta': '免费扫描 →',
    'pricing.starter.name': '新手包',
    'pricing.starter.benefit1': '每次扫描完整24点SEO审计',
    'pricing.starter.benefit2': '每条问题可复制修复模板',
    'pricing.starter.benefit3': 'PDF报告导出',
    'pricing.starter.benefit4': '5次扫描 — 任何URL，随时使用',
    'pricing.starter.benefit5': '优化HTML输出',
    'pricing.starter.benefit6': '每周推送监控',
    'pricing.starter.cta': '选择新手包',
    'pricing.growth.name': '成长包',
    'pricing.growth.badge': '🔥 最受欢迎',
    'pricing.growth.benefit1': '完整审计 + 修复 + PDF + 解锁全部问题',
    'pricing.growth.benefit2': '自动生成已修复的SEO页面（带结构化数据）',
    'pricing.growth.benefit3': '25次扫描 — 注册URL享受每周推送',
    'pricing.growth.benefit4': '历史分数对比 — 追踪进步',
    'pricing.growth.benefit5': 'AI可见度(GEO)深度分析 + 优化建议',
    'pricing.growth.benefit6': '150次扫描',
    'pricing.growth.cta': '🚀 选择成长包 →',
    'pricing.growth.urgency': '⚡ 25次扫描=6个月以上周监控 · 站长首选',
    'pricing.pro.name': '专业包',
    'pricing.pro.benefit1': '全部成长包权益 — 审计·修复·PDF',
    'pricing.pro.benefit2': '150次扫描 — 注册无限URL每周推送',
    'pricing.pro.benefit3': '分数趋势仪表盘 — 直观追踪SEO进步',
    'pricing.pro.benefit4': 'Google新规影响优先提醒',
    'pricing.pro.benefit5': '未来所有新功能永久免费',
    'pricing.pro.cta': '选择专业包',
    'pricing.weekly.name': '月度订阅',
    'pricing.weekly.desc': '付一次用30天。随时续费。',
    'pricing.weekly.cta': '订阅 →',
    'pricing.notice': '🕐 此为首发价。满100位付费用户后恢复原价。',

    'growth.title': '🔄 增长飞轮',
    'growth.card1.title': '分享你的分数',
    'growth.card1.desc': '免费审计后一键生成分享卡片。发到Twitter、LinkedIn、论坛——每次分享都是免费流量。',
    'growth.card2.title': '推荐有奖',
    'growth.card2.desc': '付费用户获得专属推荐链接。每人推荐获得扫描次数：新手包→+2，成长包→+5，专业包→+20，无限叠加。',
    'growth.card3.title': '网络效应',
    'growth.card3.desc': '分析越多网站，检测数据越丰富。每次审计都在帮助我们的自进化引擎理解什么是最重要的问题。',

    'faq.title': '❓ 常见问题',
    'faq.q1': '"自进化"是什么意思？',
    'faq.a1': '我们的检测引擎连接Google Search Central、web.dev和已验证的SEO最佳实践。每周三自动检查新文章、政策变更和规则更新。你的审计结果永远反映最新的SEO生态。',
    'faq.q2': '这和其他SEO工具有什么不同？',
    'faq.a2': '大多数SEO工具使用固定的检测清单，一年更新几次。我们的规则每周更新。每条检测都有置信度评分和来源说明——你知道规则依据什么。',
    'faq.q3': '付款后怎么用？',
    'faq.a3': 'PayPal付款后Key立即通过邮件发送。USDT(TRC-20)：链上确认后约2分钟自动发Key。新手包/成长包/专业包均为一次性购买，非订阅制。',
    'faq.q4': '可以分享我的审计分数吗？',
    'faq.a4': '可以！免费审计后点击"分享分数"按钮生成徽章。发到任何平台都行，每个分享都包含你的推荐链接。',
    'faq.q5': '我应该选哪个方案？',
    'faq.a5': '快速检查→新手包($14.9，5次扫描)。正在修复问题→成长包($49，25次+周推送)。全都要→专业包($149，150次+优先提醒)。',
    'faq.q6': '推荐系统怎么用？',
    'faq.a6': '购买后确认邮件包含专属推荐链接。分享即得扫描次数：新手包→+2次，成长包→+5次，专业包→+20次。多重验证防止滥用。',
    'faq.q7': '可以退款吗？',
    'faq.a7': '可以。购买后7天内不满意可全额退款。',

    'footer.slogan': '🧬 2026年自进化上线 · 每周规则更新',
    'footer.showMore': '展开更多详情',
    'footer.showLess': '收起',

    'report.score': '分数',
    'report.grade.good': '良好',
    'report.grade.needsWork': '需要改进',
    'report.grade.poor': '较差',
    'report.issues.found': '个问题被发现',
    'report.issues.critical': '个严重',
    'report.checks': '项检测',
    'report.rules': '条规则',
    'report.detected': '检测为：',
    'report.cta1': '🔧 升级成长包 — 解锁完整24点报告 + 25次扫描',
    'report.cta2': '📊 准备好修复这些问题了吗？',
    'report.cta2.desc': '获取按优先级排序的修复模板 + 每周监控 + PDF导出',
    'report.cta2.btn': '🚀 选择成长包 — <span style="text-decoration:line-through;opacity:.6">$69</span>$49 <span style="font-size:10px;opacity:.7"> · 25次扫描</span>',
    'report.ai.title': '🚀 AI可见度 (GEO)',
    'report.ai.checking': '正在检测AI可见度...',
    'report.ai.checking.desc': '检测分析工具 · 查询AI引用来源',
    'report.ai.banner': '<strong>⚠️ AI搜索正在重塑网络。</strong> ChatGPT、Perplexity、Gemini已占据大量搜索流量。如果你的内容无法被AI理解，你正在损失未来流量。',
    'report.paywall.title': '🔑 完整报告 — 看到你的完整SEO画像',
    'report.paywall.desc': '查看所有问题的修复模板、优化HTML片段和每周监控数据',
    'report.paywall.input': '输入你的 seo_ key...',
    'report.paywall.unlock': '解锁',
    'report.paywall.or': '— 或购买扫描包 —',
    'report.email.title': '📬 想要完整报告+修复模板发送到你的邮箱？',
    'report.email.input': 'your@email.com',
    'report.email.btn': '📧 发送报告给我',
    'report.email.sent': '✅ 报告已发送！请查收邮箱。',
    'report.email.error': '❌ 发送失败，请重试。',
    'report.email.invalid': '请输入有效的邮箱地址。',

    'loading.analyzing': '🔍 正在分析你的网站...',
    'loading.ai': '🤖 正在检测AI可见度...',
  }
};

let currentLang = localStorage.getItem('seo_lang') || 'en';

function switchLang(lang) {
  currentLang = lang;
  localStorage.setItem('seo_lang', lang);
  document.documentElement.lang = lang;
  
  // Update data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[lang] && translations[lang][key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Update lang buttons active state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Update nav login button text
  const loginBtn = document.getElementById('navLoginBtn');
  if (loginBtn && !loginBtn.dataset.translated) {
    loginBtn.innerHTML = translations[lang]['nav.login'];
  }
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  switchLang(currentLang);
});
