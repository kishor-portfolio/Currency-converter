const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

document.addEventListener("DOMContentLoaded", () => { // ✅ Fixed incorrect event listener
    updateExchangeRate();
});

for (let select of dropdowns) { 
    for (let code in countryList) {
        let newoption = document.createElement("option");
        newoption.innerText = code;
        newoption.value = code;

        if (select.name === "from" && code === "USD") {
            newoption.selected = "selected";
        } else if (select.name === "to" && code === "INR") {
            newoption.selected = "selected";
        }

        select.append(newoption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currcode = element.value;
    let countryCode = countryList[currcode];

    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    if (img) {
        img.src = newSrc;
    }
};

btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate(); // ✅ Now calls updateExchangeRate()
});

const updateExchangeRate = async () => {
    let amount = document.querySelector(".amount input");
    let amtval = amount.value;

    if (amtval === "" || amtval < 1) {
        amtval = 1;
        amount.value = "1";
    }

    let fromCurrency = fromCurr.value.toLowerCase(); 
    let toCurrency = toCurr.value.toLowerCase();

    const URL = `${BASE_URL}/${fromCurrency}.json`; // ✅ Fixed API URL formatting

    try {
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data[fromCurrency][toCurrency]; // ✅ Fixed undefined rate issue

        if (!rate) {
            console.error("Exchange rate not found.");
            return;
        }

        let finalAmount = amtval * rate;
        if (msg) msg.innerText = ` ${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
    }
};
