/* --------------- DATA PROCESSING --------------- */
class Category {
  constructor(e) {
    this.emoji = categories[e].emoji;
    this.categoryName = e;
    this.isExpenditure = categories[e].isExpenditure;
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

    this.doms = {
      slides: document.querySelectorAll(".slides > div"),
      categoryTitle: document.querySelector(".header__title"),
      leftBtn: document.querySelector(".header__left-btn"),
      rightBtn: document.querySelector(".header__right-btn"),
      expenditureDiv: document.querySelector(".main-container__expenditure"),
      incomeDiv: document.querySelector(".main-container__income"),
      calculatorContainer: document.querySelector(".modal-container"),
      overlay: document.querySelector(".overlay"),
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
}
const ui = new UI();

/* --------------- INTERACTION --------------- */

/**
 * Implement sliding between expenditure and income divs
 */
let categoryIndex = 0;
function initializeCategory() {
  ui.doms.slides[categoryIndex].classList.add("displayCategory");
}

function showCategory(categoryDesc) {
  if (0 <= categoryIndex && categoryIndex < ui.doms.slides.length) {
    ui.doms.slides.forEach((slide) => {
      slide.classList.remove("displayCategory");
    });

    ui.doms.slides[categoryIndex].classList.add("displayCategory");
    ui.doms.categoryTitle.textContent = categoryDesc;
  }
}

function prevCategory() {
  categoryIndex = 0;
  showCategory("Expenditure");
}

function nextCategory() {
  categoryIndex = 1;
  showCategory("Income");
}

ui.doms.leftBtn.addEventListener("click", prevCategory);
ui.doms.rightBtn.addEventListener("click", nextCategory);
document.addEventListener("DOMContentLoaded", initializeCategory);

/**
 * Selecting a category and open up the calculator
 */

function closeCalculator() {
  ui.doms.calculatorContainer.classList.add("hidden");
  ui.doms.overlay.classList.add("hidden");
}
function processRecord(category) {
  console.log(category);
  ui.doms.calculatorContainer.classList.remove("hidden");
  ui.doms.overlay.classList.remove("hidden");
  console.log(ui.doms.calculatorContainer);
}

function initializeRecord(event) {
  let clickArea = event.target.tagName;
  if (clickArea === "SPAN" || clickArea === "BUTTON") {
    clickArea = event.target.closest(".category-container__btn");
    const category = clickArea.nextElementSibling.textContent;
    processRecord(category);
  }
}

ui.doms.expenditureDiv.addEventListener("click", initializeRecord);
ui.doms.incomeDiv.addEventListener("click", initializeRecord);
ui.doms.overlay.addEventListener("click", closeCalculator);

