# -*- coding: UTF-8 -*-

# imports
from instapy import InstaPy
from instapy import smart_run

# load keys from JSON file
keys = json.load(open('keys.json'))
print(keys['insta_username']) 

insta_username = keys['insta_username']
insta_password = keys['insta_password']

tg_api_key = keys['tg_api_key']
tg_chat_id = keys['tg_chat_id']

# get an InstaPy session!
# set headless_browser=True to run InstaPy in the background
session = InstaPy(username=insta_username,
  password=insta_password,
  headless_browser=False)

with smart_run(session):
  # Functions you can use target_list with:
  # https://github.com/timgrossmann/InstaPy/blob/master/DOCUMENTATION.md#target-lists
  hashtags = session.target_list("./hashtags.txt")
  users = session.target_list("./users.txt")

  # LIMIT SETTINGS

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

  session.set_relationship_bounds(enabled=True,
    potency_ratio=1.1,
    delimit_by_numbers=True,
    max_followers=700,
    max_following=600,
    min_followers=80,
    min_following=56,
    min_posts=10,
    max_posts=1000)

  User settings			
  session.set_skip_users(skip_private=False,
   skip_no_profile_pic=True,
   skip_business=False,
   skip_business_categories=['Creators & Celebrities'])


  # COMMENTS
  session.set_delimit_commenting(enabled=True, max_comments=12, min_comments=0)
  session.set_do_comment(enabled=True, percentage=70)
  session.set_comments([
    u'Отличный снимок! :camera: :thumbsup:',
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
    u':open_hands:',
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
    ])

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

 # INTERACT SETTINGS 
  session.set_user_interact(amount=5, randomize=True, percentage=60, media='Photo') 
  session.interact_user_followers(['sadhana_poyma'], amount=70, randomize=True)
  # session.interact_user_following(['sadhana_poyma'], amount=70, randomize=True)

