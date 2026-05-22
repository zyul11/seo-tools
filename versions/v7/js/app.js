
// ── FAQ Toggle ──
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  answer.classList.toggle('show');
  el.querySelector('span').textContent = answer.classList.contains('show') ? '−' : '+';
}

// ── Details Toggle ──
function toggleDetails() {
  const el = document.getElementById('foldedDetails');
  const btn = document.getElementById('showMoreBtn');
  const isOpen = el.classList.toggle('show');
  btn.classList.toggle('open');
  btn.innerHTML = isOpen ? 'Show less <span class="arrow">↑</span>' : 'Show more details <span class="arrow">↓</span>';
}

// ── Stats ──
let sitesAnalyzed = 0;
function updateStats(n) {
  sitesAnalyzed = n;
  document.getElementById('statSites').textContent = n.toLocaleString();
}
try { const s = localStorage.getItem('seoAuditStats'); if (s) updateStats(parseInt(s)||0); } catch(e){}

// ── Key Login / Dashboard System ──
let _dashKey = '';

function getApiBase() {
  return window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
}

// ── Auto-init: check URL param then localStorage ──
function initKeyFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const k = params.get('auto_login');
    if (k && k.startsWith('seo_')) {
      saveKey(k);
      switchToDashboard(k);
      // Clean URL so refresh doesn't re-trigger
      const url = new URL(window.location);
      url.searchParams.delete('key');
      window.history.replaceState({}, '', url);
      return true;
    }
  } catch(e) {}
  return false;
}

function initStoredKey() {
  try {
    const k = localStorage.getItem('seoActiveKey');
    if (k && k.startsWith('seo_')) {
      saveKey(k);
      switchToDashboard(k);
      return true;
    }
  } catch(e) {}
  return false;
}

function autoInitKey() {
  if (!initKeyFromUrl()) initStoredKey();
}

function saveKey(k) {
  window._seoKey = k;
  _dashKey = k;
  try { localStorage.setItem('seoActiveKey', k); } catch(e) {}
}

function clearKey() {
  window._seoKey = '';
  _dashKey = '';
  try { localStorage.removeItem('seoActiveKey'); } catch(e) {}
}

// ── Login Modal ──
function showLoginModal() {
  document.getElementById('loginKeyInput').value = '';
  document.getElementById('loginStatus').className = 'status-msg';
  document.getElementById('loginStatus').textContent = '';
  document.getElementById('loginSubmitBtn').disabled = false;
  document.getElementById('loginSubmitBtn').textContent = '🔑 Login';
  document.getElementById('loginModal').classList.add('show');
  setTimeout(() => document.getElementById('loginKeyInput').focus(), 100);
}

function closeLoginModal() {
  document.getElementById('loginModal').classList.remove('show');
}

function onLoginKeyInput() {
  const val = document.getElementById('loginKeyInput').value.trim();
  const status = document.getElementById('loginStatus');
  if (val && !val.startsWith('seo_')) {
    status.className = 'status-msg error';
    status.textContent = 'Keys must start with "seo_"';
  } else {
    status.className = 'status-msg';
    status.textContent = '';
  }
}

async function processKeyLogin() {
  const key = document.getElementById('loginKeyInput').value.trim();
  const status = document.getElementById('loginStatus');
  const btn = document.getElementById('loginSubmitBtn');
  if (!key) { status.className = 'status-msg error'; status.textContent = 'Please paste your seo_ key.'; return; }
  if (!key.startsWith('seo_')) { status.className = 'status-msg error'; status.textContent = 'Invalid key format — must start with "seo_"'; return; }
  status.className = 'status-msg success';
  status.textContent = '⏳ Verifying key...';
  btn.disabled = true;
  btn.textContent = '⏳';
  try {
    const res = await fetch(getApiBase() + '/v1/seo/balance?api_key=' + encodeURIComponent(key));
    const data = await res.json();
    if (data.success) {
      const balance = data.data.balance;
      saveKey(key);
      closeLoginModal();
      switchToDashboard(key, balance);
    } else {
      // Key invalid — try the audit endpoint as fallback
      try {
        const res2 = await fetch(getApiBase() + '/v1/seo/audit', {
          method: 'POST', headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: 'https://example.com', key: key})
        });
        const data2 = await res2.json();
        if (data2.success || (data2.error && !data2.error.includes('invalid'))) {
          // Key works — just not via balance endpoint
          saveKey(key);
          closeLoginModal();
          switchToDashboard(key, '—');
        } else {
          throw new Error(data2.error || 'Key not accepted');
        }
      } catch(e2) {
        status.className = 'status-msg error';
        status.textContent = '❌ Key invalid or server unavailable. Check your key or contact support.';
        btn.disabled = false;
        btn.textContent = '🔑 Login';
      }
    }
  } catch(e) {
    status.className = 'status-msg error';
    status.textContent = '❌ Cannot connect to server. Is the backend running?';
    btn.disabled = false;
    btn.textContent = '🔑 Login';
  }
}

// ── Dashboard ──
async function switchToDashboard(key, balance) {
  // Nav
  document.getElementById('navLoginBtn').style.display = 'none';
  document.getElementById('navUserBtn').style.display = 'inline-flex';
  // Hide hero, show dashboard
  document.getElementById('toolPage').classList.remove('show');
  document.getElementById('toolPage').classList.add('hidden');
  document.getElementById('dashboard').classList.add('show');
  // Show key abbreviation
  document.getElementById('dashKeyName').textContent = key.slice(0, 8) + '…';
  // Fetch actual balance if not provided
  if (balance === undefined) {
    try {
      const res = await fetch(getApiBase() + '/v1/seo/balance?api_key=' + encodeURIComponent(key));
      const data = await res.json();
      if (data.success) balance = data.data.balance;
    } catch(e) {}
  }
  updateDashBalance(balance);
  updateDashMeta(key);
}

function updateDashBalance(balance) {
  const el = document.getElementById('dashBalance');
  if (balance !== undefined && balance !== null) {
    el.innerHTML = balance + ' <small>scans remaining</small>';
  } else {
    el.innerHTML = '— <small>scans remaining</small>';
  }
}

async function updateDashMeta(key) {
  const el = document.getElementById('dashMeta');
  el.innerHTML = '⏳ Loading...';
  try {
    const res = await fetch(getApiBase() + '/v1/seo/balance?api_key=' + encodeURIComponent(key));
    const data = await res.json();
    if (data.success && data.data) {
      const d = data.data;
      let parts = [];
      if (d.package) parts.push('📦 ' + d.package);
      if (d.email) parts.push('📧 ' + d.email);
      if (d.registered_urls && d.registered_urls.length) {
        parts.push('🌐 ' + d.registered_urls.length + ' registered URL' + (d.registered_urls.length > 1 ? 's' : ''));
        // Show registered URLs
        const urlList = d.registered_urls.map(u => '<span style="color:#585b70">• ' + u + '</span>').join('<br>');
        el.innerHTML = parts.join(' · ') + '<br><div style="margin-top:4px;font-size:10px;line-height:1.6">' + urlList + '</div>';
        return;
      }
      el.textContent = parts.join(' · ') || '';
    } else {
      el.textContent = 'Key: ' + key.slice(0, 12) + '…';
    }
  } catch(e) {
    el.textContent = 'Key: ' + key.slice(0, 12) + '…';
  }
}

