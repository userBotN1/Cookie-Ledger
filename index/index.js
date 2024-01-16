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
// const day1 = new Day("2024-01-03");
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

  getTotalExpenditure() {
    let sum = 0;
    this.data.forEach(function (bookings, day) {
      const str = `${this.year}-${this.month}-${day}`;
      const temp = new Day(str);
      sum += temp.getTotalExpenditure();
    }, this);
    console.log(sum);
  }

  stringifyTotalExpenditure() {}

  getTotalIncome() {}

  stringifyTotalIncome() {}

  stringifyHeader() {
    // September 2023
  }

  stringifyDateRange() {
    // 09/01/2023 - 09/30/2023
  }
}
const month1 = new Month("2025-01");
month1.getTotalExpenditure();

class Year {
  constructor() {
    // get all this year's data
  }

  getTotalExpenditure() {}

  stringifyTotalExpenditure() {}

  getTotalIncome() {}

  stringifyTotalIncome() {}
}

//-------------------------------------------------------------------------
/*
class UIData {
  constructor() {
    const data = [];
    for (const e of bookings) {
      data.push(new Booking(e));
    }
    this.data = data;
  }

  printout() {
    console.log(this.data);
  }
}


// object Day
// calculate daily/monthly/yearly total expendirue/income
*/

/* --------------- INTERFACE --------------- */
