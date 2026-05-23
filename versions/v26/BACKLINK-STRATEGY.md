# Backlink Strategy — seo.textools.site

> Generated: 2026-05-22
> Site: https://seo.textools.site — English SEO audit tool (freemium)
> Current Domain Rating (est.): ~0-5 (new site, minimal backlinks)

---

## 1. Content Asset Inventory (现有可外链页面)

### 1.1 Core Tool Page
| Page | URL | Linkable Angle |
|------|-----|----------------|
| SEO Audit Tool (Home) | `/` | "Free self-evolving SEO audit tool — 24+ checkpoints, weekly rule updates from Google sources" |

### 1.2 Comparison Articles (Best for Guest Posts & Resource Pages)
| Article | URL | Word Count (est.) | Target Keywords |
|---------|-----|-------------------|-----------------|
| Ahrefs vs SEMrush vs Moz | `/blog/ahrefs-vs-semrush-vs-moz/` | ~3,000+ | "Ahrefs vs SEMrush vs Moz", "best SEO tool 2025", "SEO tool comparison" |
| Screaming Frog vs Sitebulb | `/blog/screaming-frog-vs-sitebulb/` | ~2,500+ | "Screaming Frog vs Sitebulb", "technical SEO crawler comparison" |
| Google Search Console vs Other Tools | `/blog/google-search-console-vs-other-seo-tools/` | ~2,500+ | "Google Search Console vs paid SEO tools", "GSC limitations" |

### 1.3 Supporting Pages
| Page | URL | Notes |
|------|-----|-------|
| FAQ | `/faq/` | FAQPage schema, 8 Q&As — good for "SEO tools FAQ" link targets |
| Blog Index | `/blog/` | Blog hub — link magnet for SEO resource roundups |

### 1.4 Total Current Asset Count: **6 linkable URLs** (including blog index)

> **Gap identified**: No "About" page, no "SEO tools directory" page, no "free tools list" page. These are high-linkability pages that should be created.

---

## 2. Three-Channel Backlink Strategy

### Channel A: Guest Posts (高价值外链)

**Objective**: Publish original articles on established SEO/marketing blogs with contextual links back to our comparison articles and tool.

#### Target Sites (Tier 1 — DR 50+):
| Site | DR | Pitch Angle |
|------|----|-------------|
| SearchEngineJournal.com | ~92 | "Why Google Search Console Alone Isn't Enough — A Data-Driven Comparison" |
| SearchEngineLand.com | ~91 | "Ahrefs vs SEMrush vs Moz in 2025: Has Anything Changed?" |
| Moz Blog | ~90 | "Free Alternatives to Screaming Frog: When a Crawler Is Overkill" |
| Backlinko.com | ~87 | "The Hidden Gaps in Google Search Console (And How Free Tools Fill Them)" |
| NeilPatel.com | ~85 | "Why Most SEO Audits Miss These 12 Checkpoints" |
| HubSpot Blog | ~80 | "SEO Tool Comparison 2025: Free vs Paid, Which Do You Actually Need?" |
| Ahrefs Blog | ~80 | "Screaming Frog vs Sitebulb vs Free: Choosing Your Technical SEO Stack" |

#### Prospect Sites (Tier 2 — DR 20-50):
- SEO blogs on .edu domains (e.g., universities with digital marketing programs)
- Niche marketing publications (Content Marketing Institute, Copyblogger)
- Web development blogs (Smashing Magazine, CSS-Tricks — SEO + dev intersection)
- SaaS review sites (G2, Capterra — user reviews naturally link)

#### Automation:
- **Outreach email template generator** (see Section 4)
- **Prospect list builder** via Hunter.io API + Google dorking
- **Follow-up sequence** — 3 emails over 14 days

---

### Channel B: Resource Page Links (中高价值外链)

**Objective**: Get listed on "best SEO tools / free SEO tools / SEO resources" curated pages.

#### Target Query Templates (Google dorking):
```
"best free SEO tools" + "resources"
"SEO audit tools" + "recommended"
"free SEO tools list" + "2025"
"SEO resources" + "curated"
"tools I use" + "SEO"
"top SEO tools" + "for small business"
"free website analysis tools"
```

