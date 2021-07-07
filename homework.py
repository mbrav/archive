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
        else:
            self.date = dt.datetime.strptime(date, date_format).date()


class Calculator():
    """Класс Калькулятора."""

    def __init__(self, limit):
        self.limit = limit
        self.records = []
        self.today_date = dt.datetime.now().date()

    def add_record(self, record: Record):
        """Сохранить новую запись."""

        self.records.append(record)

    def get_today_stats(self):
        """Считать, сколько денег и калорий потрачено сегодня."""
        sum = 0.0
        for rec in self.records:
            if rec.date == self.today_date:
                sum += float(rec.amount)
        return sum

    def get_week_stats(self):
        """Считать, сколько денег и калорий получено за последние 7 дней."""
        week_ago = self.today_date - dt.timedelta(days=7)
        sum = 0.0
        for rec in self.records:
            if rec.date <= self.today_date and rec.date >= week_ago:
                sum += float(rec.amount)
        return sum

    def today_remained(self):
        """Подсчитать остаток оставшийся на сегодня."""
        sum = 0.0
        for rec in self.records:
            if rec.date == self.today_date:
                sum += float(rec.amount)
        remainder = self.limit - sum
        return sum, remainder


class CaloriesCalculator(Calculator):
    """Калькулятор денег."""

    def __init__(self, limit):
        super().__init__(limit)
        self.limit = limit

    def get_calories_remained(self):
        """Считать сколько калорий можно сегодня съесть.
        В случае превышения лимита, делать бодишейминг
        """

        sum, remainder = self.today_remained()

        msg = ""
        if remainder > 0:
            msg = ('Сегодня можно съесть что-нибудь ещё,'
                   f' но с общей калорийностью не более {int(remainder)} кКал')
        else:
            msg = 'Хватит есть!'

        return msg


class CashCalculator(Calculator):
    """Калькулятор калорий."""

    USD_RATE = 73.20
    EURO_RATE = 86.85

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
            self.USD_RATE = 73.20
            self.EURO_RATE = 86.85
        else:
            response = requests.get('https://cdn.jsdelivr.net/gh/'
                                    'fawazahmed0/currency-api@1/'
                                    'latest/currencies/rub.json')
            json = response.json()

            self.USD_RATE = 1 / float(json['rub']['usd'])
            self.EURO_RATE = 1 / float(json['rub']['eur'])

        print('Валюта \t В рублях \n'
              f'Доллар \t {self.USD_RATE} \n'
              f'Евро \t {self.EURO_RATE}')

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
            multiplier = 1 / self.USD_RATE
        elif currency == 'eur':
            multiplier = 1 / self.EURO_RATE
        else:
            pass

        sum, remainder = self.today_remained()

        limit = self.limit
        rem = abs(remainder) * multiplier
        if remainder > 0:
            return f'На сегодня осталось {rem:.2f} {cur_format}'
        elif remainder == 0:
            return 'Денег нет, держись'
        else:
            return ('Денег нет, держись: твой долг'
                    f' - {rem:.2f} {cur_format}')


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
