import os
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

        date_format = '%d.%m.%Y'

        if not date:
            self.date = dt.datetime.now().date()
            # print(f"Дата не была указана. "
            #       f"Записываем {self.date} по умолчанию.")
        else:
            self.date = dt.datetime.strptime(date, date_format).date()
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
        self.records = []

    def add_record(self, record: Record):
        """Сохранить новую запись."""

        self.records.append(record)

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

    def __init__(self, limit):
        super().__init__(limit)
        self.limit = limit

    def get_calories_remained(self):
        """Считать сколько калорий можно сегодня съесть.
        В случае превышения лимита, делать бодишейминг
        """

        today_date = dt.datetime.now().date()
        sum = 0.0
        for rec in self.records:
            if rec.date == today_date:
                sum += float(rec.amount)

        msg = ""
        if sum < self.limit:
            remainder = int(self.limit - sum)
            msg = ('Сегодня можно съесть что-нибудь ещё,'
                   f' но с общей калорийностью не более {remainder} кКал')
        else:
            msg = 'Хватит есть!'

        return msg


class CashCalculator(Calculator):
    """Калькулятор калорий.

    Функции:

    add_record()
    get_today_stats()
    get_week_stats()
    get_today_cash_remained()

    """

    USD_RATE = 0.013672
    EURO_RATE = 0.011535

    def __init__(self, limit):
        """
        Добыть курсы Еврo и Доллара через API

        API: Free Currency Rates API
        https://github.com/fawazahmed0/currency-api
        """

        super().__init__(limit)

        # Нужно для pytest'а
        # Иначе, каждое создание класса CashCalculator()
        # занимает приличное время.
        if "PYTEST_CURRENT_TEST" in os.environ:
            self.USD_RATE = 0.013672
            self.EURO_RATE = 0.011535
        else:
            response = requests.get('https://cdn.jsdelivr.net/gh/'
                                    'fawazahmed0/currency-api@1/'
                                    'latest/currencies/rub.json')
            json = response.json()

            self.USD_RATE = float(json['rub']['usd'])
            self.EURO_RATE = float(json['rub']['eur'])

        usd_by_1 = round(1 / self.USD_RATE, 2)
        eur_by_1 = round(1 / self.EURO_RATE, 2)

        print('Валюта \t В рублях \n'
              f'Доллар \t {usd_by_1} \n'
              f'Евро \t {eur_by_1}')

    def get_today_cash_remained(self, currency):
        """Определить, сколько ещё денег можно потратить
        сегодня в рублях, долларах или евро."""

        currency_dict = {
            'usd': 'USD',
            'eur': 'Euro',
            'rub': 'руб'
        }

        currency = currency.lower()
        cur_format = currency_dict[currency]

        multiplier = None
        if currency == 'rub':
            multiplier = 1.0
        elif currency == 'usd':
            multiplier = self.USD_RATE
        elif currency == 'eur':
            multiplier = self.EURO_RATE
        else:
            pass

        today_date = dt.datetime.now().date()
        sum = 0.0
        for rec in self.records:
            if rec.date == today_date:
                sum += float(rec.amount)

        remainder = round(abs((sum - self.limit) * multiplier), 2)
        if sum < self.limit:
            return f'На сегодня осталось {remainder} {cur_format}'
            print(f'На сегодня осталось {remainder} {cur_format}')
        elif sum == self.limit:
            return 'Денег нет, держись'
            print('Денег нет, держись')
        else:
            return f'Денег нет, держись: твой долг - {remainder} {cur_format}'
            print(f'Денег нет, держись: твой долг - {remainder} {cur_format}')


# создадим калькулятор денег с дневным лимитом 1000
cash_calculator = CashCalculator(1000)

# дата в параметрах не указана,
# так что по умолчанию к записи
# должна автоматически добавиться сегодняшняя дата
cash_calculator.add_record(Record(amount=145, comment='кофе'))
# и к этой записи тоже дата должна добавиться автоматически
cash_calculator.add_record(Record(amount=300, comment='Серёге за обед'))
# а тут пользователь указал дату, сохраняем её
cash_calculator.add_record(Record(amount=3000,
                                  comment='бар в Танин др',
                                  date='08.11.2019'))

print(cash_calculator.get_today_cash_remained('rub'))
# должно напечататься
# На сегодня осталось 555 руб
