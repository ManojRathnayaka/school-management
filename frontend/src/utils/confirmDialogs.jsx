import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

// Normal confirmation dialog
export function showConfirm(message) {
  return new Promise((resolve) => {
    confirmAlert({
      title: "Confirmation",
      message,
      buttons: [
        {
          label: "OK",
          onClick: () => resolve(true),
        },
        {
          label: "Cancel",
          onClick: () => resolve(false),
        },
      ],
    });
  });
}

// Prompt dialog (text input)
export function showPrompt(message) {
  return new Promise((resolve) => {
    let inputValue = "";

    confirmAlert({
      title: "Input Request",
      message,
      closeOnEscape: true,
      closeOnClickOutside: false,
      customUI: ({ onClose }) => (
        <div className="bg-white rounded-lg shadow p-6 w-[320px]">
          <h1 className="text-lg font-semibold mb-3">{message}</h1>

          <input
            type="text"
            className="border rounded-md p-2 w-full mb-4"
            placeholder="Enter reason (optional)"
            onChange={(e) => (inputValue = e.target.value)}
          />

          <div className="flex justify-end gap-3">
            <button
              className="px-3 py-1 rounded bg-gray-200"
              onClick={() => {
                resolve(null);
                onClose();
              }}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 rounded bg-indigo-600 text-white"
              onClick={() => {
                resolve(inputValue);
                onClose();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ),
    });
  });
}
