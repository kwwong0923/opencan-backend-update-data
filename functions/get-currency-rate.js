const { Currency } = require("../models");
const CustomError = require("../errors");
const axios = require("axios");

const getCurrencyRate = async () => {
  const response = await axios.get(
    `${process.env.CURRENCY_RATE_URL}${process.env.CURRENCY_RATE_API_KEY}`
  );

  if (!response.status === 200) {
    throw new CustomError.BadRequestError(`Cannot get the currency rates`);
  }

  let cadRate = response.data.rates["CAD"];
  let base = "CAD";
  let rates = response.data.rates;

  // CAD to USA
  await Currency.removeACurrency("USD");
  const cadToUsd = await Currency.create({
    currency: "USD",
    base: "CAD",
    rate: 1/ cadRate
  });
  
  // CAD to other
  for (const key in rates) {
    await Currency.removeACurrency(key);
    if (key === "CAD") continue;
    const currency = await Currency.create({
      currency: key,
      base,
      rate: rates[key] / cadRate,
    });
    
  }
  console.log("Updated Currency Rates");
};

module.exports = getCurrencyRate;
