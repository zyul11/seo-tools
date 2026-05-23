#!/usr/bin/env python3
"""Publish a new blog post to seo.textools.site and deploy.
Usage: python3 publish_blog.py <slug> <title> <description> <category> <date> <content_html_file>
"""
import sys, json, subprocess
from pathlib import Path
from html import escape

DEV = Path("/home/ubuntu/seo-tools/versions/dev")
DEPLOY = str(Path("/home/ubuntu/seo-tools/versions/deploy.sh"))
SITE = "https://seo.textools.site"

STYLE = "margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#1e1e2e;color:#cdd6f4;line-height:1.75;font-size:16px}a{color:#89b4fa;text-decoration:none}.container{max-width:800px;margin:0 auto;padding:0 20px}nav{background:#181825;padding:14px 0;border-bottom:1px solid #313244;position:sticky;top:0;z-index:100}nav .container{display:flex;align-items:center;gap:24px}nav .logo{font-weight:700;font-size:18px;color:#cdd6f4}nav .logo span{color:#89b4fa}nav a{font-size:14px;color:#a6adc8}article{padding:48px 0 40px}h1{font-size:32px;font-weight:800;margin-bottom:12px;color:#fff;line-height:1.3}.meta{font-size:14px;color:#a6adc8;margin-bottom:32px}h2{font-size:24px;font-weight:700;margin:40px 0 16px;color:#fff;border-bottom:2px solid #313244;padding-bottom:8px}h3{font-size:20px;font-weight:600;margin:28px 0 12px;color:#cdd6f4}p{margin-bottom:18px;color:#a6adc8}ul,ol{margin:0 0 18px 24px;color:#a6adc8}li{margin-bottom:6px}strong{color:#fff}img{max-width:100%;border-radius:8px;margin:16px 0}code{background:#313244;padding:2px 6px;border-radius:4px;font-size:14px}pre{background:#181825;padding:16px;border-radius:8px;overflow-x:auto;margin:16px 0}pre code{background:none;padding:0}blockquote{border-left:4px solid #89b4fa;padding:12px 16px;margin:16px 0;background:#181825;border-radius:0 8px 8px 0}table{width:100%;border-collapse:collapse;margin:24px 0;font-size:14px}th{background:#181825;color:#fff;padding:12px;text-align:left;font-weight:700;border-bottom:2px solid #45475a}td{padding:10px 12px;border-bottom:1px solid #313244;color:#a6adc8}tr:nth-child(2n){background:#181825}footer{background:#181825;border-top:1px solid #313244;padding:24px 0;margin-top:40px;text-align:center;font-size:13px;color:#6c7086}footer a{color:#89b4fa;margin:0 8px}@media(max-width:600px){h1{font-size:26px}h2{font-size:20px}}"

def make_ld_json(title, desc, pub_date, slug):
    d = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": desc,
        "datePublished": pub_date,
        "author": {"@type": "Organization", "name": "SEO Textools", "url": SITE},
        "publisher": {"@type": "Organization", "name": "SEO Textools", "url": SITE},
        "mainEntityOfPage": {"@type": "WebPage", "@id": f"{SITE}/blog/{slug}/"}
    }
    return json.dumps(d)

def make_breadcrumb_json(slug, title):
    d = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE}/blog/"},
            {"@type": "ListItem", "position": 3, "name": title, "item": f"{SITE}/blog/{slug}/"}
        ]
    }
    return json.dumps(d)

