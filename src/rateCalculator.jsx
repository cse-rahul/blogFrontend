import React, { useState, useEffect } from "react";
import './index.css';

// --- Data tables ---
const rates = {
  AR: { currency: "USD", utility: 0.0289, marketing: 0.0618 },
  BR: { currency: "USD", utility: 0.0068, marketing: 0.0625 },
  CL: { currency: "USD", utility: 0.0200, marketing: 0.0889 },
  CO: { currency: "USD", utility: 0.0002, marketing: 0.0125 },
  EG: { currency: "USD", utility: 0.0052, marketing: 0.1073 },
  FR: { currency: "USD", utility: 0.0300, marketing: 0.1432 },
  DE: { currency: "USD", utility: 0.0550, marketing: 0.1365 },
  IN: { currency: "USD", utility: 0.0014, marketing: 0.0107 },
  ID: { currency: "USD", utility: 0.0250, marketing: 0.0411 },
  IL: { currency: "USD", utility: 0.0053, marketing: 0.0353 },
  IT: { currency: "USD", utility: 0.0300, marketing: 0.0691 },
  MY: { currency: "USD", utility: 0.0140, marketing: 0.0860 },
  MX: { currency: "USD", utility: 0.0085, marketing: 0.0436 },
  NL: { currency: "USD", utility: 0.0500, marketing: 0.1597 },
  NG: { currency: "USD", utility: 0.0067, marketing: 0.0516 },
  PK: { currency: "USD", utility: 0.0054, marketing: 0.0473 },
  PE: { currency: "USD", utility: 0.0200, marketing: 0.0703 },
  RU: { currency: "USD", utility: 0.0400, marketing: 0.0802 },
  US: { currency: "USD", utility: 0.0079, marketing: 0.05 },
  UK: { currency: "GBP", utility: 0.042, marketing: 0.072 },
  AU: { currency: "USD", utility: 0.0185, marketing: 0.03 }
};

const exchangeRates = {
  USD: 1,
  GBP: 0.78,
  INR: 83,
  EUR: 0.93
};

const countryNames = {
  AR: "Argentina", BR: "Brazil", CL: "Chile", CO: "Colombia", EG: "Egypt",
  FR: "France", DE: "Germany", IN: "India", ID: "Indonesia", IL: "Israel",
  IT: "Italy", MY: "Malaysia", MX: "Mexico", NL: "Netherlands", NG: "Nigeria",
  PK: "Pakistan", PE: "Peru", RU: "Russia", US: "USA", UK: "UK", AU: "Australia"
};

const currencyOptions = Object.keys(exchangeRates);
const countryOptions = Object.keys(rates);

function calculateMessages(creditAmount, creditCurrency, destCountry, messageType) {
  if (!creditAmount || isNaN(creditAmount)) return null;
  creditCurrency = creditCurrency.toUpperCase();
  destCountry = destCountry.toUpperCase();
  messageType = messageType.toLowerCase();

  let creditInUSD = parseFloat(creditAmount) / exchangeRates[creditCurrency];
  let destCurrency = rates[destCountry].currency;
  let creditInDest = creditInUSD * exchangeRates[destCurrency];
  let msgCost = rates[destCountry][messageType];
  if (!msgCost) return null;
  let count = Math.floor(creditInDest / msgCost);
  return count;
}

export default function SmsCalculator() {
  const [creditAmount, setCreditAmount] = useState("");
  const [creditCurrency, setCreditCurrency] = useState("USD");
  const [destCountry, setDestCountry] = useState("IN");
  const [messageType, setMessageType] = useState("marketing");
  const [result, setResult] = useState(null);

  // Live calculation as form updates
  useEffect(() => {
    const count = calculateMessages(creditAmount, creditCurrency, destCountry, messageType);
    setResult(count !== null ? count : null);
  }, [creditAmount, creditCurrency, destCountry, messageType]);

  return (
    <div className="max-w-md mx-auto mt-14 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center tracking-tight">
        SMS Credits Calculator
      </h2>
      <form className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Credit Amount
          </label>
          <input
            type="number"
            step="any"
            min="0"
            className="w-full p-2 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-300 outline-none"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
            placeholder="Enter the amount you purchased"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Credit Currency</label>
          <select
            className="w-full p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
            value={creditCurrency}
            onChange={e => setCreditCurrency(e.target.value)}
          >
            {currencyOptions.map(cur => (
              <option value={cur} key={cur}>{cur}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Destination Country</label>
          <select
            className="w-full p-2 rounded-md border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
            value={destCountry}
            onChange={e => setDestCountry(e.target.value)}
          >
            {countryOptions.map(cty => (
              <option value={cty} key={cty}>{countryNames[cty] ? `${countryNames[cty]} (${cty})` : cty}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Message Type</label>
          <div className="flex space-x-4">
            <button
              type="button"
              className={
                "flex-1 py-2 rounded-md border " +
                (messageType === "utility"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50")
              }
              onClick={() => setMessageType("utility")}
            >
              Utility
            </button>
            <button
              type="button"
              className={
                "flex-1 py-2 rounded-md border " +
                (messageType === "marketing"
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-indigo-50")
              }
              onClick={() => setMessageType("marketing")}
            >
              Marketing
            </button>
          </div>
        </div>
      </form>
      <div className="mt-10">
        {creditAmount && !isNaN(creditAmount) ? (
          <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-lg px-6 py-6 text-white shadow-lg text-center text-xl font-semibold transition duration-300">
            {result !== null ? (
              <>
                <span className="text-white text-4xl font-extrabold">{result.toLocaleString()}</span><br />
                <span> {messageType} SMS<br />to <span className="underline decoration-dotted">{countryNames[destCountry] || destCountry}</span> ({destCountry})</span>
              </>
            ) : (
              <span>Unable to compute. Check inputs.</span>
            )}
          </div>
        ) : (
          <div className="text-gray-400 text-center pt-6">
            Enter your details above to see results.
          </div>
        )}
      </div>
      <div className="mt-8 text-xs text-gray-400 text-center">
        Data sourced from international SMS market rates.<br />
        Exchange rates as per latest conversion.
      </div>
    </div>
  );
}
