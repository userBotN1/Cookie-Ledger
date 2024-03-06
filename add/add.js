// import flatpickr from "flatpickr";

const bookingsString = localStorage.getItem("bookings");
const bookings = JSON.parse(bookingsString);

const categoriesString = localStorage.getItem("categories");
const categories = JSON.parse(categoriesString);

/* --------------- DATA PROCESSING --------------- */
class Category {
  constructor(e) {
    this.emoji = categories[e].emoji;
    this.categoryName = e;
    this.isExpenditure = categories[e].isExpenditure;
  }
}

class Booking {
  constructor(category, time, value, isExpenditure) {
    this.category = category;
    this.time = time;
    this.value = value;
    this.isExpenditure = isExpenditure;
  }
}

/* --------------- INTERFACE --------------- */
class UI {
  constructor() {
    const categoriesArr = Object.keys(categories);
    const categoryData = [];
    for (const e of categoriesArr) {
      const temp = new Category(e);
      categoryData.push(temp);
    }

    this.categoryData = categoryData;
    this.createCategoryHTML();

    // Interaction
    this.categoryIndex = 0;
    this.category = "";
    this.value = 0;
    this.isExpenditure;
    this.operations = [];
    this.dateStr = "";

    // DOM selection
    this.doms = {
      slides: document.querySelectorAll(".slides > div"),
      categoryTitle: document.querySelector(".header__title"),
      leftBtn: document.querySelector(".header__left-btn"),
      rightBtn: document.querySelector(".header__right-btn"),
      expenditureDiv: document.querySelector(".main-container__expenditure"),
      incomeDiv: document.querySelector(".main-container__income"),
      calculatorContainer: document.querySelector(".modal-container"),
      overlay: document.querySelector(".overlay"),

      calculatorCalendarBtn: document.querySelector(
        ".modal-container__calculator_date-btn"
      ),
      datePickerDiv: document.querySelector(".date-picker"),
      datePickerCancelBtn: document.querySelector(".date-picker__cancel-btn"),
      datePickerConfirmBtn: document.querySelector(".date-picker__confirm-btn"),
      datePickerInputField: document.querySelector(".date-picker__input"),
      overlayDatePicker: document.querySelector(".overlay__date-picker"),
    };
  }

  /**
   * Generate HTML content
   */
  createCategoryHTML() {
    // Seperate expenditure and income into two arrays
    const expenditureArr = [];
    const incomeArr = [];
    this.categoryData.forEach((category) => {
      if (category.isExpenditure == true) {
        expenditureArr.push(category);
      } else {
        incomeArr.push(category);
      }
    });

    // Generate HTML content for categories in expenditure
    let expenditureTemplate = `<div class="main-container__expenditure">`;
    expenditureArr.forEach((category) => {
      const oneCategory = `
        <div class="category-container">
            <button class="category-container__btn">
                <span class="category-container__btn-emoji">${category.emoji}</span>
            </button>
            <span class="category-container__desc">${category.categoryName}</span>
        </div>`;
      expenditureTemplate += oneCategory;
    });
    expenditureTemplate += `</div>`;

    // Generate HTML content for categories in income
    let incomeTemplate = `<div class="main-container__income">`;
    incomeArr.forEach((category) => {
      const oneCategory = `
        <div class="category-container">
            <button class="category-container__btn">
                <span class="category-container__btn-emoji">${category.emoji}</span>
            </button>
            <span class="category-container__desc">${category.categoryName}</span>
        </div>`;
      incomeTemplate += oneCategory;
    });
    incomeTemplate += `</div>`;

    // Coalesce
    document.querySelector(".slides").innerHTML =
      expenditureTemplate + incomeTemplate;
  }

  /* --------------- Sliding Between Expenditure/Income Divs --------------- */
  initializeCategory() {
    this.doms.slides[this.categoryIndex].classList.add("displayCategory");
  }

  showCategory(categoryDesc) {
    if (
      0 <= this.categoryIndex &&
      this.categoryIndex < this.doms.slides.length
    ) {
      this.doms.slides.forEach((slide) => {
        slide.classList.remove("displayCategory");
      });

      this.doms.slides[this.categoryIndex].classList.add("displayCategory");
      this.doms.categoryTitle.textContent = categoryDesc;
    }
  }

  prevCategory() {
    this.categoryIndex = 0;
    this.showCategory("Expenditure");
  }

  nextCategory() {
    this.categoryIndex = 1;
    this.showCategory("Income");
  }

  /* --------------- Add a new booking --------------- */

  /**
   * This function servers as an entry point where user can initialize the process of adding a bookkeeping
   * The function updates variable "this.category"
   */
  initializeRecord(event, isExpenditure) {
    this.isExpenditure = isExpenditure;
    let clickArea = event.target.tagName;
    if (clickArea === "SPAN" || clickArea === "BUTTON") {
      clickArea = event.target.closest(".category-container__btn");
      this.category = clickArea.nextElementSibling.textContent;

      ui.doms.calculatorContainer.classList.remove("hidden");
      ui.doms.overlay.classList.remove("hidden");
    }
  }

