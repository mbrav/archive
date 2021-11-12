# -*- coding: utf-8 -*-
import scrapy


class RedditSpider(scrapy.Spider):
    name = "reddit"
    allowed_domains = ["reddit.com"]
    start_urls = ['https://www.reddit.com/r/Impeach_Trump/']

    def parse(self, response):
        for sel in response.xpath('//div'):
            title = sel.xpath('a/text()').extract()
            link = sel.xpath('a/@href').extract()
            desc = sel.xpath('text()').extract()
            print (title, link, desc)