function dashScanUrl() {
  const row = document.getElementById('dashScanRow');
  const isVis = row.style.display === 'block';
  row.style.display = isVis ? 'none' : 'block';
  if (!isVis) setTimeout(() => document.getElementById('dashUrlInput').focus(), 100);
}

function dashBuyMore() {
  document.getElementById('dashboard').classList.remove('show');
  document.getElementById('toolPage').classList.remove('hidden');
  document.getElementById('toolPage').classList.add('show');
  document.getElementById('pricing').scrollIntoView({behavior:'smooth'});
}

function dashLogout() {
  clearKey();
  document.getElementById('navLoginBtn').style.display = 'inline-flex';
  document.getElementById('navUserBtn').style.display = 'none';
  document.getElementById('dashboard').classList.remove('show');
  document.getElementById('toolPage').classList.remove('hidden');
  document.getElementById('toolPage').classList.add('show');
  document.getElementById('resultsPage').classList.remove('show');
  document.getElementById('resultsPage').classList.add('hidden');
}

async function dashRefresh() {
  const key = _dashKey || window._seoKey;
  if (!key) return;
  try {
    const res = await fetch(getApiBase() + '/v1/seo/balance?api_key=' + encodeURIComponent(key));
    const data = await res.json();
    if (data.success) updateDashBalance(data.data.balance);
  } catch(e) {}
  updateDashMeta(key);
}

function showUserMenu() {
  document.getElementById('dashboard').classList.add('show');
  document.getElementById('toolPage').classList.remove('show');
  document.getElementById('toolPage').classList.add('hidden');
  document.getElementById('resultsPage').classList.remove('show');
  document.getElementById('resultsPage').classList.add('hidden');
}

// ── After-purchase auto-login ──
function afterPurchaseLogin(key) {
  saveKey(key);
  switchToDashboard(key);
}

// ── Dashboard Scan ──
async function dashRunAudit(e) {
  e.preventDefault();
  const key = _dashKey || window._seoKey;
  if (!key) { alert('Not logged in.'); return false; }
  const url = document.getElementById('dashUrlInput').value.trim();
  if (!url) { alert('Please enter a URL.'); return false; }
  // Multi-URL support
  let urls = url.split('\n').map(s => s.trim()).filter(s => s);
  if (urls.length <= 1) urls = url.split(',').map(s => s.trim()).filter(s => s);
  const totalUrls = urls.length;
  var lo=document.getElementById('loadingOverlay');if(lo)lo.classList.add('show');
  let results = [];
  for (let i = 0; i < totalUrls; i++) {
    const scanUrl = urls[i];
    try {
      const res = await fetch(getApiBase() + '/v1/seo/audit', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: scanUrl, key: key})
      });
      const data = await res.json();
      if (data.success) {
        data.report.url = scanUrl;
        data.report._paid = true;
        data.report._balance = data.report.scan_balance;
        results.push(data.report);
      } else {
        results.push({url: scanUrl, error: data.error || 'Scan failed', score: 0});
      }
    } catch(e) {
      results.push({url: scanUrl, error: e.message, score: 0});
    }
  }
  var lo=document.getElementById('loadingOverlay');if(lo)lo.classList.remove('show');
  if (results.length === 1) {
    renderFullPaidResults(results[0], key);
  } else if (results.length > 1) {
    renderMultiResults(results, key);
  }
  // Refresh dashboard balance after scan
  setTimeout(() => dashRefresh(), 500);
  return false;
}

// Override the global paid audit to use stored key
async function runPaidAudit() {
  const key = window._seoKey || '';
  const urlInput = document.getElementById('urlInput');
  const url = (window._lastReport && window._lastReport.url) || (urlInput ? urlInput.value.trim() : '');
  const keyStatus = document.getElementById('keyStatus');
  if (!key) { keyStatus.textContent = '🔑 Enter your seo_ key above or login first.'; keyStatus.style.color = '#f9e2af'; return; }
  if (!url) { keyStatus.textContent = 'Please enter a URL first.'; keyStatus.style.color = '#f38ba8'; return; }
  keyStatus.textContent = '⏳ Running paid audit...';
  keyStatus.style.color = '#585b70';
  try {
    const res = await fetch(getApiBase() + '/v1/seo/audit', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, key: key})
    });
    const data = await res.json();
    if (data.success) {
      data.report.url = url;
      data.report._paid = true;
      data.report._balance = data.report.scan_balance;
      renderFullPaidResults(data.report, key);
    } else {
      keyStatus.textContent = '❌ ' + (data.error || 'Audit failed');
      keyStatus.style.color = '#f38ba8';
    }
  } catch(e) {
    keyStatus.textContent = '❌ Network error: ' + e.message;
    keyStatus.style.color = '#f38ba8';
  }
}

// ── Audit ──
async function runAudit(e) {
  e.preventDefault();
  const url = document.getElementById('urlInput').value.trim();
  if (!url) { alert('Please enter a website URL to analyze.'); return false; }
  var lo=document.getElementById('loadingOverlay');if(lo)lo.classList.add('show');
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo-audit', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url})
    });
    const data = await res.json();
    if (data.success) {
      if (data.report && data.report.success === false) {
        showScanError(url, data.report.error || 'Unable to analyze this URL.');
      } else {
        renderResults(data.report, url);
        const n = sitesAnalyzed + 1;
        updateStats(n);
        try { localStorage.setItem('seoAuditStats', String(n)); } catch(e){}
      }
    } else { alert('Error: ' + (data.error || 'Analysis failed.')); }
  } catch(e) { showDemoResults(url); }
  var lo=document.getElementById('loadingOverlay');if(lo)lo.classList.remove('show');
  return false;
}

function showScanError(url, msg) {
  const domain = url;
  const container = document.getElementById('resultsModalContent');
  container.innerHTML = `
    <div class="report-card" style="text-align:center;padding:20px 0">
      <div style="font-size:32px;margin-bottom:8px">⚠️</div>
      <h3 style="font-size:14px;color:#f38ba8;margin-bottom:6px">Scan Failed</h3>
      <p style="font-size:11px;color:#585b70;margin-bottom:4px">${msg}</p>
      <p style="font-size:10px;color:#45475a">URL: <strong style="color:#585b70">${domain}</strong></p>
      <p style="font-size:10px;color:#45475a;margin-top:8px">Try again later or scan a different URL.</p>
      <button onclick="closeResultsModal()" class="btn-submit" style="max-width:160px;margin:12px auto 0">OK</button>
    </div>
  `;
  document.getElementById('resultsModal').classList.add('show');
  var lo=document.getElementById('loadingOverlay');if(lo)lo.classList.remove('show');
}

