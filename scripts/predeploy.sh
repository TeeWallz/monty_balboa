#!/bin/bash

scripts/remove_build_media_hash_from_filename.sh
scripts/copy_json_to_public.sh
python3 scripts/generate_rss_feed.py