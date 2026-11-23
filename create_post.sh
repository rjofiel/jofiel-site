#!/usr/bin/env sh

BLOG_DIR="app/content/blog"

printf "post title → "
read -r TITLE

if [ -z "$TITLE" ]; then
  echo "aborted: empty title"
  exit 1
fi

# date YYYY-MM-DD, time HH:MM, both in Madrid
DATE=$(TZ=Europe/Madrid date +"%Y-%m-%d")
TIME=$(TZ=Europe/Madrid date +"%H:%M")

# slugify
SLUG=$(printf "%s" "$TITLE" \
  | tr '[:upper:]' '[:lower:]' \
  | iconv -t ascii//TRANSLIT \
  | sed 's/[^a-z0-9 _-]//g' \
  | sed 's/  */ /g' \
  | tr ' ' '-' )

FILENAME="$SLUG.mdx"
FILEPATH="$BLOG_DIR/$FILENAME"

mkdir -p "$BLOG_DIR"

if [ -f "$FILEPATH" ]; then
  echo "post already exists: $FILENAME"
  exit 1
fi

cat <<EOF > "$FILEPATH"
---
title: $TITLE  
date: $DATE   
time: $TIME   
description:    
published: false    
---

just setting this up.

EOF

echo "created: $FILEPATH"
