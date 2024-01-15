/* --------------- DATA PROCESSING --------------- */

// data => map (format: {2023: {1:{...}, 2: {...}}, 2024: {}})
// use numbers to represent months
// add property "emoji" to data

// A single record
class Booking {
  constructor(e) {
    this.emoji = categories[e.category];
    this.category = e.category;
    this.time = new Date(e.time);
    this.value = e.value;
    this.isExpenditure = e.isExpenditure;
  }

  getTime() {}

  getDay() {}

  getDate() {}

  getMonth() {}

  getYear() {}

  stringifyValue() {
    // Given a value, based on isExpenditure, return the string format
  }
}

// A particular day
class Day {
  constructor() {
    // get all today's data
  }

  getDay() {}

  getDate() {}

  getTotalExpenditure() {}

  getTotalIncome() {}
}

class Month {
  constructor() {
    // get all this month's data
  }

  getDay() {}

  getDate() {}

  getTotalExpenditure() {}

  getTotalIncome() {}
}

class UI {
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

const temp = new UI();
temp.printout();

// object Day

// calculate daily/monthly/yearly total expendirue/income

/* --------------- INTERFACE --------------- */
