const API_KEY = "d2a911fd6de9a00263355685e2ee3965"; // Your API key
const BASE_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to fetch exchange rate and update UI
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();

    if (!data.rates) {
      msg.innerText = "Error fetching exchange rate!";
      return;
    }

    let fromRate = data.rates[fromCurr.value];
    let toRate = data.rates[toCurr.value];

    if (!fromRate || !toRate) {
      msg.innerText = "Currency not supported!";
      return;
    }

    // Convert via EUR (since free plan defaults to EUR)
    let amountInEUR = amtVal / fromRate;
    let finalAmount = (amountInEUR * toRate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate.";
    console.error("API Error:", error);
  }
};

// Function to update country flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Event listener for button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Fetch initial exchange rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});
