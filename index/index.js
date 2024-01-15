/* --------------- DATA PROCESSING --------------- */

class Booking {
  constructor(e) {
    this.emoji = categories[e.category];
    this.category = e.category;
    this.time = new Date(e.time);
    this.value = e.value;
    this.isExpenditure = e.isExpenditure;
  }

  //   getSeconds() {
  //     return this.time.getSeconds();
  //   }

  //   getMinutes() {
  //     // Indexing from 0 - 59
  //     return this.time.getMinutes();
  //   }

  //   getHours() {
  //     // Indexing from 0 - 23
  //     return this.time.getHours();
  //   }

  //   /**
  //    *
  //    * @returns Index representing which day it is within a week (Monday, Tuesday, ...)
  //    */
  //   getDay() {
  //     // Indexing from 0 - 6
  //     return this.time.getDay();
  //   }

  //   getDate() {
  //     // Indexing from 1 - 31
  //     return this.time.getDate();
  //   }

  //   getMonth() {
  //     // Indexing from 0 - 11
  //     return this.time.getMonth();
  //   }

  //   getYear() {
  //     return this.time.getFullYear();
  //   }

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
        const month = e.time.getMonth();
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

const data = new UIData();
const map = data.mapping();
console.log(map.get(2024).get(0).get(1));

// A particular day
class Day {
  constructor(str) {
    //YYYY-MM-DD ("2023-09-20")
    // get all today's data
    const time = str.split("-");
    const year = time[0];
    const month = time[1];
    const date = time[2];
    // const data = map.get(year).get(month).get(date)
  }

  getDay() {}

  getDate() {}

  getTotalExpenditure() {}

  getTotalIncome() {}

  rankBookings() {}
}

// for (const e of bookings) {
//   const temp = new Booking(e);
//   console.log(temp.stringifyValue());
// }

// const booking1 = new Booking({
//   category: "study",
//   time: "2023-10-26T20:17:19.729",
//   value: 129.69797205047885,
//   isExpenditure: true,
// });

// console.log(booking1.stringifyTime());

//-------------------------------------------------------------------------
/*
class Month {
  constructor() {
    // get all this month's data
  }

  getDay() {}

  getDate() {}

  getTotalExpenditure() {}

  getTotalIncome() {}
}

class Year {
  constructor() {
    // get all this year's data
  }

  getDay() {}

  getDate() {}

  getTotalExpenditure() {}

  getTotalIncome() {}
}

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

const temp = new UIData();
temp.printout();

// object Day

// calculate daily/monthly/yearly total expendirue/income
*/

/* --------------- INTERFACE --------------- */