// ── Render Results (modal) ──
function renderResults(report, url) {
  window._lastReport = report;
  const container = document.getElementById('resultsModalContent');
  const score = report.score || 0;
  const issues = report.issues || [];
  const checks = report.checks || [];
  let scoreColor = '#f38ba8';
  if (score >= 80) scoreColor = '#a6e3a1';
  else if (score >= 60) scoreColor = '#f9e2af';
  const degrees = Math.min((score / 100) * 360, 360);
  let checksHtml = checks.map(c => {
    const status = c.pass ? 'pass' : (c.warn ? 'warn' : 'fail');
    const icon = c.pass ? '✅' : (c.warn ? '⚠️' : '❌');
    const confBadge = c.confidence && c.confidence !== 'unknown' ? `<span class="conf-badge ${c.confidence}">${c.confidence}</span>` : '';
    return `<div class="check-row"><span class="name">${icon} ${c.name} ${confBadge}</span><span class="status ${status}">${c.pass ? 'PASS' : (c.warn ? 'WARN' : 'FAIL')}</span></div>`;
  }).join('');
  let issuesHtml = issues.slice(0, 10).map((issue, i) => {
    const sevClass = issue.severity === 'high' ? 'high' : (issue.severity === 'medium' ? 'med' : 'low');
    return `<div class="issue"><div class="sev ${sevClass}"></div><div class="info"><h5>${issue.title}</h5><p>${issue.suggestion ? issue.suggestion.slice(0, 80) : issue.description ? issue.description.slice(0, 80) : ''}</p></div></div>`;
  }).join('');
  const domain = url.indexOf('://') > -1 ? new URL(url).hostname : url;
  container.innerHTML = `
    <div class="report-card">
      <div class="score-wrap">
        <div class="score-ring" style="background:conic-gradient(${scoreColor} 0deg ${degrees}deg, #313244 ${degrees}deg 360deg)">
          <div class="inner"><div class="num" style="color:${scoreColor}">${score}</div><div class="label">Score</div></div>
        </div>
        <div class="score-info">
          <h3>🔍 SEO Audit: ${domain}</h3>
          <p>${issues.length} issues · ${checks.length} checkpoints · <span style="color:#a6e3a1">🧬 ${report.rule_source ? report.rule_source.total_rules+' rules' : '24 rules'}</span></p>
          ${report.site_type ? '<p style="font-size:11px;color:#585b70;margin-top:3px">🏭 Detected as: <strong>'+report.site_type.label+'</strong></p>' : ''}
          <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">
            <button onclick="openSubscribe('starter')" class="btn" style="font-size:11px;padding:6px 14px;border-radius:6px;border:none;background:linear-gradient(135deg,#89b4fa,#b4befe);color:#11111b;font-weight:600;cursor:pointer;font-family:inherit">📊 Starter Pack — <span style="text-decoration:line-through;opacity:.6">$19</span>$14.9</button>
            <button onclick="openSubscribe('growth')" class="btn" style="font-size:11px;padding:6px 14px;border-radius:6px;border:none;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b;font-weight:600;cursor:pointer;font-family:inherit">🔧 Growth Pack — <span style="text-decoration:line-through;opacity:.6">$69</span>$49</button>
          </div>
          <button onclick="generateArticle('${domain}')" id="genArticleBtn" style="font-size:10px;padding:4px 12px;border-radius:6px;border:1px solid rgba(137,180,250,.15);background:transparent;color:#585b70;cursor:pointer;font-family:inherit;margin-top:6px">📝 Generate Article</button>
          <button onclick="showShareScore(${score},'${domain}')" style="font-size:10px;padding:4px 12px;border-radius:6px;border:1px solid rgba(137,180,250,.15);background:transparent;color:#585b70;cursor:pointer;font-family:inherit;margin-top:6px">🏷️ Share Score</button>
          <a href="#resultsModal" style="display:inline-block;font-size:11px;color:#585b70;text-decoration:none;margin-left:8px" onclick="closeResultsModal();return false">← New Scan</a>
        </div>
      </div>
      <h4 style="font-size:13px;margin-bottom:10px;color:#a6adc8">📋 Check Results</h4>
      <div style="margin-bottom:20px">${checksHtml}</div>
      <h4 style="font-size:13px;margin-bottom:10px;color:#a6adc8">🔴 Top Issues</h4>
      <div class="issue-list">${issuesHtml}</div>
      <!-- AI Visibility -->
      <div class="ai-vis-section" style="margin-top:16px;border-top:1px solid rgba(137,180,250,.08);padding-top:12px">
        <h4 style="font-size:13px;margin-bottom:8px;color:#a6adc8">🤖 AI Visibility</h4>
        <div id="aiVisContent" style="font-size:11px;color:#585b70">
          <div style="display:flex;gap:8px;align-items:flex-start;padding:8px 0">
            <span style="font-size:14px">🔍</span>
            <div>
              <div style="color:#a6adc8;margin-bottom:2px">Checking AI visibility...</div>
              <div style="font-size:10px;color:#45475a">Detecting Clarity · querying AI citations</div>
            </div>
          </div>
        </div>
      </div>
      <div class="paywall-section" id="paywallSection">
        <h4>🔑 Full Report + Weekly Monitoring</h4>
        <p>See all ${issues.length} issues with fix templates, optimized HTML, and continuous monitoring</p>
        <div style="margin-top:10px;border-top:1px solid rgba(137,180,250,.08);padding-top:12px">
          <div style="display:flex;gap:6px;margin-bottom:8px">
            <input type="text" id="keyInput" placeholder="Enter your seo_ key..." style="flex:1;padding:8px 12px;border-radius:6px;border:1px solid rgba(137,180,250,.15);background:rgba(24,24,37,.8);color:#cdd6f4;font-size:12px;outline:none;font-family:inherit">
            <button onclick="runPaidAudit()" style="padding:8px 16px;border-radius:6px;border:none;background:linear-gradient(135deg,#89b4fa,#b4befe);color:#11111b;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;white-space:nowrap">Unlock</button>
          </div>
          <div id="keyStatus" style="font-size:10px;color:#585b70;text-align:center"></div>
          <div style="text-align:center;font-size:10px;color:#585b70;margin:6px 0 8px">— or —</div>
        </div>
        <button class="btn primary" onclick="openSubscribe('starter')">Starter Pack — <span style="text-decoration:line-through;opacity:.6">$19</span>$14.9</button>
        <button class="btn green" onclick="openSubscribe('growth')">Growth Pack — <span style="text-decoration:line-through;opacity:.6">$69</span>$49</button>
        <button class="btn primary" onclick="openSubscribe('pro')" style="background:rgba(137,180,250,.08);color:#89b4fa;border:1px solid rgba(137,180,250,.2)">Pro Pack — <span style="text-decoration:line-through;opacity:.6">$199</span>$149</button>
      </div>
    </div>
  `;
  document.getElementById('resultsModal').classList.add('show');
  // Trigger AI visibility check
  setTimeout(() => checkAiVisibility(url), 200);
}

