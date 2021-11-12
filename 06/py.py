# string = ["as", "asdf","asdf" ]
#
# x = int(raw_input("enter integer: "))
#
# if x < 0:
#     x=0
#     print "negative"
#
# elif x == 0:
#     print "zero"
#
#
# elif x == 1:
#     print "one"
#
# else:
#     print "fuck"
#
# for x in range(0, 30):
#     print x*x

import scrapy


class QuotesSpider(scrapy.Spider):
    name = "quotes"

    def start_requests(self):
        urls = [
            'http://quotes.toscrape.com/page/1/',
            'http://quotes.toscrape.com/page/2/',
        ]
        for url in urls:
            yield scrapy.Request(url=url, callback=self.parse)

    def parse(self, response):
        page = response.url.split("/")[-2]
        filename = 'quotes-%s.html' % page
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.log('Saved file %s' % filename)


scrapy crawl quotes
