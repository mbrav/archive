# -*- coding: UTF-8 -*-
import time
from datetime import datetime
import schedule
import traceback
import requests
import json

from instapy import InstaPy
from instapy import smart_run
 
# load keys from JSON file
keys = json.load(open('keys.json'))
print(keys['insta_username']) 

insta_username = keys['insta_username']
insta_password = keys['insta_password']

tg_api_key = keys['tg_api_key']
tg_chat_id = keys['tg_chat_id']


def get_session():
  session = InstaPy(username=insta_username,
    password=insta_password,
    headless_browser=False,
    nogui=False,
    multi_logs=False)
  return session


def follow():
  # Send notification to my Telegram
  requests.get(
    "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text='InstaPy Follower Started @ {}'"
    .format(datetime.now().strftime("%H:%M:%S")))

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    counter = 0

    while counter < 5:
      counter += 1

      try:
        # settings
        session.set_relationship_bounds(enabled=True,
          potency_ratio=1.21)

        # activity
        session.follow_user_followers(['sadhana_poyma'], amount=5,
          randomize=False)
        session.follow_by_tags(
            ['کادو', 'سالن', 'فروشگاه', 'زنانه', 'فشن', 'میکاپ',
            'پوست', 'زیبا'], amount=10)
        session.follow_by_tags(
            ['لاغری', 'خرید_آنلاین', 'کافی_شاپ', 'گل'], amount=5)
        session.unfollow_users(amount=25,
         style="RANDOM",
         unfollow_after=48 * 60 * 60,
         sleep_delay=450,
         instapy_followed_param="nonfollowers")

      except Exception:
        print(traceback.format_exc())

  # Send notification to my Telegram
  requests.get(
    "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text=InstaPy Follower Stopped @ {}"
    .format(datetime.now().strftime("%H:%M:%S")))

def unfollow():
  requests.get(
    "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text=InstaPy Unfollower Started @ {}"
    .format(datetime.now().strftime("%H:%M:%S")))

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    try:
      # settings
      session.set_relationship_bounds(enabled=False, potency_ratio=1.21)

      # actions
      session.unfollow_users(amount=600, 
        style="RANDOM", 
        sleep_delay=450, 
        instapy_followed_param="nonfollowers")

    except Exception:
      print(traceback.format_exc())
      requests.get(
        "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text=InstaPy Unfollower Stopped @ {}"
        .format(datetime.now().strftime("%H:%M:%S")))


def xunfollow():
  requests.get(
    "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text=InstaPy Unfollower WEDNESDAY Started @ {}"
    .format(datetime.now().strftime("%H:%M:%S")))

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    try:
      # settings
      session.set_relationship_bounds(enabled=False, potency_ratio=1.21)

      # actions
      session.unfollow_users(amount=1000,
       style="RANDOM",
       unfollow_after=3 * 60 * 60,
       sleep_delay=450,
       instapy_followed_param="nonfollowers")

    except Exception:
      print(traceback.format_exc())
      requests.get(
        "https://api.telegram.org/bot" + tg_api_key + "/sendMessage?chat_id=" + tg_chat_id + "&text"
        "=InstaPy Unfollower WEDNESDAY Stopped @ {}"
        .format(datetime.now().strftime("%H:%M:%S")))


schedulers
schedule.every().day.at("09:30").do(follow)
schedule.every().day.at("13:30").do(follow)
schedule.every().day.at("17:30").do(follow)
schedule.every().day.at("23:28").do(follow)

schedule.every().day.at("00:05").do(unfollow)

schedule.every().wednesday.at("03:00").do(xunfollow)

while True:
  schedule.run_pending()
  time.sleep(1)