async function checkAiVisibility(url) {
  const el = document.getElementById('aiVisContent');
  if (!el) return;
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const analyticsCheck = await fetch(API_BASE + '/v1/geo/check-clarity', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url})
    });
    const analyticsData = await analyticsCheck.json();
    const hasGA = analyticsData.success && analyticsData.has_analytics;
    const domain = url.indexOf('://') > -1 ? new URL(url).hostname : url;
    if (hasGA) {
      el.innerHTML = `
        <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0">
          <span style="font-size:14px">🟢</span>
          <div>
            <div style="color:#a6e3a1;margin-bottom:2px">Google Analytics detected</div>
            <div style="font-size:10px;color:#585b70">AI bot traffic being tracked — citation analysis coming with Pro Pack</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0">
          <span style="font-size:14px">🤖</span>
          <div>
            <div style="color:#a6adc8;margin-bottom:2px">AI Citations</div>
            <div style="font-size:10px;color:#45475a">🔒 Unlock with Pro Pack — see which AI platforms reference your content</div>
          </div>
        </div>`;
    } else {
      el.innerHTML = `
        <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0">
          <span style="font-size:14px">⚪</span>
          <div>
            <div style="color:#a6adc8;margin-bottom:2px">No analytics detected</div>
            <div style="font-size:10px;color:#45475a;line-height:1.6">
              Install Google Analytics (free) to track which AI bots visit your site and how your content performs.<br>
              <a href="https://analytics.google.com" target="_blank" rel="noopener" style="color:#89b4fa;text-decoration:none">Set up GA4 →</a>
              <span style="color:#585b70"> · paste your Measurement ID below after setup</span>
            </div>
          </div>
        </div>
        <div style="margin-top:6px;padding:8px;background:rgba(24,24,37,.6);border-radius:6px;display:flex;gap:6px">
          <input type="text" id="analyticsIdInput" placeholder="Measurement ID (e.g. G-XXXXXXXXXX)" style="flex:1;padding:6px 10px;border-radius:4px;border:1px solid rgba(137,180,250,.15);background:#1e1e2e;color:#cdd6f4;font-size:10px;outline:none;font-family:inherit">
          <button onclick="saveAnalyticsId('${domain}')" style="padding:6px 12px;border-radius:4px;border:none;background:#89b4fa;color:#11111b;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit">Save</button>
        </div>`;
    }
  } catch(e) {
    if (el) {
      el.innerHTML = `
        <div style="display:flex;gap:8px;align-items:flex-start;padding:6px 0">
          <span style="font-size:14px">⚪</span>
          <div>
            <div style="color:#a6adc8;margin-bottom:2px">AI Visibility</div>
            <div style="font-size:10px;color:#45475a">Install <a href="https://analytics.google.com" target="_blank" rel="noopener" style="color:#89b4fa;text-decoration:none">Google Analytics</a> (free) to track AI bot visits and user behavior.</div>
          </div>
        </div>`;
    }
  }
}

function saveAnalyticsId(domain) {
  const id = document.getElementById('analyticsIdInput').value.trim();
  if (!id) return;
  const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
  fetch(API_BASE + '/v1/geo/save-analytics-id', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({domain: domain, analytics_id: id})
  }).then(r => r.json()).then(d => {
    const el = document.getElementById('aiVisContent');
    if (d.success) {
      el.innerHTML = '<div style="color:#a6e3a1;font-size:11px;padding:4px 0">✅ Analytics linked! Re-scan to see AI data.</div>';
    } else {
      el.innerHTML += '<div style="color:#f38ba8;font-size:10px;margin-top:4px">❌ Failed to save. Try again.</div>';
    }
  });
}

function closeResultsModal() {
  document.getElementById('resultsModal').classList.remove('show');
}

// ── Demo ──
function showDemoResults(url) {
  const demo = {
    score: 64, url: url,
    checks: [
      {name:'Title Tag',pass:false},{name:'Meta Description',pass:false},{name:'H1 Tag',pass:true,warn:true,note:'Exists but could be optimized'},
      {name:'Heading Hierarchy',pass:false},{name:'Image Alt Attributes',pass:false},{name:'JSON-LD Structured Data',pass:false},
      {name:'Open Graph Tags',pass:false,warn:true},{name:'Canonical URL',pass:false},{name:'Mobile Viewport',pass:true},
      {name:'Internal Links',pass:true},{name:'Content Length',pass:false},{name:'HTTPS',pass:true},
      {name:'robots.txt',pass:false},{name:'sitemap.xml',pass:false}
    ],
    issues: [
      {title:'Missing Title Tag',severity:'high',suggestion:'Add a keyword-rich title tag (50-60 characters)'},
      {title:'Missing Meta Description',severity:'high',suggestion:'Add a compelling meta description (150-160 characters)'},
      {title:'No Structured Data Found',severity:'high',suggestion:'Add JSON-LD structured data for rich results'},
      {title:'Images Missing Alt Text',severity:'medium',suggestion:'Add descriptive alt attributes to all images'},
      {title:'Heading Structure Broken',severity:'medium',suggestion:'Use exactly one H1 per page with logical H2-H6 hierarchy'},
      {title:'No sitemap.xml Found',severity:'medium',suggestion:'Create and submit an XML sitemap to Google'},
    ],
    rule_source: {source:'Google Search Central + web.dev', total_rules: 24},
    site_type: {label:'General Website'}
  };
  renderResults(demo, url);
}

// ── Subscribe Modal ──
// ── USDT Auto Payment ──
function copyWallet() {
  const el = document.getElementById('usdtWalletDisplay');
  const btn = document.getElementById('usdtCopyBtn');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(() => {
    btn.textContent = '✅ Copied!';
    btn.style.background = 'rgba(166,227,161,.15)';
    btn.style.color = '#a6e3a1';
    setTimeout(() => {
      btn.textContent = '📋 Copy Address';
      btn.style.background = 'rgba(137,180,250,.12)';
      btn.style.color = '#89b4fa';
    }, 2000);
  }).catch(() => {
    // Fallback: select text
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  });
}

