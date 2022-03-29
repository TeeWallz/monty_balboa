#!/bin/bash

cd "$(dirname "$0")"

echo Running scripts/remove_build_media_hash_from_filename.sh
./remove_build_media_hash_from_filename.sh

echo Running scripts/copy_json_to_public.sh
./copy_json_to_public.sh

echo Running scripts/generate_rss_feed.py
python3 ./generate_rss_feed.py

echo "Inserting last date into react's static .html file."
python3 ./replace_date_in_static_html.py