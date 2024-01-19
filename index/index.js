/* --------------- DATA PROCESSING --------------- */
class Booking {
  constructor(e) {
    this.emoji = categories[e.category];
    this.category = e.category;
    this.time = new Date(e.time);
    this.value = e.value;
    this.isExpenditure = e.isExpenditure;
  }

  /**
   *
   * @returns HH:mm in typeof string
   */
  stringifyTime() {
    const min = this.time.getMinutes().toString().padStart(2, "0");
    const hour = this.time.getHours().toString().padStart(2, "0");
    return hour + ":" + min;
  }

  /**
   * Returns the number in typeof string with $ sign and - sign accordingly
   * @returns A number of typeof string
   */
  stringifyValue() {
    const strValue = "$" + this.value.toFixed(2).toString();
    if (this.isExpenditure) return "-" + strValue;
    return strValue;
  }
}

class UIData {
  constructor() {
    const data = [];
    for (const e of bookings) {
      data.push(new Booking(e));
    }
    this.data = data;
  }

  /**
   * Organize the given raw data into a map with the following format:
   * map {
   *    2023 {
   *        0 (Jan.) {
   *            1 (date) {
   *                booking
   *            }
   *        }
   *    }
   * }
   * @returns Map
   */
  mapping() {
    const map = new Map();
    for (const e of this.data) {
      const year = e.time.getFullYear();
      if (map.has(year)) {
        const tempArr = map.get(year);
        tempArr.push(e);
        map.set(year, tempArr);
      } else {
        map.set(year, [e]);
      }
    }

    map.forEach(function (bookings, year) {
      const monthMap = new Map();
      for (const e of bookings) {
        const month = e.time.getMonth() + 1;
        if (monthMap.has(month)) {
          const tempArr = monthMap.get(month);
          tempArr.push(e);
          monthMap.set(month, tempArr);
        } else {
          monthMap.set(month, [e]);
        }
        map.set(year, monthMap);
      }
    });

    map.forEach(function (monthMap, year) {
      monthMap.forEach(function (bookings, month) {
        const dateMap = new Map();
        for (const e of bookings) {
          const date = e.time.getDate();
          if (dateMap.has(date)) {
            const tempArr = dateMap.get(date);
            tempArr.push(e);
            dateMap.set(date, tempArr);
          } else {
            dateMap.set(date, [e]);
          }
          monthMap.set(month, dateMap);
        }
      });
      map.set(year, monthMap);
    });

    return map;
  }
}
// const data = new UIData();
// const map = data.mapping();
// console.log(map.get(2024).get(1).get(1));

class Day {
  constructor(str) {
    const time = str.split("-");
    this.year = parseInt(time[0]);
    this.month = parseInt(time[1]);
    this.date = parseInt(time[2]);

    const map = new UIData().mapping();
    const data = map.get(this.year).get(this.month).get(this.date);
    this.data = data;
    console.log(this.data);
  }

  /**
   *
   * @returns A day (Monday, Tuesday, ...) based on the given Date()
   */
  getDay() {
    const str = `${this.year.toString()}-${this.month.toString()}-${this.date.toString()}`;
    const time = new Date(str);
    return dayIndex[time.getDay()];
  }

  /**
   *
   * @returns A stirng in the format "Tuesday, Sep. 25"
   */
  stringifyDayDate() {
    const day = this.getDay();
    const month = monthIndex[this.month];
    return `${day}, ${month} ${this.date}`;
  }

  /**
   * Calculates total expenditure on a given date
   * @returns numbers
   */
  getTotalExpenditure() {
    return this.data.reduce((acc, e) => {
      if (e.isExpenditure) {
        return acc + e.value;
      } else {
        return acc;
      }
    }, 0);
  }

  /**
   *
   * @returns A string indicating total expenditure on a given date
   */
  stringifyTotalExpenditure() {
    const value = this.getTotalExpenditure();
    if (Number.isInteger(value)) {
      return `💸 $${value}`;
    }
    return `💸 $${value.toFixed(2)}`;
  }

  /**
   * Calculates total income on a given date
   * @returns numbers
   */
  getTotalIncome() {
    return this.data.reduce((acc, e) => {
      if (e.isExpenditure) {
        return acc;
      } else {
        return acc + e.value;
      }
    }, 0);
  }

  /**
   *
   * @returns A string indicating total income on a given date
   */
  stringifyTotalIncome() {
    const value = this.getTotalIncome();
    if (Number.isInteger(value)) {
      return `💰 $${value}`;
    }
    return `💰 $${value.toFixed(2)}`;
  }

  /**
   * Ranks the bookings on a given date (latest bookings on top)
   */
  rankBookings() {
    this.data.sort((a, b) => b.time - a.time);
  }
}
const day1 = new Day("2024-01-03");
// console.log(day1.getTotalIncome());

class Month {
  constructor(str) {
    const time = str.split("-");
    this.year = parseInt(time[0]);
    this.month = parseInt(time[1]);

    const map = new UIData().mapping();
    const data = map.get(this.year).get(this.month);
    this.data = data;
  }

  /**
   * Calculates total expenditure on a given month
   * @returns numbers
   */
  getTotalExpenditure() {
    let sum = 0;
    this.data.forEach(function (bookings, day) {
      const temp = new Day(`${this.year}-${this.month}-${day}`);
      sum += temp.getTotalExpenditure();
    }, this);
    return sum;
  }