  /**
   * Converts an array of characters into corresponding numerical value
   * @param {array} arr - An array of characters storing a single number
   * @returns {number} The numerical value
   *
   * @example
   * // Returns: 3
   * arr = ["3"];
   *
   * @example
   * // Returns: 0.2
   * arr = [".", "2"];
   *
   * * @example
   * // Returns: 0
   * arr = ['.']
   *
   * * @example
   * // Returns: 321.155
   * arr = ["3", "2", "1", ".", "1", "5", "5"];
   *
   * * @example
   * // Returns: 321155
   * arr = ["3", "2", "1", "1", "5", "5"];
   *
   */
  computeNumbers(arr) {
    // 0. Edge case
    if (arr.length === 1 && arr[0] === ".") {
      return 0;
    }

    // 1. Get the integer part of the number and count how many digits there is
    let counter = 0;
    let intPart = 0;

    while (counter < arr.length && arr[counter] !== ".") {
      counter++;
    }

    const intPartArr = arr.slice(0, counter);
    const decimalPartArr = arr.slice(counter + 1, arr.length);
    counter -= 1;

    for (let i = 0; i < intPartArr.length; i++) {
      intPart += intPartArr[i] * 10 ** counter;
      counter--;
    }

    // 2. Check if the number contains decimal parts. If not, early return
    if (arr.length - intPartArr.length === 0) {
      return intPart;
    }

    // 3. Get the decimal part of the number and count how many decimal places there is
    let counterDecimal = arr.length - intPartArr.length - 1;
    let power = decimalPartArr.length - 1;
    let decimalPart = 0;

    for (let i = 0; i < decimalPartArr.length; i++) {
      decimalPart += decimalPartArr[i] * 10 ** power;
      power--;
    }
    decimalPart = decimalPart * (1 * 10 ** -counterDecimal);

    // 4. Return final value
    return intPart + decimalPart;
  }

  /**
   * Calculates the numerical value for a bookkeeping based on user inputs on the calculator
   * @param {array} operations - An gloabl variable array stroing user inputs on the calculator
   * @returns {number} The numerical value for a bookkeeping
   *
   * @example
   * // Returns: 3.2
   * operations = ["+", "3", "+", "+", ".", "2", "+", ".", ".", ".", "."];
   *
   * @example
   * // Returns: 5.77
   * operations = ["6", "+", "-", "1", ".", "2", "3", "+", "1"];
   *
   * * @example
   * // Returns: 8.8
   * operations = ["6", "+", "3", "-", "1", ".", "2", "+", "1"];
   *
   * * @example
   * // Returns: 6.8
   * operations = ["6", "+", "3", "-", "1", ".", "2", "-", "1"];
   *
   * * @example
   * // Returns: 0
   * operations = ["-", ".", "+", "+", "+", ".", "-"];
   *
   * * * @example
   * // Returns: 2.8
   * operations = ["-", ".", "0", "2", "+", "3"];
   */
  processDetailsAddAmount() {
    // 1. Clean up incoming array
    let operationsClean = [];
    let i = 0;

    if (this.operations[0] === "+" || this.operations[0] === "-") {
      this.operations.unshift("0");
    }

    while (i < this.operations.length) {
      if (this.operations[i] === "+" || this.operations[i] === "-") {
        let k = i + 1;
        while (
          k < this.operations.length &&
          (this.operations[k] === "+" || this.operations[k] === "-")
        ) {
          k++;
        }
        operationsClean.push(this.operations[k - 1]);
        i = k - 1;
      } else if (this.operations[i] === ".") {
        let k = i + 1;
        while (k < this.operations.length && this.operations[k] === ".") {
          k++;
        }
        operationsClean.push(this.operations[k - 1]);
        i = k - 1;
      } else {
        operationsClean.push(this.operations[i]);
      }
      i++;
    }

    if (
      operationsClean[operationsClean.length - 1] === "+" ||
      operationsClean[operationsClean.length - 1] === "-"
    ) {
      operationsClean = operationsClean.slice(0, -1);
    }

    // 2. Check if operationsClean contains valid operations
    // [.], [] are not valid
    // ['.', '+', '.'] is valid (check numerical value after calculation)
    if (
      operationsClean === null ||
      operationsClean.length === 0 ||
      (operationsClean.length === 1 && operationsClean[0] === ".")
    ) {
      return -1; // return negative value
    }

    // 3. Process Numbers
    let m = 0;
    let numStack = [];
    while (m < operationsClean.length) {
      if (operationsClean[m] === "+" || operationsClean[m] === "-") {
        m++;
      } else {
        const numArr = [];
        let n = m;
        while (
          n < operationsClean.length &&
          operationsClean[n] !== "+" &&
          operationsClean[n] !== "-"
        ) {
          numArr.push(operationsClean[n]);
          n++;
        }
        m = n;
        const num = this.computeNumbers(numArr);
        numStack.push(num);
      }
    }

    // 4. Math operation
    let operatorStack = [];
    for (let i = 0; i < operationsClean.length; i++) {
      if (operationsClean[i] === "+" || operationsClean[i] === "-") {
        operatorStack.push(operationsClean[i]);
      }
    }

    operatorStack = operatorStack.reverse();
    numStack = numStack.reverse();

    while (numStack.length !== 0 && operatorStack.length !== 0) {
      const a = numStack.pop();
      const b = numStack.pop();
      const operator = operatorStack.pop();
      let tempRes = 0;
      if (operator === "+") {
        tempRes = a + b;
      } else if (operator === "-") {
        tempRes = a - b;
      }
      numStack.push(tempRes);
    }

    // 5. Clean up operations for future use
    this.operations.length = 0;
    const finalRes = numStack.pop();
    return finalRes;
  }

