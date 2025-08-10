import { useState } from "react";
import { useForm } from "../hooks/useForm";
import { USER_ROLES, GRADES } from "../constants";
import { userAPI } from "../services/api";
import Alert from "./Alert";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";

const initialForm = {
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  grade: "",
  contact_number: "",
};

export default function CreateUserForm() {
  const [tempPassword, setTempPassword] = useState("");
  const {
    form,
    error,
    success,
    setFormError,
    setFormSuccess,
    handleInputChange,
    resetForm,
  } = useForm(initialForm)

  const handleRoleChange = (e) => {
    handleInputChange(e);
    if (e.target.value !== USER_ROLES.TEACHER) {
      handleInputChange({ target: { name: "grade", value: "" } });
      handleInputChange({ target: { name: "contact_number", value: "" } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setTempPassword("");

    const submitData = { ...form };
    if (form.role !== USER_ROLES.TEACHER) {
      delete submitData.grade;
      delete submitData.contact_number;
    }

    try {
      const response = await userAPI.createUser(submitData);
      setFormSuccess("User created successfully!");
      setTempPassword(response.data.tempPassword || "");
      resetForm();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "User creation failed.";
      setFormError(errorMessage);
    }
  };

  const isTeacher = form.role === USER_ROLES.TEACHER;
  const roleOptions = [
    { value: USER_ROLES.TEACHER, label: "Teacher" },
    { value: USER_ROLES.PRINCIPAL, label: "Principal" },
    { value: USER_ROLES.ADMIN, label: "Admin" },
  ];

  return (
    <div>
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            name="first_name" 
            placeholder="First Name" 
            value={form.first_name} 
            onChange={handleInputChange} 
            required 
          />
          <Input 
            name="last_name" 
            placeholder="Last Name" 
            value={form.last_name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <Input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={form.email} 
          onChange={handleInputChange} 
          required 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-6">
            {roleOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value={option.value}
                  checked={form.role === option.value}
                  onChange={handleRoleChange}
                  required
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="min-h-[100px]">
          {isTeacher && (
            <>
              <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">
                Teacher Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select 
                  name="grade" 
                  value={form.grade} 
                  onChange={handleInputChange} 
                  options={[{ value: "", label: "Select Grade" }, ...GRADES]} 
                  required
                />
                <Input 
                  type="tel" 
                  name="contact_number" 
                  placeholder="Contact Number" 
                  value={form.contact_number} 
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
        </div>

        <Button type="submit">Create User</Button>
      </form>

      {tempPassword && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800 font-semibold mb-2">
            User Created Successfully!
          </p>
          <p className="text-green-700">
            Temporary Password:{" "}
            <span className="font-mono bg-green-100 px-2 py-1 rounded">
              {tempPassword}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}