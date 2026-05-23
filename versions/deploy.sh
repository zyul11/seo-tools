#!/usr/bin/env bash
# deploy.sh — Promote dev to production
# Usage: ./deploy.sh seo|ziwei|game|all
# Example: ./deploy.sh seo    # Deploy SEO site dev → release
#          ./deploy.sh all    # Deploy all sites

set -euo pipefail

SITE=${1:-}

if [ -z "$SITE" ] || [ "$SITE" = "help" ]; then
  echo "Usage: $0 {seo|ziwei|game|textools|all}"
  echo ""
  echo "  seo      → /home/ubuntu/seo-tools"
  echo "  ziwei    → /home/ubuntu/ziwei-api (static root)"
  echo "  game     → /home/ubuntu/ziwei-games"
  echo "  textools → /home/ubuntu/textools"
  echo "  all      → Deploy all 4 sites"
  exit 1
fi

# ── Astro Blog Builder ──────────────────────────────────────
# Each site can have an Astro project that generates blog/article content.
# Define the mapping: site_name → astro_project_dir → target_dir_under_dev
build_blog() {
  local name="$1"
  local dir="$2"

  case "$name" in
    seo.textools.site)
      local astro_dir="/home/ubuntu/seo-articles-astro"
      if [ -d "$astro_dir" ]; then
        echo "  📝 $name: building Astro blog..."
        (cd "$astro_dir" && npx astro build 2>&1 | sed 's/^/    /')
        echo "  📋 $name: syncing blog to dev..."
        rsync -a --delete "$astro_dir/dist/blog/" "$dir/versions/dev/blog/"
        echo "  ✅ $name: blog synced"
      fi
      ;;
    textools.site)
      local astro_dir="/home/ubuntu/textools-articles-astro"
      if [ -d "$astro_dir" ]; then
        echo "  📝 $name: building Astro articles..."
        (cd "$astro_dir" && npx astro build 2>&1 | sed 's/^/    /')
        rsync -a --delete "$astro_dir/dist/articles/" "$dir/versions/dev/articles/"
        echo "  ✅ $name: articles synced"
      fi
      ;;
    ziweiapi.site)
      local astro_dir="/home/ubuntu/ziwei-articles-astro"
      if [ -d "$astro_dir" ]; then
        echo "  📝 $name: building Astro articles..."
        (cd "$astro_dir" && npx astro build 2>&1 | sed 's/^/    /')
        echo "  📋 $name: syncing articles to dev..."
        rsync -a --delete "$astro_dir/dist/articles/" "$dir/versions/dev/articles/"
        echo "  ✅ $name: articles synced"
      fi
      ;;
    game.ziweiapi.site)
      local astro_dir="/home/ubuntu/game-articles-astro"
      if [ -d "$astro_dir" ]; then
        echo "  📝 $name: building Astro articles..."
        (cd "$astro_dir" && npx astro build 2>&1 | sed 's/^/    /')
        rsync -a --delete "$astro_dir/dist/articles/" "$dir/versions/dev/articles/"
        echo "  ✅ $name: articles synced"
      fi
      ;;
  esac
}

deploy_site() {
  local name="$1"
  local dir="$2"
  local ver_file="$dir/versions/.version"

  if [ ! -d "$dir/versions/dev" ]; then
    echo "  ⚠️  $name: no dev/ directory found, skipping"
    return
  fi

  # Build Astro blog before deploying
  build_blog "$name" "$dir"

  # Determine next version number
  local next_ver=1
  for v in "$dir/versions"/v*; do
    if [ -d "$v" ]; then
      local num="${v##*v}"
      if [ "$num" -ge "$next_ver" ]; then
        next_ver=$((num + 1))
      fi
    fi
  done

  local ver_name="v${next_ver}"
  echo "  📦 $name: deploying dev → $ver_name"

  # Copy dev to new version directory
  cp -a "$dir/versions/dev" "$dir/versions/$ver_name"

  # Update release symlink
  ln -sfn "$dir/versions/$ver_name" "$dir/release"
  echo "$ver_name" > "$ver_file"

  echo "  ✅ $name: $ver_name is now live"
}

case "$SITE" in
  seo)
    deploy_site "seo.textools.site" "/home/ubuntu/seo-tools"
    ;;
  ziwei)
    deploy_site "ziweiapi.site" "/home/ubuntu/ziwei-api"
    ;;
  game)
    deploy_site "game.ziweiapi.site" "/home/ubuntu/ziwei-games"
    ;;
  textools)
    deploy_site "textools.site" "/home/ubuntu/textools"
    ;;
  all)
    deploy_site "seo.textools.site" "/home/ubuntu/seo-tools"
    deploy_site "ziweiapi.site" "/home/ubuntu/ziwei-api"
    deploy_site "game.ziweiapi.site" "/home/ubuntu/ziwei-games"
    deploy_site "textools.site" "/home/ubuntu/textools"
    ;;
esac

echo ""
echo "🎉 Done! No nginx reload needed — symlink is live."