const PLAN_INFO = {
  starter: { price: 14.9, name: 'Starter Pack', scans: 5, pkg: 'seo_starter',
    benefits: ['Full 24-point SEO audit with every scan','Copy-paste fix templates per issue','Downloadable report 🤖 AI Visibility check included','5 scans — use on any URL, any time'] },
  growth: { price: 49, name: 'Growth Pack', scans: 25, pkg: 'seo_growth',
    benefits: ['Everything in Starter','Auto-generated optimized HTML','SEO migration guide','25 scans — manual + weekly auto push','Register URLs for weekly monitoring'] },
  pro: { price: 149, name: 'Pro Pack', scans: 150, pkg: 'seo_pro',
    benefits: ['All Growth benefits','150 scans — 1+ year of weekly monitoring','Score trend dashboard with chart','AI Visibility tracking (coming soon)','Register unlimited URLs for weekly push','🆕 Every future feature included — no extra cost, ever'] }
};

function openSubscribe(tier) {
  const p = PLAN_INFO[tier];
  const report = window._lastReport;
  const domain = report && report.url ? new URL(report.url).hostname : '';
  document.getElementById('subscribeContent').innerHTML = `
    <h3>${tier === 'starter' ? '📊' : tier === 'growth' ? '🔧' : '🏆'} ${p.name}</h3>
    <div class="price-tag">$${p.price} <small style="font-size:12px;color:#585b70">— ${p.scans} scans</small></div>
    <ul class="benefits-list">
      ${p.benefits.map(b => '<li>'+b+'</li>').join('')}
    </ul>
    <label>Your Email Address</label>
    <input type="email" id="subEmail" placeholder="you@example.com" required>
    <div id="subStatus" class="status-msg"></div>
    <button class="btn-submit" id="payBtn" onclick="payWithUsdt('${tier}')" style="background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b">₮ Pay with USDT (TRC-20) $${p.price}</button>
    <div class="detail">Your key will be sent to your email within ~2 minutes after payment. Use it to audit any URL, anytime.<br>Register URLs for weekly auto-push SEO audit reports.</div>
  `;
  document.getElementById('subscribeModal').classList.add('show');
}

async function payWithUsdt(tier) {
  const p = PLAN_INFO[tier];
  const email = document.getElementById('subEmail').value.trim();
  const status = document.getElementById('subStatus');
  const btn = document.getElementById('payBtn');
  if (!email) { status.className = 'status-msg error'; status.textContent = 'Please enter your email.'; return; }
  status.className = 'status-msg success';
  status.innerHTML = '⏳ Creating order...';
  btn.disabled = true;
  btn.textContent = '⏳';
  try {
    const API_BASE = window.location.origin === 'file://' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo/create-usdt-order', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({package: 'seo_' + tier, buyer_email: email})
    });
    const data = await res.json();
    if (data.success) {
      const d = data.data;
      const content = document.getElementById('subscribeContent');
      content.innerHTML = `
        <div style="text-align:center">
          <div style="font-size:24px;margin-bottom:4px">✅</div>
          <h3 style="font-size:15px;color:#cdd6f4;margin-bottom:4px">Order Created!</h3>
          <div class="price-tag">$${d.amount} <small style="font-size:12px;color:#585b70">USDT (TRC-20)</small></div>
        </div>
        <div style="background:rgba(24,24,37,.6);border:1px solid rgba(137,180,250,.15);border-radius:8px;padding:14px;text-align:center;margin-top:10px">
          <div style="font-size:10px;color:#585b70;margin-bottom:4px">💳 Send to this address</div>
          <div style="font-size:10px;color:#cdd6f4;font-family:monospace;word-break:break-all;background:#1e1e2e;border:1px solid #313244;border-radius:6px;padding:10px 8px;margin-bottom:6px" id="usdtWalletDisplay">${d.wallet}</div>
          <button onclick="copyWallet()" id="usdtCopyBtn" style="padding:6px 16px;border-radius:6px;border:none;background:rgba(137,180,250,.12);color:#89b4fa;font-size:11px;cursor:pointer;font-family:inherit;margin-bottom:6px">📋 Copy Address</button>
          <div style="font-size:10px;color:#585b70">⏳ Waiting for payment... <span id="usdtTimer" style="color:#f9e2af">0s</span></div>
          <div style="margin-top:8px;padding-top:8px;border-top:1px solid rgba(137,180,250,.08);text-align:left;font-size:10px;color:#45475a;line-height:1.6">
            📌 <strong style="color:#585b70">Steps:</strong><br>
            ① Copy the address above<br>
            ② Open your exchange/wallet app<br>
            ③ Send <strong style="color:#a6e3a1">$${d.amount} USDT</strong> on <strong>TRC-20</strong> network<br>
            ④ Key auto-delivered to <strong>${email}</strong> within ~2min
          </div>
          <div style="margin-top:6px;font-size:10px;color:#585b70">
            🔗 <a href="https://tronscan.org/#/address/${d.wallet}" target="_blank" rel="noopener" style="color:#89b4fa;text-decoration:none">View on Tronscan ↗</a>
          </div>
        </div>
        <div class="detail" style="margin-top:6px;text-align:center">Order: ${d.order_id} · <a href="javascript:void(0)" onclick="closeSubscribe()" style="color:#585b70">Close</a></div>
      `;
      window._usdtTimerStart = Date.now();
      window._usdtTimerInterval = setInterval(() => {
        const el = document.getElementById('usdtTimer');
        if (el) el.textContent = Math.floor((Date.now() - window._usdtTimerStart) / 1000) + 's';
      }, 1000);
      // Start checking payment
      window._usdtCheckCount = 0;
      const timerId = setInterval(async () => {
        window._usdtCheckCount = (window._usdtCheckCount || 0) + 1;
        try {
          const r = await fetch(API_BASE + '/v1/seo/pending-usdt-orders');
          const rd = await r.json();
          if (rd.success) {
            const isPending = rd.data.some(o => o.order_id === d.order_id);
            if (!isPending) {
              clearInterval(timerId);
              clearInterval(window._usdtTimerInterval);
              content.innerHTML = `
                <div style="text-align:center">
                  <div style="font-size:40px;margin-bottom:8px">🎉</div>
                  <div style="font-size:14px;color:#a6e3a1;font-weight:600">Payment Confirmed!</div>
                  <div style="font-size:11px;color:#585b70;margin-top:4px">Your SEO key has been sent to <strong>${email}</strong>.<br>Check your inbox (and spam folder).</div>
                  <button onclick="closeSubscribe()" class="btn-submit" style="margin-top:12px;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b;max-width:200px">✅ Done</button>
                </div>
              `;
            }
          }
        } catch(e) {}
        if (window._usdtCheckCount > 360) { clearInterval(timerId); clearInterval(window._usdtTimerInterval); }
      }, 5000);
    } else {
      status.className = 'status-msg error';
      status.textContent = data.error || 'Failed to create order.';
      btn.disabled = false;
      btn.textContent = '₮ Pay with USDT (TRC-20)';
    }
  } catch(e) {
    status.className = 'status-msg error';
    status.textContent = 'Network error. Is the server running? (' + e.message + ')';
    btn.disabled = false;
    btn.textContent = '₮ Pay with USDT (TRC-20)';
  }
}