#### Target Sites (example matches):
- Free SEO tools roundups on Medium, Dev.to, Hashnode
- "Best Free SEO Tools" articles (DNP listings)
- SaaS directories (G2, Capterra, GetApp, AlternativeTo)
- Web hosting / agency resource pages
- .edu resource pages for digital marketing courses

#### The Ask:
Simple 1-2 line request: "Hi, I noticed your free SEO tools list on [URL]. Our tool at https://seo.textools.site is a self-evolving SEO audit system with 24+ checkpoints — entirely free. Would you consider adding it? Happy to provide a description."

#### Automation:
- **Scraper** → extract "Best SEO Tools" article links from search results
- **Outreach script** → batch send personalized emails via SMTP
- **Tracker** → CSV-based status (sent/responded/listed/rejected)

---

### Channel C: Social Media Distribution (低价值但高量外链)

**Objective**: Distribute content across platforms to generate referral traffic + social signals + natural backlinks via shares.

#### Platforms & Strategy:

| Platform | Tactics | Content Type |
|----------|---------|-------------|
| **Reddit** | r/SEO, r/bigseo, r/webdev, r/smallbusiness | Share comparison articles as self-posts (not link drops). Mention tool naturally in comments. |
| **LinkedIn** | Post article summaries + tool screenshots. Tag SEO influencers. | Long-form posts linking to blog |
| **Twitter/X** | Thread-style breakdowns of comparison findings | Image cards + tweet threads |
| **Hacker News** | "Show HN: A free SEO audit tool that updates its rules weekly" | Tool showcase (not blog) |
| **Dev.to / Hashnode** | Cross-post article versions (canonical back to original) | Full articles with canonical tag |
| **YouTube** (future) | Short screen recordings of tool demo + comparisons | Video description links |
| **Facebook Groups** | SEO/marketing groups — answer questions, share relevant articles | Contextual links in helpful answers |

#### Automation:
- **Cross-poster** → Publish article summaries to LinkedIn, Twitter, Dev.to in 1 batch
- **Reddit scheduler** → Schedule self-posts across relevant subreddits
- **Hacker News notifier** → Monitor for "SEO" topics, auto-suggest tool in relevant threads

---

## 3. AI Automation Execution Plan

### 3.1 Outreach Automation Script (`scripts/backlink-outreach.py`)

```python
#!/usr/bin/env python3
"""
Automated backlink outreach system for seo.textools.site
Requirements: pip install requests beautifulsoup4 pandas smtplib python-dotenv
"""

import csv, time, json, os, re, smtplib
from email.mime.text import MIMEText
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

# ─── Config ───
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASS = os.getenv("SMTP_PASS", "")
MY_SITE = "https://seo.textools.site"
MY_NAME = "SEO Textools Team"
MY_EMAIL = "team@textools.site"

# ─── Templates ───
GUEST_POST_TEMPLATE = """Hi {name},

I'm a big fan of {site_name} — especially your article on {article_topic}.

I recently published a detailed comparison of {pitch_topic} at seo.textools.site, and I think it would make a great guest contribution for your audience. The piece covers {value_prop}.

Would you be open to a guest post on {topic_proposal}? I'm happy to tailor it to your readers.

Best,
{my_name}
"""

RESOURCE_PAGE_TEMPLATE = """Hi {name},

I noticed your excellent resource page on {page_topic} at {page_url}.

I'd like to suggest adding our free tool — {tool_description}. It's completely free, requires no signup for the basic audit, and could be a useful addition to your list.

Let me know if you'd like a one-line description or a longer blurb.

Best,
{my_name}
"""

# ─── Prospect Discovery ───
def search_resource_pages(query, max_results=30):
    """Search Google for resource pages using the provided query."""
    # Uses SerpAPI/Google Custom Search — replace with actual API key
    results = []
    # Placeholder: implement with SerpAPI / Google Custom Search API
    return results

def extract_contact_info(url):
    """Find email / contact form on a page."""
    try:
        resp = requests.get(url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        # Simple email regex
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', resp.text)
        return emails[0] if emails else None
    except:
        return None

# ─── Outreach Engine ───
def send_email(to_email, subject, body):
    """Send a single email via SMTP."""
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = MY_EMAIL
    msg["To"] = to_email
    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
    print(f"  ✅ Sent to {to_email}")

def run_outreach(csv_path, template_type="guest_post", dry_run=True):
    """Run outreach campaign from a CSV of prospects.
    CSV columns: site_name, site_url, contact_name, contact_email, topic"""
    with open(csv_path, "r") as f:
        prospects = list(csv.DictReader(f))
    
    for i, p in enumerate(prospects):
        if template_type == "guest_post":
            body = GUEST_POST_TEMPLATE.format(
                name=p["contact_name"],
                site_name=p["site_name"],
                article_topic=p["article_topic"],
                pitch_topic=p["pitch_topic"],
                value_prop=p["value_prop"],
                topic_proposal=p["topic_proposal"],
                my_name=MY_NAME
            )
            subject = f"Guest Post Suggestion: {p['pitch_topic']}"
        else:
            body = RESOURCE_PAGE_TEMPLATE.format(
                name=p["contact_name"],
                page_topic=p["page_topic"],
                page_url=p["site_url"],
                tool_description=p["tool_description"],
                my_name=MY_NAME
            )
            subject = f"Free SEO Tool Suggestion for Your Resource Page"
        
        if dry_run:
            print(f"\n[{i+1}/{len(prospects)}] Would email {p['contact_email']}")
            print(f"  Subject: {subject}")
            print(f"  Body preview: {body[:100]}...")
        else:
            send_email(p["contact_email"], subject, body)
            time.sleep(random.uniform(30, 90))  # Rate limiting
    
    print(f"\n✅ Campaign complete. {len(prospects)} prospects processed.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python backlink-outreach.py <csv_path> [--live]")
        print("  --live  Actually send emails (default: dry run)")
        sys.exit(1)
    dry_run = "--live" not in sys.argv
    run_outreach(sys.argv[1], dry_run=dry_run)
```

