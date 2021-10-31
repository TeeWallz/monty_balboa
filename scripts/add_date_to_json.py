import json
from datetime import datetime



with open('src/data/chumps.json', 'r+') as f:
    data = json.load(f)

    for bout in data:
        obj = datetime.strptime(bout['date'], '%Y-%m-%d')
        bout['date_aus_string'] = obj.strftime('%d/%m/%Y')
        bout['date_year']  = obj.strftime('%Y')
        bout['date_week'] = obj.isocalendar()[1]
        bout['image'] = '/images/' + bout['date'] + '.jpg'

        print(bout)
        f.seek(0)        # <--- should reset file position to the beginning.
        json.dump(data, f, indent=4)
        f.truncate()     # remove remaining part