function closeSubscribe() {
  document.getElementById('subscribeModal').classList.remove('show');
}

async function processSubscription(tier) {
  const p = PLAN_INFO[tier];
  const email = document.getElementById('subEmail').value.trim();
  const status = document.getElementById('subStatus');
  if (!email) { status.className = 'status-msg error'; status.textContent = 'Please enter your email.'; return; }
  status.className = 'status-msg success';
  status.innerHTML = '⏳ Processing...';
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo/checkout', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({package: p.pkg, buyer_email: email})
    });
    const data = await res.json();
    if (data.success) {
      const newKey = data.data.key;
      window._seoKey = newKey;
      status.innerHTML =
        '✅ Purchase successful!<br><br>' +
        '<div class="key-display">' + newKey + '</div>' +
        '<div style="color:#585b70;font-size:11px">' + data.data.scans + ' scans remaining · ' + data.data.package + '</div>' +
        '<div style="margin-top:10px;font-size:11px;color:#585b70">📧 Key also sent to <strong>' + email + '</strong></div>' +
        '<button onclick="closeSubscribe();afterPurchaseLogin(\'' + newKey + '\')" class="btn-submit" style="margin-top:12px;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b">🔑 Go to Dashboard</button>' +
        '<div class="detail" style="margin-top:6px">💡 Bookmark this link for one-click login:<br><span style="color:#585b70;font-family:monospace;font-size:10px">seo.textools.site?auto_login=' + newKey + '</span></div>' +
        '<div class="detail" style="color:#f9e2af;margin-top:4px">⚠️ This link contains your key. Do NOT share it — treat it like a password.</div>';
    } else {
      status.className = 'status-msg error';
      status.textContent = data.error || 'Purchase failed. Please try again.';
    }
  } catch(e) {
    status.className = 'status-msg error';
    status.textContent = 'Network error. Is the server running? (' + e.message + ')';
  }
}

// ── Paid Audit ──
async function runPaidAudit() {
  const keyInput = document.getElementById('keyInput');
  const keyStatus = document.getElementById('keyStatus');
  const key = (keyInput ? keyInput.value.trim() : '') || window._seoKey || '';
  const urlInput = document.getElementById('urlInput');
  const url = (window._lastReport && window._lastReport.url) || (urlInput ? urlInput.value.trim() : '');
  if (!key) { keyStatus.textContent = '🔑 Enter your seo_ key above or purchase one below.'; keyStatus.style.color = '#f9e2af'; return; }
  if (!url) { keyStatus.textContent = 'Please enter a URL first.'; keyStatus.style.color = '#f38ba8'; return; }
  keyStatus.textContent = '⏳ Running paid audit...';
  keyStatus.style.color = '#585b70';
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo/audit', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, key: key})
    });
    const data = await res.json();
    if (data.success) {
      data.report.url = url;
      data.report._paid = true;
      data.report._balance = data.report.scan_balance;
      renderFullPaidResults(data.report, key);
    } else {
      keyStatus.textContent = '❌ ' + (data.error || 'Audit failed');
      keyStatus.style.color = '#f38ba8';
    }
  } catch(e) {
    keyStatus.textContent = '❌ Network error: ' + e.message;
    keyStatus.style.color = '#f38ba8';
  }
}

function renderFullPaidResults(report, key) {
  window._lastReport = report;
  const container = document.getElementById('resultsModalContent');
  const score = report.score || 0;
  const issues = report.issues || [];
  const checks = report.checks || [];
  let scoreColor = '#f38ba8';
  if (score >= 80) scoreColor = '#a6e3a1';
  else if (score >= 60) scoreColor = '#f9e2af';
  const degrees = Math.min((score / 100) * 360, 360);
  const balance = report._balance !== undefined ? report._balance : '—';
  let checksHtml = checks.map(c => {
    const status = c.pass ? 'pass' : (c.warn ? 'warn' : 'fail');
    const icon = c.pass ? '✅' : (c.warn ? '⚠️' : '❌');
    return '<div class="check-row"><span class="name">' + icon + ' ' + c.name + '</span><span class="status ' + status + '">' + (c.pass ? 'PASS' : (c.warn ? 'WARN' : 'FAIL')) + '</span></div>';
  }).join('');
  let issuesHtml = issues.map((issue, i) => {
    const sevClass = issue.severity === 'high' ? 'high' : (issue.severity === 'medium' ? 'med' : 'low');
    return '<div class="issue"><div class="sev ' + sevClass + '"></div><div class="info"><h5>' + issue.title + '</h5><p>' + (issue.suggestion ? issue.suggestion.slice(0, 100) : '') + '</p></div></div>';
  }).join('');
  const domain = report.url ? new URL(report.url).hostname : '';
  container.innerHTML =
    '<div class="report-card">' +
      '<div class="score-wrap">' +
        '<div class="score-ring" style="background:conic-gradient(' + scoreColor + ' 0deg ' + degrees + 'deg, #313244 ' + degrees + 'deg 360deg)">' +
          '<div class="inner"><div class="num" style="color:' + scoreColor + '">' + score + '</div><div class="label">Score</div></div>' +
        '</div>' +
        '<div class="score-info">' +
          '<h3>🔍 Full Audit: ' + domain + '</h3>' +
          '<p>' + issues.length + ' issues · ' + checks.length + ' checks · <span style="color:#a6e3a1">🔑 Remaining scans: ' + balance + '</span></p>' +
          '<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">' +
            '<button onclick="showRegisterUrl(\'' + key + '\')" class="btn" style="font-size:10px;padding:5px 12px;border-radius:6px;border:1px solid rgba(166,227,161,.2);background:rgba(166,227,161,.08);color:#a6e3a1;font-weight:600;cursor:pointer;font-family:inherit">📬 Register for Weekly Push</button>' +
            '<button onclick="downloadPdfReport(\'' + key + '\')" class="btn" style="font-size:10px;padding:5px 12px;border-radius:6px;border:1px solid rgba(137,180,250,.2);background:rgba(137,180,250,.08);color:#89b4fa;font-weight:600;cursor:pointer;font-family:inherit">📄 Download PDF Report</button>' +
            '<a href="#resultsModal" style="display:inline-block;font-size:11px;color:#585b70;text-decoration:none;margin-left:4px" onclick="closeResultsModal();return false">← New Scan</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<h4 style="font-size:13px;margin-bottom:10px;color:#a6adc8;margin-top:16px">📋 All Check Results</h4>' +
      '<div style="margin-bottom:20px">' + checksHtml + '</div>' +
      '<h4 style="font-size:13px;margin-bottom:10px;color:#a6adc8">🔴 All Issues</h4>' +
      '<div class="issue-list">' + issuesHtml + '</div>' +
    '</div>';
  document.getElementById('resultsModal').classList.add('show');
}

