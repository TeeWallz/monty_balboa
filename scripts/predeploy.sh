#!/bin/bash

echo Running scripts/remove_build_media_hash_from_filename.sh
scripts/remove_build_media_hash_from_filename.sh

echo Running scripts/copy_json_to_public.sh
scripts/copy_json_to_public.sh

echo Running scripts/generate_rss_feed.py
python3 scripts/generate_rss_feed.py