### 3.2 Social Distribution Script (`scripts/social-distribute.sh`)

```bash
#!/bin/bash
# Social media distribution script for new blog posts
# Usage: ./social-distribute.sh "Article Title" "https://seo.textools.site/blog/slug/" "Short description"

TITLE="$1"
URL="$2"
DESC="$3"

echo "=== Social Distribution for: $TITLE ==="

# 1. LinkedIn post (via API or manual draft)
echo "→ LinkedIn: $TITLE — $DESC $URL"

# 2. Twitter/X thread (via twitter API / nitter.net)
echo "→ Twitter: $TITLE $URL"

# 3. Dev.to cross-post (via Dev.to API)
# curl -X POST https://dev.to/api/articles \
#   -H "api-key: $DEVTO_KEY" \
#   -H "Content-Type: application/json" \
#   -d '{...}'

# 4. Reddit post drafts (r/SEO, r/webdev)
echo "→ Reddit: r/SEO — $DESC"

echo "=== Done ==="
```

### 3.3 Backlink Monitor Script (`scripts/backlink-monitor.py`)

```python
#!/usr/bin/env python3
"""
Backlink monitoring — check if backlinks are still active.
Uses: ahrefs free backlink checker API or manual scraping.
"""
import requests, json, sys
from urllib.parse import urlparse

SOURCES_FILE = "backlink-sources.json"

def check_backlinks():
    with open(SOURCES_FILE) as f:
        sources = json.load(f)
    
    for src in sources:
        try:
            resp = requests.get(src["page_url"], timeout=10, 
                              headers={"User-Agent": "Mozilla/5.0"})
            if src["target_url"] in resp.text:
                print(f"✅ {src['page_url']} → still linking")
            else:
                print(f"❌ {src['page_url']} → link lost!")
        except Exception as e:
            print(f"⚠️  {src['page_url']} → error: {e}")

if __name__ == "__main__":
    check_backlinks()
```

---

## 4. Priority & Schedule (优先级和排期)

### Phase 1: Foundation (Week 1-2) 🚀 — Quick Wins
| Task | Est. Effort | Impact | Notes |
|------|-------------|--------|-------|
| ✅ Submit to G2 / Capterra / AlternativeTo | 1h | Medium | Auto-listed, DR 90+ domains |
| ✅ Add social sharing buttons to blog articles | 2h | Low | Enables organic sharing |
| ✅ Cross-post to Dev.to (canonical → seo.textools.site) | 2h | Medium | DR 88 domain |
| ✅ Create "Best Free SEO Tools" page on-site | 3h | High | Interal link hub + link magnet |
| ✅ Reply to 10 r/SEO threads with tool mentions | 2h/day | Medium | Direct referral traffic |
| **Quick-win total** | **~10h** | | |