  /**
   *
   * @param {*} event
   * This function listens to user events on the calculator.
   * The function tracks user input and calls helper function to calculate the momentary amount for a bookkeeping
   * The function updates this.operations[]
   * The function updates variable "this.category"
   */
  processDetails(event) {
    let clickArea = event.target.tagName;
    if (clickArea === "BUTTON") {
      clickArea = event.target.closest("button");
      const operation = clickArea.textContent;

      if (operation === "ADD") {
        const value = this.processDetailsAddAmount(); // final amount cannot be <= 0
        console.log(value);
        if (value <= 0) {
          alert("Amount cannot be less than or equal to 0");
        } else if (isNaN(value)) {
          alert("Invalid value");
        } else {
          this.value = value;
          this.addNewBooking();
          this.closeCalculator();
        }
      } else if (!isNaN(operation) || operation === "+" || operation === "-") {
        this.operations.push(operation);
      }
    }
  }

  closeCalculator() {
    this.doms.calculatorContainer.classList.add("hidden");
    this.doms.overlay.classList.add("hidden");
  }

  addNewBooking() {
    console.log("dateStr", this.dateStr);
    let time;
    if (this.dateStr === "") {
      time = new Date();
    } else {
      time = new Date(this.dateStr);
    }

    const year = time.getFullYear().toString();
    const month = (time.getMonth() + 1).toString().padStart(2, "0");
    const day = time.getDate().toString().padStart(2, "0");
    const hour = time.getHours().toString().padStart(2, "0");
    const minute = time.getMinutes().toString().padStart(2, "0");
    const second = time.getSeconds().toString().padStart(2, "0");
    const millisecond = time.getMilliseconds().toString().padStart(3, "0");
    const formatTime = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;

    console.log(formatTime);

    const newBooking = new Booking(
      this.category,
      formatTime,
      this.value,
      this.isExpenditure
    );

    bookings.push(newBooking);

    const updatedBookingsString = JSON.stringify(bookings);
    localStorage.setItem("bookings", updatedBookingsString);
  }

  /* --------------- Date Picker --------------- */

  initializeDatePicker() {
    this.doms.datePickerDiv.classList.remove("hidden");
    this.doms.overlayDatePicker.classList.remove("hidden");

    flatpickr(this.doms.datePickerInputField, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      onClose: (selectedDates, dateStr, instance) => {
        this.dateStr = dateStr;

        console.log(this.dateStr);
      },
    });
  }

  cancelDatePicker() {
    this.doms.datePickerDiv.classList.add("hidden");
    this.doms.overlayDatePicker.classList.add("hidden");
  }

  confirmDatePicker() {
    this.doms.datePickerDiv.classList.add("hidden");
    this.doms.overlayDatePicker.classList.add("hidden");
  }
}
const ui = new UI();

/* --------------- INTERACTION --------------- */

/* --------------- Sliding Between Expenditure/Income Divs --------------- */
document.addEventListener("DOMContentLoaded", ui.initializeCategory.bind(ui));
ui.doms.leftBtn.addEventListener("click", ui.prevCategory.bind(ui));
ui.doms.rightBtn.addEventListener("click", ui.nextCategory.bind(ui));

/* --------------- Selecting a Category & Open Calculator --------------- */
ui.doms.expenditureDiv.addEventListener("click", (event) =>
  ui.initializeRecord(event, true)
);
ui.doms.incomeDiv.addEventListener("click", (event) =>
  ui.initializeRecord(event, false)
);
ui.doms.calculatorContainer.addEventListener(
  "click",
  ui.processDetails.bind(ui)
);
ui.doms.overlay.addEventListener("click", ui.closeCalculator.bind(ui));

/* --------------- Date Picker --------------- */

ui.doms.calculatorCalendarBtn.addEventListener(
  "click",
  ui.initializeDatePicker.bind(ui)
);

ui.doms.datePickerCancelBtn.addEventListener(
  "click",
  ui.cancelDatePicker.bind(ui)
);

ui.doms.datePickerConfirmBtn.addEventListener(
  "click",
  ui.confirmDatePicker.bind(ui)
);

