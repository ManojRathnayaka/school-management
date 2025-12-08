import React from "react";

const AuditoriumActionButtons = ({
  showSlots,
  showAllocations,
  onToggleSlots,
  onToggleAllocations,
}) => {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onToggleSlots}
        className={`px-4 py-2 rounded-xl shadow text-sm font-semibold transition ${
          showSlots
            ? "bg-indigo-600 text-white"
            : "bg-gray-50 border border-gray-300 text-black-700 hover:bg-gray-300"
        }`}
      >
         View Available Time Slots
      </button>

      <button
        onClick={onToggleAllocations}
        className={`px-4 py-2 rounded-xl shadow text-sm font-semibold transition ${
          showAllocations
            ? "bg-indigo-600 text-white"
            : "bg-gray border border-gray-300 text-black-700 hover:bg-gray-300"
        }`}
      >
         View Allocation List
      </button>
    </div>
  );
};

export default AuditoriumActionButtons;
