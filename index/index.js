/* --------------- LOCAL STORAGE --------------- */
const categoriesString = localStorage.getItem("categories");
const categories = JSON.parse(categoriesString);

const monthIndexString = localStorage.getItem("monthIndex");
const monthIndex = JSON.parse(monthIndexString);

const fullMonthIndexString = localStorage.getItem("fullMonthIndex");
const fullMonthIndex = JSON.parse(fullMonthIndexString);

const dayIndexString = localStorage.getItem("dayIndex");
const dayIndex = JSON.parse(dayIndexString);

const bookingsString = localStorage.getItem("bookings");
const bookings = JSON.parse(bookingsString);

/* --------------- DATA PROCESSING --------------- */
class Booking {
  constructor(e) {
    // this.emoji = categories[e.category]; outdated way of getting emoji
    e.category = e.category.charAt(0).toLowerCase() + e.category.slice(1);

    this.emoji = categories[e.category].emoji;
    this.category = e.category;
    this.time = new Date(e.time);
    this.value = e.value;
    this.isExpenditure = e.isExpenditure;
    this.customNote = e.customNote;
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
    if (this.value) {
      const strValue = "$" + this.value.toFixed(2).toString();
      if (this.isExpenditure) return "-" + strValue;
      return strValue;
    }
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
      return `💰$${value}`;
    }
    return `💰$${value.toFixed(2)}`;
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

  /**
   *
   * @returns A string in format (01/01/2023 - 12/31/2023)
   */
  stringifyDateRange() {
    const lastDay = new Date(this.year, 12, 0)
      .getDate()
      .toString()
      .padStart(2, "0");
    const year = this.year.toString();
    return `01/01/${year} - 12/${lastDay}/${year}`;
  }
}
// const year1 = new Year("2025");
// year1.stringifyTotalIncome();

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
      header: document.querySelector("header"),
      summaryExpenditure: document.querySelector(
        ".expense-income-container__expense_value"
      ),
      summaryIncome: document.querySelector(
        ".expense-income-container__income_value"
      ),
      allDaysContainer: document.querySelector(".all-days-container"),
      // oneBooking: document.querySelector(".day-container__details_booking"),
    };

    this.createOneDayHTML();
    this.updateHeader();
    this.updateSummary();
  }

  /**
   *
   * @param {A booking object} booking
   * @param {number} index
   * @returns HTML content for one booking
   */
  createBookingHTML(booking, dayIndex, itemIndex) {
    const category = booking.category;
    const capitalizedCategory =
      category.charAt(0).toUpperCase() + category.slice(1);
    // console.log("Note", booking.customNote);
    // console.log("Time", booking.time);
    // console.log("");

    return `
        <li class="day-container__details_booking" data-dayIndex=${dayIndex} data-itemIndex=${itemIndex}>
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
    this.data.sort((a, b) => b.date - a.date);
    let dayTitle = ``;

    let dayIndex = 0;
    for (const e of this.data) {
      e.rankBookings();
      dayTitle += `
        <div class="day-container__title">
            <span class="day-container__date">${e.stringifyDayDate()}</span>
            <span class="day-container__total-expense numbers">${e.stringifyTotalExpenditure()}</span>
            <span class="day-container__total-income numbers">${e.stringifyTotalIncome()}</span>
        </div>`;

      let dayBookings = `<ul class="day-container__details">`;

      let itemIndex = 0;
      for (const booking of e.data) {
        dayBookings += this.createBookingHTML(booking, dayIndex, itemIndex);

        itemIndex += 1;
      }
      dayBookings += `</ul>`;
      dayTitle += dayBookings;

      dayIndex += 1;
    }

    this.doms.dayContainer.innerHTML = dayTitle;
  }

  updateHeader() {
    const month = fullMonthIndex[this.month];
    let dateRange = "";

    if (this.month.length === 1) {
      dateRange = new Month(`${this.year}-${this.month}`).stringifyDateRange();
    } else {
      dateRange = new Year(`${this.year}`).stringifyDateRange();
    }

    const template = `
        <div class="month-year">${!month ? "" : month} ${this.year}</div>
        <div class="month-year-details">${dateRange}</div>`;
    this.doms.header.innerHTML = template;
  }

  updateSummary() {
    let expenditure = "";
    let income = "";

    if (this.month.length === 1) {
      const tempMonth = new Month(`${this.year}-${this.month}`);
      expenditure = tempMonth.stringifyTotalExpenditure();
      income = tempMonth.stringifyTotalIncome();
    } else {
      const tempYear = new Year(`${this.year}`);
      expenditure = tempYear.stringifyTotalExpenditure();
      income = tempYear.stringifyTotalIncome();
    }

    this.doms.summaryExpenditure.textContent = expenditure;
    this.doms.summaryIncome.textContent = income;
  }

  /* --------------- INTERACTION --------------- */
  /* --------------- Segue to Transaction Details Page --------------- */
  segueToTransactionDetails(event) {
    let targetElement = event.target.closest(".day-container__details_booking");

    if (targetElement) {
      // Retrieve Info
      const dayIndex = targetElement.getAttribute("data-dayIndex");
      const itemIndex = targetElement.getAttribute("data-itemIndex");
      const booking = this.data[dayIndex].data[itemIndex];
      console.log(booking);

      window.location.href = "../transaction-details/transaction-details.html";
    }
  }
}

// const ui = new UI("2024");
const ui = new UI("2024-04");

/* --------------- INTERACTION --------------- */
/* --------------- Segue to Transaction Details Page --------------- */
ui.doms.allDaysContainer.addEventListener("click", (event) =>
  ui.segueToTransactionDetails(event)
);

/* --------------- Hide Footer on Scrolling --------------- */
const footer = document.querySelector("footer");
let lastScrollTop = 0;
window.addEventListener("scroll", function () {
  const currentScrollTop = window.scrollY;
  if (currentScrollTop > lastScrollTop) {
    footer.style.display = "none";
  } else {
    footer.style.display = "flex";
  }

  lastScrollTop = currentScrollTop;

  if (window.innerHeight + currentScrollTop >= document.body.offsetHeight) {
    footer.style.display = "flex";
  }
});

