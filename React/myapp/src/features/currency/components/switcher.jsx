import { useState } from "react";
import { Banknote, X, ChevronDown, Search } from "lucide-react";

const currencies = [
  {
    code: "PKR",
    name: "Pakistani Rupee",
    flag: "https://flagcdn.com/w40/pk.png",
  },
  {
    code: "USD",
    name: "US Dollar",
    flag: "https://flagcdn.com/w40/us.png",
  },
  {
    code: "EUR",
    name: "Euro",
    flag: "https://flagcdn.com/w40/eu.png",
  }
];

export default function Switcher() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(currencies[0]);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(search.toLowerCase()) ||
      currency.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        className="px-2 py-2 bg-white rounded-full cursor-pointer shadow-sm"
      >
        <Banknote width={23} height={23} className="text-gray-700" />
      </div>

      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-40"
          ></div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-14 z-50 bg-white p-5 rounded-xl w-80 shadow-xl border border-gray-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Currency</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border border-gray-300 hover:border-gray-500 px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer bg-white"
              >
                <div className="flex items-center">
                  <img
                    src={selected.flag}
                    alt={selected.code}
                    className="w-7 h-5 object-cover mr-3 rounded shadow-sm"
                  />
                  <span className="font-semibold text-gray-700">
                    {selected.code} - {selected.name}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </div>

              {isDropdownOpen && (
                <div className="mt-2 border border-gray-200 rounded-lg shadow-lg bg-white overflow-hidden">

                  <div className="relative border-b border-gray-100">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search currency..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 outline-none"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {filteredCurrencies.length > 0 ? (
                      filteredCurrencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => {
                            setSelected(currency);
                            setIsDropdownOpen(false);
                            setSearch("");
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-blue-50 text-left transition"
                        >
                          <img
                            src={currency.flag}
                            alt={currency.code}
                            className="w-7 h-5 object-cover mr-3 rounded shadow-sm"
                          />
                          <span className="font-semibold text-gray-700">
                            {currency.code} - {currency.name}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No currency found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}