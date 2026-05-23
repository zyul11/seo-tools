#!/usr/bin/env python3
"""
Email Sequence Scheduler for seo.textools.site
Run via cron: every 30 minutes, checks who's due for next email.
Steps: 0→1 (immediate/triggered by API), 1→2 (24h), 2→3 (72h), 3→4 (168h=7d), 4→5 (336h=14d)
"""
import sqlite3
import smtplib
import os
import sys
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path

# ── Config ──
BASE_DIR = Path(__file__).parent.parent
DATABASE_PATH = Path("/data/ziwei.db") if Path("/data").exists() else BASE_DIR / "data" / "ziwei.db"

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.qq.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "87549153@qq.com")
SMTP_PASS = os.getenv("SMTP_PASS", "yodhihlehzdrcafc")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USER)

# ── Email Templates ──

def email_2_report_reminder(email, domain=None, score=78):
    """Step 1→2: 24h later — hidden issues reminder"""
    domain_str = domain or "your site"
    return {
        "subject": f"Your website has hidden SEO issues — {domain_str}",
        "html": f"""<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1e1e2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#181825;border-radius:14px;border:1px solid rgba(137,180,250,.12)">
<tr><td style="padding:28px 24px 20px;text-align:center">
<div style="font-size:36px;margin-bottom:8px">🔍</div>
<h1 style="color:#cdd6f4;font-size:18px;margin:0 0 4px;font-weight:700">Don't Leave SEO Issues Unfixed</h1>
<p style="color:#585b70;font-size:12px;margin:0 0 16px;line-height:1.5">Your scan of <strong style="color:#a6adc8">{domain_str}</strong> scored <strong style="color:#f9e2af">{score}/100</strong> — but free mode only showed the top 3 issues.</p>
<div style="background:rgba(24,24,37,.8);border-radius:10px;padding:16px;margin-bottom:16px;text-align:left">
<p style="color:#a6adc8;font-size:12px;margin:0 0 8px;font-weight:600">⚠️ Hidden issues may include:</p>
<ul style="color:#585b70;font-size:11px;padding-left:16px;margin:0;line-height:1.8">
<li>Missing structured data → <strong style="color:#a6e3a1">-30% AI citation chance</strong></li>
<li>Poor Core Web Vitals → Google ranking penalty</li>
<li>Broken internal links → wasted crawl budget</li>
<li>Missing OG tags → poor social share previews</li>
</ul>
</div>
<div style="text-align:center;margin:16px 0">
<a href="https://seo.textools.site/#pricing" style="display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b;font-size:14px;font-weight:700;text-decoration:none">🔓 Unlock Full 24-Point Report →</a>
</div>
<p style="color:#585b70;font-size:10px;margin:12px 0 0">Growth Pack starting at $14.9 · 7-day refund · PayPal / USDT</p>
</td></tr>
<tr><td style="padding:0 24px 16px;text-align:center;font-size:10px;color:#45475a">
<p style="margin:0">You received this because you scanned your site on seo.textools.site.</p>
<p style="margin:4px 0 0"><a href="mailto:support@textools.site?subject=Unsubscribe" style="color:#45475a;text-decoration:underline">Unsubscribe</a></p>
</td></tr></table></td></tr></table></body></html>"""
    }

