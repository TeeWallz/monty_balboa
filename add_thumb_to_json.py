import json

file = '/home/tom/git/home/monty_balboa/src/data/chumps.json'

with open(file, 'r') as f:
  data = json.load(f)

for chump in data:
    chump['thumb'] = chump['image'].replace('/images/', '/images/thumbs/')
    jej = 1

with open(file, 'w') as json_file:
  json.dump(data, json_file)