from feedgen.feed import FeedGenerator
import json
from datetime import datetime

fg = FeedGenerator()
fg.id('https://howmanydayssincemontaguestreetbridgehasbeenhit.com/')
fg.title('Howmanydayssincemontaguestreetbridgehasbeenhit>')
fg.author( {'name':'Tom Waller','email':'lolnah'} )
fg.link( href='https://howmanydayssincemontaguestreetbridgehasbeenhit.com/', rel='alternate' )
fg.logo('http://ex.com/logo.jpg')
fg.description('An RSS feed showing when Monty Balboa was hit')
# fg.subtitle('This is a cool feed!')
# fg.link( href='http://larskiesow.de/test.atom', rel='self' )
fg.language('en')


with open('../src/data/chumps.json', 'r+') as f:
    data = json.load(f)

    for bout in data:
        fe = fg.add_entry()
        fe.id(bout['date'])
        fe.title("{} - {}".format(bout['date'], bout['chumps'][0]['name']))
        fe.link(href=bout['chumps'][0]['url'])

#print(fg.rss_str(pretty=True))
fg.rss_file('../build/rss.xml') # Write the RSS feed to a file