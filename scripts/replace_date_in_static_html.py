import json
import os
import shutil

# Change to script directory
abspath = os.path.abspath(__file__)
dname = os.path.dirname(abspath)
os.chdir(dname)
os.chdir('../')

# Read in our chumps
chumps_file_location = "src/data/chumps.json"
with open(chumps_file_location) as f:
    chumps = json.load(f)
last_date = chumps[0]['date_aus_string']

# Replace the bout placeholder with the latest bout
with open('public/index_template.html', "rt") as fin:
    index_data = fin.read()
    with open('public/index.html', "wt") as fout:
        fout.write(index_data.replace('[BOUT]', last_date))

