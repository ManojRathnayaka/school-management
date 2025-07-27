import { useState, useCallback } from "react";

function set(obj, path, value) {
  const pathArray = Array.isArray(path) ? path : path.split(".");
  const [key, ...rest] = pathArray;
  const newObj = { ...obj };

  if (rest.length === 0) {
    newObj[key] = value;
  } else {
    newObj[key] = set(obj[key] || {}, rest, value);
  }
  return newObj;
}

export function useForm(initialState) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((currentForm) => set(currentForm, name, value));
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialState);
    setError("");
    setSuccess("");
  }, [initialState]);

  const setFormError = (message) => {
    setError(message);
    setSuccess("");
  };

  const setFormSuccess = (message) => {
    setSuccess(message);
    setError("");
  };

  return {
    form,
    error,
    success,
    setFormError,
    setFormSuccess,
    handleInputChange,
    resetForm,
  };
} 