def build_page(slug, title, desc, category, pub_date, content_html):
    ld_article = make_ld_json(title, desc, pub_date, slug)
    ld_bread = make_breadcrumb_json(slug, title)
    escaped_title = escape(title)
    escaped_desc = escape(desc)
    escaped_cat = escape(category)
    
    body = (
        f'<nav data-astro-cid-4dqtj3le> <div class="container" data-astro-cid-4dqtj3le>'
        f'<a href="{SITE}" class="logo" data-astro-cid-4dqtj3le>SEO <span data-astro-cid-4dqtj3le>Textools</span></a>'
        f'<a href="{SITE}/" data-astro-cid-4dqtj3le>Home</a>'
        f'<a href="{SITE}/tools/" data-astro-cid-4dqtj3le>Tools</a>'
        f'<a href="{SITE}/blog/" data-astro-cid-4dqtj3le>Blog</a>'
        f'</div> </nav>'
        f'<article data-astro-cid-4dqtj3le>'
        f'<div class="container" data-astro-cid-4dqtj3le>'
        f'<div class="meta" data-astro-cid-4dqtj3le>{pub_date} &middot; {escaped_cat}</div>'
        f'<h1 data-astro-cid-4dqtj3le>{escaped_title}</h1>'
        f'{content_html}'
        f'</div> </article>'
        f'<footer data-astro-cid-4dqtj3le>'
        f'<a href="{SITE}/">Home</a> <a href="{SITE}/tools/">Tools</a>'
        f'<a href="{SITE}/blog/">Blog</a>'
        f'<p style="margin-top:8px" data-astro-cid-4dqtj3le>&copy; 2026 SEO Textools</p>'
        f'</footer>'
    )

    return (
        f'<!DOCTYPE html><html lang="en" data-astro-cid-4dqtj3le> <head>'
        f'<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">'
        f'<title>{escaped_title} &middot; SEO Textools</title>'
        f'<meta name="description" content="{escaped_desc}">'
        f'<link rel="canonical" href="{SITE}/blog/{slug}/">'
        f'<meta property="og:title" content="{escaped_title}">'
        f'<meta property="og:description" content="{escaped_desc}">'
        f'<meta property="og:url" content="{SITE}/blog/{slug}/">'
        f'<meta property="og:type" content="article">'
        f'<meta name="twitter:card" content="summary_large_image">'
        f'<meta name="robots" content="index, follow">'
        f'<script type="application/ld+json">{ld_article}</script>'
        f'<script type="application/ld+json">{ld_bread}</script>'
        f'<style>[data-astro-cid-4dqtj3le]{{{STYLE}</style>'
        f'</head> <body data-astro-cid-4dqtj3le> {body} </body></html>'
    )


def update_blog_index(title, desc, slug, category, pub_date):
    index_path = DEV / "blog" / "index.html"
    content = index_path.read_text(encoding="utf-8")
    
    escaped_title = escape(title)
    escaped_desc = escape(desc)
    escaped_cat = escape(category)
    
    new_entry = (
        f'<a class="post" href="/blog/{slug}/" data-astro-cid-5tznm7mj>'
        f'<h2 data-astro-cid-5tznm7mj>{escaped_title}</h2>'
        f'<div class="meta" data-astro-cid-5tznm7mj>{pub_date} &middot; {escaped_cat}</div>'
        f'<p data-astro-cid-5tznm7mj>{escaped_desc}</p>'
        f'</a>'
    )
    
    marker = '<p class="sub" data-astro-cid-5tznm7mj>SEO guides, tool comparisons, and technical SEO tips</p>'
    if marker in content:
        content = content.replace(marker, marker + new_entry)
        index_path.write_text(content, encoding="utf-8")
        return True
    return False


def main():
    if len(sys.argv) < 7:
        print("Usage: publish_blog.py <slug> <title> <description> <category> <date> <content_html_file>")
        sys.exit(1)

    slug = sys.argv[1]
    title = sys.argv[2]
    desc = sys.argv[3]
    category = sys.argv[4]
    pub_date = sys.argv[5]
    content_file = Path(sys.argv[6])

    if not content_file.exists():
        print(f"Content file not found: {content_file}")
        sys.exit(1)

    content_html = content_file.read_text(encoding="utf-8")

    post_dir = DEV / "blog" / slug
    post_dir.mkdir(parents=True, exist_ok=True)

    page_html = build_page(slug, title, desc, category, pub_date, content_html)
    (post_dir / "index.html").write_text(page_html, encoding="utf-8")
    print(f"Blog page written: blog/{slug}/index.html")

    if update_blog_index(title, desc, slug, category, pub_date):
        print("Blog index updated")
    else:
        print("Blog index update failed")

    result = subprocess.run(["bash", DEPLOY, "seo"], capture_output=True, text=True)
    print(result.stdout.strip())
    if result.returncode == 0:
        print(f"Published: {SITE}/blog/{slug}/")
    else:
        print(f"Deploy failed: {result.stderr}")


if __name__ == "__main__":
    main()