  /**
   *
   * @returns A string indicating total expenditure on a given month
   */
  stringifyTotalExpenditure() {
    const value = this.getTotalExpenditure();
    if (Number.isInteger(value)) {
      return `$${value}`;
    }
    return `$${value.toFixed(2)}`;
  }

  /**
   * Calculates total income on a given month
   * @returns numbers
   */
  getTotalIncome() {
    let sum = 0;
    this.data.forEach(function (bookings, day) {
      const temp = new Day(`${this.year}-${this.month}-${day}`);
      sum += temp.getTotalIncome();
    }, this);
    return sum;
  }

  /**
   *
   * @returns A string indicating total income on a given month
   */
  stringifyTotalIncome() {
    const value = this.getTotalIncome();
    if (Number.isInteger(value)) {
      return `$${value}`;
    }
    return `$${value.toFixed(2)}`;
  }

  /**
   *
   * @returns A string in format (September 2023)
   */
  stringifyHeader() {
    return `${fullMonthIndex[this.month]} ${this.year}`;
  }

  /**
   *
   * @returns A string in format (09/01/2023 - 09/30/2023)
   */
  stringifyDateRange() {
    const lastDay = new Date(this.year, this.month, 0)
      .getDate()
      .toString()
      .padStart(2, "0");
    const month = this.month.toString().padStart(2, "0");
    const year = this.year.toString();
    return `${month}/01/${year} - ${month}/${lastDay}/${year}`;
  }

  /**
   * Ranks the bookings of a given month (latest date on top)
   */
  rankBookings() {
    const dateArr = [];
    this.data.forEach(function (_, date) {
      dateArr.push(date);
    });
    dateArr.sort((a, b) => b - a);
    return dateArr;
  }
}
// const month1 = new Month("2023-09");
// const ranks = month1.rankBookings();

class Year {
  constructor(str) {
    this.year = parseInt(str);
    this.data = new UIData().mapping().get(this.year);
  }

  getTotalExpenditure() {
    let sum = 0;
    this.data.forEach(function (bookings, month) {
      const temp = new Month(`${this.year}-${month}`);
      sum += temp.getTotalExpenditure();
    }, this);
    return sum;
  }

  stringifyTotalExpenditure() {
    const value = this.getTotalExpenditure();
    if (Number.isInteger(value)) {
      return `$${value}`;
    }
    return `$${value.toFixed(2)}`;
  }

  getTotalIncome() {
    let sum = 0;
    this.data.forEach(function (bookings, month) {
      const temp = new Month(`${this.year}-${month}`);
      sum += temp.getTotalIncome();
    }, this);
    return sum;
  }

  stringifyTotalIncome() {
    const value = this.getTotalIncome();
    if (Number.isInteger(value)) {
      return `$${value}`;
    }
    return `$${value.toFixed(2)}`;
  }
}
// const year1 = new Year("2025");
// year1.stringifyTotalIncome();

/**
 * this.data is an array of Day objects
 */
/* --------------- INTERFACE --------------- */
class UI {
  constructor(str) {
    const time = str.split("-");
    this.year = parseInt(time[0]);
    if (time.length == 1) {
      this.month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    } else {
      this.month = [parseInt(time[1])];
    }

    const monthData = [];
    for (const e of this.month) {
      const temp = new Month(`${this.year}-${e}`);
      if (temp.data) {
        monthData.push(temp);
      }
    }

    const dateData = [];
    for (const e of monthData) {
      e.data.forEach(function (value, key) {
        const temp = new Day(`${e.year}-${e.month}-${key}`);
        dateData.push(temp);
      });
    }

    this.data = dateData;
    this.doms = {
      dayContainer: document.querySelector(".day-container"),
    };
    this.createOneDayHTML();
    this.updateHeader();
  }

  /**
   *
   * @param {A booking object} booking
   * @returns HTML content for one booking
   */
  createBookingHTML(booking) {
    const category = booking.category;
    const capitalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);

    return `
        <li>
            <span class="day-container__details-emoji">${booking.emoji}</span>
            <span class="day-container__details-category">${capitalizedCategory}</span>
            <span class="day-container__details-time">${booking.stringifyTime()}</span>
            <span class="day-container__details-amount numbers">${booking.stringifyValue()}</span>
        </li>`;
  }

  /**
   * Generate HTML content for one day
   */
  createOneDayHTML() {
    let dayTitle = ``;

    for (const e of this.data) {
      e.rankBookings();
      dayTitle += `
        <div class="day-container__title">
            <span class="day-container__date">${e.stringifyDayDate()}</span>
            <span class="day-container__total-expense numbers">${e.stringifyTotalExpenditure()}</span>
            <span class="day-container__total-income numbers">${e.stringifyTotalIncome()}</span>
        </div>`;

      let dayBookings = `<ul class="day-container__details">`;

      for (const booking of e.data) {
        dayBookings += this.createBookingHTML(booking);
      }
      dayBookings += `</ul>`;
      dayTitle += dayBookings;
    }

    this.doms.dayContainer.innerHTML = dayTitle;
  }

  updateHeader() {}
}

// const ui1 = new UI("2025");
const ui2 = new UI("2025-01");
