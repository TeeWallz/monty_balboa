#!/bin/bash

find ../build/static/media/* -type f | perl -pe 'print $_; s/(.*)(\..*)(\..*)/$1$3/' | xargs -d "\n" -n2 mv