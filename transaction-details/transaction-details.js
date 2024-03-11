/* --------------- LOCAL STORAGE --------------- */
const monthIndexString = localStorage.getItem("monthIndex");
const monthIndex = JSON.parse(monthIndexString);

const fullMonthIndexString = localStorage.getItem("fullMonthIndex");
const fullMonthIndex = JSON.parse(fullMonthIndexString);

const dayIndexString = localStorage.getItem("dayIndex");
const dayIndex = JSON.parse(dayIndexString);

/* --------------- DATA PROCESSING --------------- */
class Booking {
  constructor(emoji, category, time, value, isExpenditure, customNote) {
    this.emoji = emoji;
    this.category = category;
    this.time = time;
    this.value = value;
    this.isExpenditure = isExpenditure;
    this.customNote = customNote;
  }
}

class UI {
  constructor() {
    // Retrieve booking from URL
    const bookingString = window.location.search;
    const params = new URLSearchParams(bookingString);
    const encodedObject = params.get("data");
    const decodedObject = JSON.parse(decodeURIComponent(encodedObject));

    // Initialize a new booking object
    this.booking = new Booking(
      decodedObject.emoji,
      decodedObject.category,
      decodedObject.time,
      decodedObject.value,
      decodedObject.isExpenditure,
      decodedObject.customNote
    );

    this.doms = {
      emojiDesc: document.querySelector(".category-container__emoji"),
      categoryDesc: document.querySelector(".category-container__desc"),
      valueDesc: document.querySelector(".amount-container__value"),
      dateDesc: document.querySelector(".date-container__date_desc"),
      customNoteDesc: document.querySelector(".note-container__content"),
      noteContainer: document.querySelector(".note-container"),
    };

    this.generateCategoryContent();
    this.generateValueContent();
    this.generateDateContent();
    this.generateNoteContent();
  }

  generateCategoryContent() {
    let categoryFormat = this.booking.category;
    categoryFormat =
      categoryFormat.charAt(0).toUpperCase() + categoryFormat.slice(1);

    this.doms.categoryDesc.textContent = categoryFormat;
    this.doms.emojiDesc.textContent = this.booking.emoji;
  }

  generateValueContent() {
    let valueFormat = this.booking.value.toString();
    if (this.booking.isExpenditure) {
      valueFormat = `-$${valueFormat}`;
    } else {
      valueFormat = `$${valueFormat}`;
    }

    this.doms.valueDesc.textContent = valueFormat;
  }

  generateDateContent() {
    const timeObject = new Date(this.booking.time);
    const day = dayIndex[timeObject.getDay()];
    const month = fullMonthIndex[timeObject.getMonth() + 1];
    const date = timeObject.getDate();
    const year = timeObject.getFullYear();
    const hours = timeObject.getHours().toString().padStart(2, "0");
    const minutes = timeObject.getMinutes().toString().padStart(2, "0");

    const timeFormat = `${day}, ${month} ${date}, ${year} ${hours}:${minutes}`;
    this.doms.dateDesc.textContent = timeFormat;
  }

  generateNoteContent() {
    const note = this.booking.customNote;
    if (note != null && note.length !== 0) {
      this.doms.noteContainer.classList.remove("hidden");
      this.doms.customNoteDesc.textContent = note;
    }
  }
}

const ui = new UI();