def email_3_social_proof(email, domain=None, score=78):
    """Step 2→3: 72h later — social proof + scarcity"""
    return {
        "subject": f"{score}/100 isn't bad — but here's what 124 other site owners did",
        "html": f"""<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1e1e2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#181825;border-radius:14px;border:1px solid rgba(137,180,250,.12)">
<tr><td style="padding:28px 24px 20px;text-align:center">
<div style="font-size:36px;margin-bottom:8px">📈</div>
<h1 style="color:#cdd6f4;font-size:18px;margin:0 0 4px;font-weight:700">Site Owners Are Upgrading</h1>
<p style="color:#585b70;font-size:12px;margin:0 0 16px;line-height:1.5">This week <strong style="color:#a6e3a1">124 site owners</strong> chose Growth Pack to monitor their SEO weekly.</p>
<div style="background:rgba(24,24,37,.8);border-radius:10px;padding:16px;margin-bottom:16px;text-align:left">
<p style="color:#a6adc8;font-size:12px;margin:0 0 8px;font-weight:600">Their feedback:</p>
<blockquote style="color:#585b70;font-size:11px;margin:0;padding:0;font-style:italic;line-height:1.6">
"Finally, a tool that updates its rules every week—not a static checklist from 6 months ago."<br>
<strong style="color:#7f849c">— Alex, SaaS founder</strong>
</blockquote>
</div>
<div style="text-align:center;margin:16px 0">
<a href="https://seo.textools.site/#pricing" style="display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b;font-size:14px;font-weight:700;text-decoration:none">🚀 Join Them — Growth Pack $49</a>
</div>
<p style="color:#f38ba8;font-size:10px;margin:12px 0 0">⚡ Launch pricing ends soon</p>
</td></tr>
<tr><td style="padding:0 24px 16px;text-align:center;font-size:10px;color:#45475a">
<p style="margin:0">You received this because you scanned your site on seo.textools.site.</p>
<p style="margin:4px 0 0"><a href="mailto:support@textools.site?subject=Unsubscribe" style="color:#45475a;text-decoration:underline">Unsubscribe</a></p>
</td></tr></table></td></tr></table></body></html>"""
    }

def email_4_last_chance(email, domain=None, score=78):
    """Step 3→4: 7d later — last chance offer"""
    return {
        "subject": f"⏰ Last 48h: Your exclusive discount for {domain or 'your site'}",
        "html": f"""<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1e1e2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#181825;border-radius:14px;border:1px solid rgba(137,180,250,.12)">
<tr><td style="padding:28px 24px 20px;text-align:center">
<div style="font-size:36px;margin-bottom:8px">🎁</div>
<h1 style="color:#cdd6f4;font-size:18px;margin:0 0 4px;font-weight:700">Exclusive: $5 Off Just for You</h1>
<p style="color:#585b70;font-size:12px;margin:0 0 16px;line-height:1.5">Use code <strong style="color:#f9e2af;font-size:14px;letter-spacing:2px">SEO2026</strong> at checkout<br>Growth Pack for <strong style="color:#a6e3a1">$44</strong> (regular $49) · Valid 48h only</p>
<div style="text-align:center;margin:16px 0">
<a href="https://seo.textools.site/#pricing" style="display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#89b4fa,#b4befe);color:#11111b;font-size:14px;font-weight:700;text-decoration:none">🎯 Claim Your Discount →</a>
</div>
<p style="color:#585b70;font-size:10px;margin:12px 0 0">25 scans · Weekly monitoring · AI Visibility tracking</p>
</td></tr>
<tr><td style="padding:0 24px 16px;text-align:center;font-size:10px;color:#45475a">
<p style="margin:0">You received this because you scanned your site on seo.textools.site.</p>
<p style="margin:4px 0 0"><a href="mailto:support@textools.site?subject=Unsubscribe" style="color:#45475a;text-decoration:underline">Unsubscribe</a></p>
</td></tr></table></td></tr></table></body></html>"""
    }