// ── Multi-URL Results ──
function renderMultiResults(results, key) {
  window._lastReport = results[results.length-1] || null;
  const container = document.getElementById('resultsModalContent');
  let cardsHtml = results.map((r, i) => {
    if (r.error) {
      return '<div class="report-card" style="margin-bottom:12px"><h3 style="color:#f38ba8;font-size:13px">❌ ' + r.url + '</h3><p style="color:#585b70;font-size:11px">' + r.error + '</p></div>';
    }
    const score = r.score || 0;
    const issues = r.issues || [];
    const scoreColor = score >= 80 ? '#a6e3a1' : (score >= 60 ? '#f9e2af' : '#f38ba8');
    const degrees = Math.min((score / 100) * 360, 360);
    const balance = r._balance !== undefined ? r._balance : '—';
    const domain = r.url ? new URL(r.url).hostname : '';
    return '<div class="report-card" style="margin-bottom:12px;padding:14px">' +
      '<div style="display:flex;align-items:center;gap:14px">' +
        '<div class="score-ring" style="width:56px;height:56px;flex-shrink:0;background:conic-gradient(' + scoreColor + ' 0deg ' + degrees + 'deg, #313244 ' + degrees + 'deg 360deg)">' +
          '<div class="inner" style="top:4px;left:4px;right:4px;bottom:4px"><div class="num" style="font-size:18px;color:' + scoreColor + '">' + score + '</div></div>' +
        '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<h4 style="font-size:13px;color:#cdd6f4;margin:0">' + domain + '</h4>' +
          '<p style="font-size:10px;color:#585b70;margin:2px 0 0">' + issues.length + ' issues</p>' +
        '</div>' +
        '<a href="#resultsModal" style="font-size:10px;color:#89b4fa;text-decoration:none;white-space:nowrap" onclick="showDetail(' + i + ');return false">Details →</a>' +
      '</div>' +
    '</div>';
  }).join('');
  container.innerHTML =
    '<div style="margin-bottom:16px">' +
      '<h2 style="font-size:16px;color:#cdd6f4;margin-bottom:4px">📋 Batch Results (' + results.length + ' sites)</h2>' +
      '<p style="font-size:11px;color:#585b70">🔑 Remaining scans: ' + (results[results.length-1]._balance || '—') + '</p>' +
    '</div>' +
    cardsHtml +
    '<div style="text-align:center;margin-top:16px">' +
      '<button onclick="closeResultsModal()" class="btn" style="padding:8px 24px;border-radius:6px;border:1px solid rgba(137,180,250,.15);background:transparent;color:#585b70;cursor:pointer;font-family:inherit;font-size:12px">← New Scan</button>' +
    '</div>';
  window._multiResults = results;
  window._multiKey = key;
  document.getElementById('resultsModal').classList.add('show');
}

function showDetail(index) {
  const results = window._multiResults;
  const key = window._multiKey;
  if (results && results[index]) renderFullPaidResults(results[index], key);
}

// ── Register URL for Weekly Push ──
function showRegisterUrl(key) {
  document.getElementById('subscribeContent').innerHTML =
    '<h3>📬 Register for Weekly Push</h3>' +
    '<div class="sub">We\'ll scan this URL every week and email you the report</div>' +
    '<label>URL to Monitor</label>' +
    '<input type="url" id="regUrl" placeholder="https://yoursite.com" style="width:100%;padding:8px 12px;border-radius:6px;border:1px solid rgba(137,180,250,.15);background:rgba(24,24,37,.8);color:#cdd6f4;font-size:12px;outline:none;font-family:inherit;box-sizing:border-box">' +
    '<div id="regStatus" class="status-msg"></div>' +
    '<button class="btn-submit" onclick="doRegisterUrl(\'' + key + '\')">📬 Register</button>' +
    '<div class="detail" style="margin-top:8px">Scans deducted from your key balance each week. Cancel anytime.</div>';
  document.getElementById('subscribeModal').classList.add('show');
}

async function doRegisterUrl(key) {
  const url = document.getElementById('regUrl').value.trim();
  const status = document.getElementById('regStatus');
  if (!url) { status.className = 'status-msg error'; status.textContent = 'Please enter a URL.'; return; }
  status.className = 'status-msg success';
  status.innerHTML = '⏳ Registering...';
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo/register', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, key: key})
    });
    const data = await res.json();
    if (data.success) {
      status.innerHTML = '✅ Registered! Weekly scans start now for <strong>' + url + '</strong>';
    } else {
      status.className = 'status-msg error';
      status.textContent = data.error || 'Registration failed';
    }
  } catch(e) {
    status.className = 'status-msg error';
    status.textContent = 'Network error: ' + e.message;
  }
}

// ── Download PDF Report ──
async function downloadPdfReport(key) {
  const url = window._lastReport && window._lastReport.url;
  if (!url) { alert('Run an audit first!'); return; }
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const res = await fetch(API_BASE + '/v1/seo/pdf-report', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({url: url, key: key})
    });
    if (!res.ok) { const e = await res.json(); alert(e.error || 'PDF generation failed'); return; }
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const domain = new URL(url).hostname;
    const date = new Date().toISOString().slice(0, 10);
    a.download = domain + '_' + date + '_seo_report.pdf';
    a.click();
    URL.revokeObjectURL(a.href);
  } catch(e) {
    alert('Download failed: ' + e.message);
  }
}

// ── Share Score ──
function showShareScore(score, domain) {
  const text = `🔍 I just audited ${domain} — scored ${score}/100 on the Self-Evolving SEO Audit! Check yours at https://seo.textools.site/`;
  if (navigator.share) {
    navigator.share({title: 'My SEO Score', text, url: 'https://seo.textools.site/'});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('✅ Copied! Share it on Twitter, LinkedIn, or your blog.'));
  }
}

// ── Paywall (currently unlocked for demo) ──
function unlockReport() {
  const report = window._lastReport;
  if (!report) { alert('Run an audit first!'); return; }
  openSubscribe('starter');
}
function unlockExpert() {
  const report = window._lastReport;
  if (!report) { alert('Run an audit first!'); return; }
  openSubscribe('growth');
}

// ── Navigation ──
function backToHome() {
  document.getElementById('toolPage').classList.add('show');
  document.getElementById('toolPage').classList.remove('hidden');
  document.getElementById('resultsPage').classList.remove('show');
}
function backToResults() {
  // Re-render first page results
  if (window._lastReport) renderResults(window._lastReport, window._lastReport.url || '');
}

