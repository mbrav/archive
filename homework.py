import requests
import datetime as dt
from typing import Optional


class Record:
    """Класс записей.

    Сохраняет объекты записей в список records[]
    """

    def __init__(self, amount: int, comment: str, date: Optional[str] = None):
        """Сохранить новую запись."""

        self.amount = amount
        self.comment = comment

        if not date:
            self.date = dt.datetime.now().date()
            # print(f"Дата не была указана. "
            #       f"Записываем {self.date} по умолчанию.")
        else:
            self.date = dt.datetime.strptime(date, "%d.%m.%Y").date()
            # print(f"Записываем {self.date}.")


class Calculator():
    """Класс Калькулятора.

    Функции:

    add_record()
    get_today_stats()
    get_week_stats()

    """

    def __init__(self, limit):
        self.limit = limit
        records = []
        self.records = records

    def add_record(self, date):
        """Сохранить новую запись."""
        self.records.append(date)

    def get_today_stats(self):
        """Считать, сколько денег и калорий потрачено сегодня."""
        today_date = dt.datetime.now().date()
        sum = 0.0
        for rec in self.records:
            if rec.date == today_date:
                sum += float(rec.amount)
        return sum

    def get_week_stats(self):
        """Считать, сколько денег и калорий получено за последние 7 дней."""
        today_date = dt.datetime.now().date()
        week_ago = today_date - dt.timedelta(days=7)
        sum = 0.0
        for rec in self.records:
            if rec.date <= today_date and rec.date >= week_ago:
                sum += float(rec.amount)
        return sum


class CaloriesCalculator(Calculator):
    """Калькулятор денег.

    Функции:

    add_record()
    get_today_stats()
    get_week_stats()
    get_calories_remained()

    """

    def __init__(self):
        pass

    def get_calories_remained():
        """Считать сколько калорий можно сегодня съесть.
        В случае превышения лимита, делать бодишейминг
        """
        pass


class CashCalculator(Calculator):
    """Калькулятор калорий.

    Функции:

    add_record()
    get_today_stats()
    get_week_stats()
    get_today_cash_remained()

    """

    def __init__(self):
        """
        API: Free Currency Rates API
        https://github.com/fawazahmed0/currency-api
        """

        response = requests.get('https://cdn.jsdelivr.net/gh/'
                                'fawazahmed0/currency-api@1/'
                                'latest/currencies/rub.json')
        json = response.json()

        self.USD_RATE = float(json['rub']['usd'])
        self.EURO_RATE = float(json['rub']['eur'])

        print('Валюта \t Курс 1 рубль \n'
              f'Евро \t {self.EURO_RATE} \n'
              f'Доллар \t {self.USD_RATE}')

    def get_today_cash_remained(self, currency):
        """Определить, сколько ещё денег можно потратить
        сегодня в рублях, долларах или евро."""
        currency = currency.lower()

        if currency == 'rub':
            pass
        elif currency == 'usd':
            pass
        elif currency == 'eur':
            pass
        else:
            pass


r1 = Record(amount=145, comment='Безудержный шопинг')
r2 = Record(amount=1568,
            comment='Наполнение потребительской корзины',
            date='09.03.2019')
r3 = Record(amount=691, comment='Катание на такси', date='08.03.2019')