### Phase 2: Outreach Campaign (Week 3-6) 📧 — Core Strategy
| Task | Est. Effort | Impact | Notes |
|------|-------------|--------|-------|
| Compile 50 Tier-2 resource page prospects | 4h | High | Use Google dorking |
| Compile 20 Tier-1 guest post prospects | 4h | Very High | Manual curation, DR 50+ |
| Draft 4 guest post outlines | 8h | Very High | One per comparison article |
| Send 50 resource page outreach emails | 6h | High | 3/week, with follow-ups |
| Send 20 guest post pitches | 4h | Very High | 5/week, personalized |
| Monitor replies + manage pipeline | 2h/week | Critical | Track in spreadsheet |
| **Outreach total** | **~28h** | | |

### Phase 3: Scale & Automate (Week 7-10) 🤖 — Systematize
| Task | Est. Effort | Impact | Notes |
|------|-------------|--------|-------|
| Build outreach auto-script (from Section 3.1) | 6h | High | Reusable for ongoing |
| Build social distribution pipeline | 4h | Medium | One-click publish |
| Write 3 more comparison articles | 12h | Very High | Content = linkable assets |
| Launch SEO-friendly "Free Tools" directory page | 4h | High | Link magnet |
| Build backlink monitor | 2h | Medium | Weekly health check |
| **Scale total** | **~28h** | | |

### Phase 4: Maintenance (Ongoing) 🔄
| Task | Frequency | Impact |
|------|-----------|--------|
| Check backlink health (monitor script) | Weekly | Medium |
| Reply to all outreach replies | Daily | Critical |
| Publish 1 new article (comparison or guide) | Bi-weekly | High |
| Resubmit to directories if links lost | Monthly | Medium |
| Expand prospect list | Monthly | High |
| LinkedIn/twitter content distribution | 2x/week | Medium |

### Priority Matrix

```
                  HIGH IMPACT ←────────→ LOW IMPACT
HIGH EFFORT   │ Guest Posts (Phase 2)  │ Automated scripts (Phase 3)
              │ New articles (Phase 3) │ Social distribution (all phases)
              │                        │
LOW EFFORT    │ Directory listings     │ Social buttons on articles
              │ Dev.to cross-post      │ Basic Reddit comments
              │ Resource page outreach │
```

**Recommended immediate action (this week):**
1. Submit to G2, Capterra, AlternativeTo (1h)
2. Cross-post Ahrefs comparison to Dev.to (30min)
3. Add "Share" buttons to all 3 comparison articles (1h)
4. Reply to 5 r/SEO threads (30min)
5. Create the prospect CSV for Phase 2 outreach (4h)

---

## 5. KPI Targets & Tracking

### Milestone Goals
| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| New referring domains | 5-10 | 25-40 | 80+ |
| Domain Rating (DR) | 5-10 | 15-25 | 25-40 |
| Organic traffic (monthly) | 500-1K | 3K-5K | 8K-15K |
| Guest posts published | 0-1 | 3-5 | 8-12 |
| Resource page listings | 5-10 | 15-25 | 30-50 |
| Social shares (per article) | 10-30 | 50-100 | 100-300 |

### Tracking Tools
- **Monitoring**: Ahrefs Webmaster Tools (free) — weekly backlink check
- **Outreach**: Google Sheets (columns: site, URL, contact, sent, replied, result)
- **Traffic**: Google Analytics + Google Search Console
- **Automation**: Cron job running `backlink-monitor.py` every Monday

---

## 6. Appendix: Quick-Start Prospect CSV Template

Create `prospects.csv` with these columns:
```
site_name,site_url,contact_name,contact_email,article_topic,pitch_topic,value_prop,topic_proposal
```

Example row:
```
Search Engine Journal,searchenginejournal.com,John Smith,john@searchenginejournal.com,Google Search Console tips,Google Search Console vs other SEO tools,why GSC alone misses 40% of SEO issues,The 5 Critical SEO Issues Google Search Console Won't Tell You About
```

---

*This strategy assumes zero initial backlinks. Adjust targets based on actual Domain Rating after first month of execution.*
