import os
import requests
import datetime as dt
from typing import Optional


class Record:
    """Класс записей.

    Сохраняет объекты записей в список records[]
    """

    def __init__(
            self, amount: int,
            comment: str,
            date: Optional[str] = None) -> None:
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
            if self.today_date >= rec.date > week_ago:
                sum += float(rec.amount)
        return sum

    def today_remained(self, rate: Optional[float] = None):
        """Подсчитать остаток оставшийся на сегодня.
        В случае, если курс был указан, дополнительно выдать абсолютный остаток
        переведённый на указанный курс.
        """

        sum = self.get_today_stats()
        remainder = self.limit - sum

        if rate is None:
            return remainder
        else:
            remainder_with_rate = abs(remainder) / rate
            return remainder, remainder_with_rate


class CaloriesCalculator(Calculator):
    """Калькулятор денег."""

    def __init__(self, limit):
        super().__init__(limit)
        self.limit = limit

    def get_calories_remained(self):
        """Считать сколько калорий можно сегодня съесть.
        В случае превышения лимита, делать бодишейминг
        """

        remainder = self.today_remained()

        if remainder > 0:
            return ('Сегодня можно съесть что-нибудь ещё,'
                    ' но с общей калорийностью не более '
                    f'{remainder:.0f} кКал')
        else:
            return 'Хватит есть!'


class CashCalculator(Calculator):
    """Калькулятор калорий."""

    USD_RATE = 0.013420
    EURO_RATE = 0.011352

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
        if "PYTEST_CURRENT_TEST" not in os.environ:
            try:
                response = requests.get('https://cdn.jsdelivr.net/gh/'
                                        'fawazahmed0/currency-api@1/'
                                        'latest/currencies/rub.json')
                json = response.json()

                self.USD_RATE = float(json['rub']['usd'])
                self.EURO_RATE = float(json['rub']['eur'])
            except requests.exceptions.HTTPError as e:
                return "Ошибка: " + str(e)

    def get_today_cash_remained(self, currency):
        """Определить, сколько ещё денег можно потратить
        сегодня в рублях, долларах или евро."""

        currency_dict = {
            'usd': {
                'abreviation': 'USD',
                'rate': self.USD_RATE
            },
            'eur': {
                'abreviation': 'Euro',
                'rate': self.EURO_RATE
            },
            'rub': {
                'abreviation': 'руб',
                'rate': 1.0
            },
        }

        currency = currency.lower()
        cur_format = currency_dict[currency]['abreviation']
        cur_rate = currency_dict[currency]['rate']

        remainder, rate = self.today_remained(cur_rate)
        if remainder > 0:
            return f'На сегодня осталось {rate:.2f} {cur_format}'
        elif remainder == 0:
            return 'Денег нет, держись'
        else:
            return ('Денег нет, держись: твой долг'
                    f' - {rate:.2f} {cur_format}')


if __name__ == "__main__":
    """Исполняемый код лучше выносить в верхний уровень.
    Чтобы при импорте из текущего модуля не запускалось всё, что здесь описано
    https://docs.python.org/3/library/__main__.html
    """

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