// ── Fix Steps Generator (for showFullReport) ──
function generateFixSteps(issue) {
  const map = {
    'title': '<!-- Add within <head>: -->\\n<title>Your Primary Keyword - Secondary Keyword | Brand Name</title>\\n<!-- Keep 50-60 characters, unique per page -->',
    'meta': '<!-- Add within <head> after <title>: -->\\n<meta name="description" content="Your compelling 150-155 character description with keywords and CTA.">',
    'canonical': '<!-- Add within <head>: -->\\n<link rel="canonical" href="https://yoursite.com/this-page-url/">',
    'hreflang': 'Add hreflang links for multi-language support:\\n<link rel="alternate" hreflang="en" href="https://yoursite.com/en/">\\n<link rel="alternate" hreflang="x-default" href="https://yoursite.com/">',
    'jsonld': '<!-- Add within <head>: -->\\n<'+'script type="application/ld+json">\\n{\\n  "@context": "https://schema.org",\\n  "@type": "WebPage",\\n  "name": "Page Name",\\n  "description": "Page description"\\n}\\n<'+'/script>',
    'og': '<!-- Add within <head>: -->\\n<meta property="og:title" content="Your Title">\\n<meta property="og:description" content="Your description">\\n<meta property="og:image" content="https://yoursite.com/og-image.png">',
    'twitter': '<!-- Add within <head>: -->\\n<meta name="twitter:card" content="summary_large_image">\\n<meta name="twitter:title" content="Your Title">\\n<meta name="twitter:description" content="Your description">'
  };
  const title = (issue.title || '').toLowerCase();
  for (const [key, fix] of Object.entries(map)) {
    if (title.includes(key)) return fix;
  }
  return issue.suggestion ? 'Fix: ' + issue.suggestion : '';
}

// ── Optimized HTML Generator ──
function generateOptimizedHtml(report) {
  const url = report.url || 'https://yoursite.com';
  const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const title = report.checks ? report.checks.find(c => c.name.includes('Title'))?.note || document.title : document.title;
  const desc = report.checks ? report.checks.find(c => c.name.includes('Description'))?.note || '' : '';
  let headTags = [];
  headTags.push('<meta charset="UTF-8">');
  headTags.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  headTags.push('<title>'+title+'</title>');
  headTags.push('<meta name="description" content="'+desc+'">');
  headTags.push('<link rel="canonical" href="'+url+'">');
  headTags.push('<meta property="og:title" content="'+title+'">');
  headTags.push('<meta property="og:description" content="'+desc+'">');
  headTags.push('<meta property="og:url" content="'+url+'">');
  headTags.push('<meta property="og:type" content="website">');
  headTags.push('<meta name="twitter:card" content="summary_large_image">');
  headTags.push('<meta name="twitter:title" content="'+title+'">');
  headTags.push('<meta name="twitter:description" content="'+desc+'">');
  headTags.push('<link rel="alternate" hreflang="en" href="'+url+'">');
  headTags.push('<link rel="alternate" hreflang="x-default" href="'+url+'">');
  headTags.push('<' + 'script type="application/ld+json">\\n{\\n  "@context": "https://schema.org",\\n  "@type": "WebPage",\\n  "name": "'+title.replace(/"/g,'\\"')+'",\\n  "description": "'+desc.replace(/"/g,'\\"')+'"\\n}\\n<'+'/script>');
  headTags.push('<meta name="robots" content="index, follow">');
  headTags.push('<link rel="icon" href="data:image/svg+xml,<svg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27><text y=%2720%27 font-size=%2720%27>🔍</text></svg>">');
  return '<!DOCTYPE html>\\n<html lang="en">\\n<head>\\n  ' + headTags.join('\\n  ') + '\\n</head>\\n<body>\\n<noscript>\\n  <div style="padding:40px;text-align:center;background:#1e1e2e;color:#cdd6f4;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">\\n    <div style="font-size:48px;margin-bottom:16px">\U0001f50d</div>\\n    <h1 style="font-size:24px;margin-bottom:12px;color:#cdd6f4">SEO Audit Tool</h1>\\n    <p style="color:#7f849c;max-width:400px;margin-bottom:20px">This tool requires JavaScript to run the SEO analysis engine. Please enable JavaScript in your browser settings and reload the page.</p>\\n    <a href="https://seo.textools.site/" style="color:#89b4fa;text-decoration:underline">Reload \u2192</a>\\n  </div>\\n</noscript>\\n  <!-- Your content here -->\\n</body>\\n</html>';
}

// ── Expert Fix / Report (keeping existing functions for compatibility) ──
function showFullReport(report) { openSubscribe('starter'); }
function showExpertFix(report) { openSubscribe('growth'); }
function downloadReport() { /* placeholder — downloads will be handled by subscription flow */ }
function downloadExpertFix() { /* placeholder — handled by subscription flow */ }
function copyExpertFix() { /* placeholder */ }
function getHtmlFix(issue) { return generateFixSteps(issue) || ''; }
function escapeHtml(str) { return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => document.getElementById('urlInput').focus(), 500);
  // Auto-login if key found in URL or localStorage
  setTimeout(autoInitKey, 100);
  // Bind pricing buttons
  function bindClick(id, fn) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
  }
  bindClick('subscribeStarter', () => openSubscribe('starter'));
  bindClick('subscribeGrowth', () => openSubscribe('growth'));
  bindClick('subscribePro', () => openSubscribe('pro'));
  bindClick('usdtStarter', () => openSubscribe('starter'));
  bindClick('usdtGrowth', () => openSubscribe('growth'));
  bindClick('usdtPro', () => openSubscribe('pro'));
});

// ── Generate SEO Article ──
async function generateArticle(domain) {
  const btn = document.getElementById('genArticleBtn');
  if (!btn) return;
  const orig = btn.textContent;
  btn.textContent = '⏳ Generating...';
  btn.style.opacity = '0.6';
  btn.disabled = true;
  try {
    const API_BASE = window.location.origin === 'file://' || window.location.origin === 'null' ? 'http://127.0.0.1:8119' : window.location.origin;
    const report = window._lastReport;
    if (!report) { alert('No audit data found. Please run a scan first.'); return; }
    const res = await fetch(API_BASE + '/v1/seo/generate-article', {
      method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({report: report, domain: domain})
    });
    const data = await res.json();
    if (data.success) {
      btn.textContent = '✅ Published!';
      btn.style.color = '#a6e3a1';
      btn.style.borderColor = 'rgba(166,227,161,.3)';
      // Open the article in a new tab after a short delay
      setTimeout(() => window.open(data.url, '_blank'), 500);
    } else {
      btn.textContent = '❌ Failed';
      btn.style.color = '#f38ba8';
      console.error('Article gen error:', data.error);
      setTimeout(() => { btn.textContent = orig; btn.style.opacity = '1'; btn.disabled = false; }, 3000);
    }
  } catch(e) {
    btn.textContent = '❌ Error';
    btn.style.color = '#f38ba8';
    setTimeout(() => { btn.textContent = orig; btn.style.opacity = '1'; btn.disabled = false; }, 3000);
  }
}

