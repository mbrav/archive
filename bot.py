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

insta_username = keys['insta_username']
insta_password = keys['insta_password']

tg_api_key = keys['tg_api_key']
tg_chat_id = keys['tg_chat_id']

def tg_msg(msg):
  requests.get(
    "https://api.telegram.org/bot" + 
    tg_api_key + 
    "/sendMessage?chat_id=" + 
    tg_chat_id + 
    "&text=" + 
    msg +
    "@ {}"
    .format(datetime.now().strftime("%H:%M:%S")))

comments = [
  u'Отличный снимок! :camera: 👍',
  u'Отличный снимок! :camera: :+1:',
  u'Вау! :thumbsup:',
  u'Изумительно :open_mouth:',
  u'Восхитительно :open_mouth:',
  u'Великолепно :open_mouth:',
  u'Головокружительно :open_mouth:',
  u'Превосходно :open_mouth:',
  u'Вдохновляюще, :open_mouth:',
  u'У вас отличные посты',
  u'Выглядит классно! :open_mouth:',
  u'Выглядит классно! :open_hands: :+1:',
  u':raised_hands: Да!',
  u':+1:',
  u'🙌',
  u':sunny: :+1:',
  u':cherry_blossom:',
  u':green_heart:',
  u'Это фото огонь🔥🔥🔥',
  u'Это фотография сделала мой день🙌👍👍',
  u'Огонь🔥🔥🔥',
  u'Пришела, увидела, забыла, что хотела👀',
  u'Побольше бы таких людей как ты, и мир стал бы лучше🙌',
  u'Класс👍😺',
  u'Прекрасно💖',
  u'Отлично✌😹',
  u'Офигенно🌸🌸🌸',
  u'Интересно ♨️',
  u'Поразительно 🙀😻',
  u'Очень здорово🎉',
  u'Дух захватывает🤟',
  u'Очень красиво ✅',
  u'Картинка прям ✔️🙂',
  u'Очень удачное фото ✨',
  u'Я влюблена 😙',
  u'Просто потрясающе 🔥🔥🔥',
  u'Интересно вас читать 😻🌈',
  u'Не налюбуешься 👍',
  u'У вас интересные публикации🔥🔥',
  u'Всегда жду ваших постов🍒',
  u':heart:'
  ]


def get_session():
  session = InstaPy(username=insta_username,
    password=insta_password,
    headless_browser=False,
    nogui=False,
    multi_logs=False)

  session.set_mandatory_language(enabled=True, character_set=['LATIN', 'CYRILLIC'])

  session.set_simulation(enabled=True, percentage=66)

  session.set_quota_supervisor(enabled=True, 
    sleep_after=["likes", "comments_d", "follows", "unfollows", "server_calls_h"], 
    sleepyhead=True, 
    stochastic_flow=True, 
    notify_me=True,
    peak_likes_hourly=60,
    peak_likes_daily=400,
    peak_comments_hourly=20,
    peak_comments_daily=160,
    peak_follows_hourly=30,
    peak_follows_daily=None,
    peak_unfollows_hourly=30,
    peak_unfollows_daily=380,
    peak_server_calls_hourly=None,
    peak_server_calls_daily=4000)

  session.set_action_delays(enabled=True,
    like=3,
    comment=5,
    follow=4.17,
    unfollow=28,
    story=10,
    randomize=True, 
    random_range_from=70, 
    random_range_to=140)

  session.set_skip_users(skip_private=False,
    private_percentage=0,
    skip_no_profile_pic=True,
    no_profile_pic_percentage=100,
    skip_business=False,
    skip_non_business=False,
    business_percentage=100,
    skip_business_categories=[],
    dont_skip_business_categories=[],
    skip_bio_keyword=[],
    mandatory_bio_keywords=[])

  session.set_relationship_bounds(enabled=False,
    potency_ratio=1.1,
    delimit_by_numbers=True,
    max_followers=1200,
    max_following=500,
    min_followers=80,
    min_following=56,
    min_posts=10,
    max_posts=4000)

  # User settings     
  session.set_skip_users(skip_private=False,
   skip_no_profile_pic=True,
   skip_business=False,
   skip_business_categories=['Creators & Celebrities'])
  return session

def feedinteract():
  # Send notification to my Telegram
  tg_msg('InstaPy Feed Interaction Started')

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    try:
      # LIKE SETTINGS
      session.set_delimit_liking(enabled=True, max_likes=200, min_likes=10)
      # session.like_by_tags(hashtags, amount=10)

      # LIKE FEED
      # This is used to perform likes on your own feeds
      # amount=100  specifies how many total likes you want to perform
      # randomize=True randomly skips posts to be liked on your feed
      # unfollow=True unfollows the author of a post which was considered
      # inappropriate interact=True visits the author's profile page of a
      # certain post and likes a given number of his pictures, then returns to feed

      session.like_by_feed(amount=80, randomize=True, interact=True)
      session.set_user_interact(amount=5, randomize=True, percentage=60, media='Photo') 

    except Exception:
      print(traceback.format_exc())
      tg_msg('InstaPy Feed Interaction Stopped')

def follow():
  # Send notification to my Telegram
  tg_msg('InstaPy Follower Started')

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    counter = 0

    while counter < 5:
      counter += 1

      try:
        session.follow_user_followers(['sadhana_poyma'], amount=5,
          randomize=False)
        session.set_do_comment(enabled=True, percentage=70)
        session.set_comments(comments)
        session.follow_by_tags(['гамаки', '#кундалини', '#кундалинийога', '#хатха'], amount=10)
        session.follow_by_tags(['йогакрасногорск'], amount=5, randomize=True)
        session.unfollow_users(amount=25,
         style="RANDOM",
         unfollow_after=48 * 60 * 60,
         sleep_delay=450,
         instapy_followed_param="nonfollowers")

      except Exception:
        print(traceback.format_exc())
        # Send notification to my Telegram
        tg_msg('InstaPy Follower Stopped')

def unfollow():
  tg_msg('InstaPy Unfollower Started')

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
      tg_msg('InstaPy Unfollower Stopped')


def xunfollow():
  tg_msg('InstaPy SUPER Unfollower Started')

  # get a session!
  session = get_session()

  # let's go!
  with smart_run(session):
    try:
      # settings
      # session.set_relationship_bounds(enabled=False, potency_ratio=1.21)

      # actions
      session.unfollow_users(amount=1000,
       style="RANDOM",
       sleep_delay=450,
       instapy_followed_param="all")

    except Exception:
      print(traceback.format_exc())
      tg_msg('InstaPy SUPER Unfollower Stopped')

# schedulers
# schedule.every().day.at("09:30").do(follow)
# schedule.every().day.at("13:30").do(follow)
# schedule.every().day.at("17:30").do(follow)
# schedule.every().day.at("23:28").do(follow)

# schedule.every().day.at("00:05").do(unfollow)

# schedule.every().wednesday.at("03:00").do(xunfollow)

# while True:
#   schedule.run_pending()
#   time.sleep(1)

xunfollow()
