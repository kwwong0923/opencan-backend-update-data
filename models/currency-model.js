const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema(
  {
    currency: {
      type: String,
    },
    base: {
      type: String,
    },
    rate: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

CurrencySchema.statics.removeAllCurrency = async function () {
  await this.deleteMany({});
  console.log("All Currency Rates Removed");
};

CurrencySchema.statics.removeACurrency = async function(currency) {
  await this.deleteMany({currency});
}

module.exports = mongoose.model("Currency", CurrencySchema);