def email_5_winback(email, domain=None, score=78):
    """Step 4→5: 14d later — final winback"""
    return {
        "subject": f"We noticed you haven't fixed {domain or 'your site'}'s SEO issues yet",
        "html": f"""<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1e1e2e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:30px 16px">
<table width="480" cellpadding="0" cellspacing="0" style="background:#181825;border-radius:14px;border:1px solid rgba(137,180,250,.12)">
<tr><td style="padding:28px 24px 20px;text-align:center">
<div style="font-size:36px;margin-bottom:8px">🔄</div>
<h1 style="color:#cdd6f4;font-size:18px;margin:0 0 4px;font-weight:700">Your SEO score may have changed</h1>
<p style="color:#585b70;font-size:12px;margin:0 0 16px;line-height:1.5">Google updates weekly. Scan your site for free right now — see if anything changed.</p>
<div style="text-align:center;margin:16px 0">
<a href="https://seo.textools.site/" style="display:inline-block;padding:12px 28px;border-radius:10px;background:linear-gradient(135deg,#a6e3a1,#94e2d5);color:#11111b;font-size:14px;font-weight:700;text-decoration:none">🔄 Re-Scan for Free →</a>
</div>
<p style="color:#585b70;font-size:10px;margin:12px 0 0">New rules detected · AI Visibility updated</p>
</td></tr>
<tr><td style="padding:0 24px 16px;text-align:center;font-size:10px;color:#45475a">
<p style="margin:0">You received this because you scanned your site on seo.textools.site.</p>
<p style="margin:4px 0 0"><a href="mailto:support@textools.site?subject=Unsubscribe" style="color:#45475a;text-decoration:underline">Unsubscribe</a></p>
</td></tr></table></td></tr></table></body></html>"""
    }

# ── Helpers ──

def send_email(to: str, subject: str, html: str) -> bool:
    if not SMTP_USER or not SMTP_PASS:
        print(f"[email-seq] SMTP not configured, skipping {to}: {subject}")
        return False
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = f"textools SEO <{SMTP_FROM}>"
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(html, 'html', 'utf-8'))
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)
        server.quit()
        print(f"[email-seq] Sent step {to}: {subject}")
        return True
    except Exception as e:
        print(f"[email-seq] Failed to {to}: {e}")
        return False

# ── Main ──

def main():
    db = sqlite3.connect(str(DATABASE_PATH))
    db.row_factory = sqlite3.Row
    
    # Find subscribers who are due for next email
    # Step 0 = just subscribed (email 1 sent by API trigger)
    # Step 1 = email 2 due after 24h
    # Step 2 = email 3 due after 72h (3d)
    # Step 3 = email 4 due after 168h (7d)
    # Step 4 = email 5 due after 336h (14d)
    # Step 5 = complete
    
    delays = {1: 24, 2: 72, 3: 168, 4: 336}  # step → hours
    templates = {1: email_2_report_reminder, 2: email_3_social_proof, 3: email_4_last_chance, 4: email_5_winback}
    
    subscribers = db.execute(
        "SELECT id, email, domain, score, step, last_sent FROM email_subscribers WHERE step BETWEEN 1 AND 4 AND unsubscribed = 0"
    ).fetchall()
    
    sent_count = 0
    for s in subscribers:
        step = s['step']
        delay_hours = delays.get(step, 168)
        
        # Check if enough time passed
        if s['last_sent']:
            last = datetime.strptime(s['last_sent'], '%Y-%m-%d %H:%M:%S')
            if datetime.now() - last < timedelta(hours=delay_hours):
                continue
        
        # Send the email
        tmpl = templates.get(step)
        if not tmpl:
            continue
        
        email_data = tmpl(s['email'], s['domain'], s['score'] or 78)
        success = send_email(s['email'], email_data['subject'], email_data['html'])
        
        if success:
            new_step = step + 1
            db.execute(
                "UPDATE email_subscribers SET step=?, last_sent=datetime('now') WHERE id=?",
                (new_step, s['id'])
            )
            db.execute(
                "INSERT INTO email_sequence_logs (subscriber_id, step, subject) VALUES (?,?,?)",
                (s['id'], step, email_data['subject'])
            )
            db.commit()
            sent_count += 1
            print(f"  → Sent step {step} to {s['email']} (now at step {new_step})")
    
    db.close()
    print(f"[email-seq] Done. Sent {sent_count} emails.")
    return sent_count

if __name__ == "__main__":
    main()
