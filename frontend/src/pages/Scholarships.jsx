                   import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  User, Users, Heart, Star, Lightbulb, AlertTriangle, Check, Edit3, 
  Eye, Send, Phone, Briefcase, DollarSign, Trophy, BookOpen, Palette,
  HandHeart, FileText, AlertCircle,CheckCircle, XCircle, X
} from "lucide-react";

export default function Scholarships() {
  const [formData, setFormData] = useState({
    admission_number: "",
    student_name: "",
    father_name: "",
    father_occupation: "",
    father_income: "",
    father_contact: "",
    mother_name: "",
    mother_occupation: "",
    mother_income: "",
    mother_contact: "",
    medical_or_Physical_Challenges: "",
    sports: "",
    social_works: "",
    reason_financial_need: false,
    reason_academic: false,
    reason_sports: false,
    reason_cultural: false,
    reason_other: ""
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
  setNotification({ type, message });
  setTimeout(() => setNotification(null), 5000);
};

  const validateField = (name, value) => {
    switch (name) {
      case "admission_number":
        if (!value.trim()) return "Admission number is required";
        if (value.trim().length < 3) return "Admission number must be at least 3 characters";
        if (!/^[A-Za-z0-9]+$/.test(value.trim())) return "Only letters and numbers allowed";
        return "";
      case "student_name":
        if (!value.trim()) return "Student name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) return "Only letters and spaces allowed";
        return "";
      case "father_name":
        if (!value.trim()) return "Father's name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        if (!/^[A-Za-z\s.'-]+$/.test(value.trim())) return "Only letters and spaces allowed";
        return "";
      case "father_contact":
        if (value && !/^[0-9]{10}$/.test(value.replace(/\s/g, ""))) return "Enter valid 10-digit number";
        return "";
      case "mother_contact":
        if (value && !/^[0-9]{10}$/.test(value.replace(/\s/g, ""))) return "Enter valid 10-digit number";
        return "";
      case "father_income":
        if (value && (isNaN(value) || Number(value) < 0)) return "Enter valid amount";
        if (value && Number(value) > 10000000) return "Enter realistic amount";
        return "";
      case "mother_income":
        if (value && (isNaN(value) || Number(value) < 0)) return "Enter valid amount";
        if (value && Number(value) > 10000000) return "Enter realistic amount";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    const hasReason = formData.reason_financial_need || formData.reason_academic || 
                      formData.reason_sports || formData.reason_cultural || formData.reason_other.trim();
    if (!hasReason) newErrors.reasons = "Please select at least one reason for applying";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
    if (name.startsWith("reason_")) setErrors((prev) => ({ ...prev, reasons: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handlePreview = (e) => {
    e.preventDefault();
    const allTouched = {};
    Object.keys(formData).forEach((key) => { allTouched[key] = true; });
    setTouched(allTouched);
    if (validateForm()) {
      setShowPreview(true);
    } else {
      const firstError = document.querySelector(".error-msg");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleEdit = () => setShowPreview(false);

  const handleConfirmSubmit = async () => {
    try {
      await axios.post("http://localhost:4000/api/scholarships", formData, { withCredentials: true });
      showNotification('success', 'Scholarship application submitted successfully!');
      setFormData({
        admission_number: "", student_name: "", father_name: "", father_occupation: "",
        father_income: "", father_contact: "", mother_name: "", mother_occupation: "",
        mother_income: "", mother_contact: "", medical_or_Physical_Challenges: "",
        sports: "", social_works: "", reason_financial_need: false, reason_academic: false,
        reason_sports: false, reason_cultural: false, reason_other: ""
      });
      setShowPreview(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        showNotification('error', err.response.data.message || "Invalid admission number. Please check and try again.");
      } else {
        showNotification('error', "Error submitting application. Please try again.");
      }
    }
  };

  const getSelectedReasons = () => {
    const reasons = [];
    if (formData.reason_financial_need) reasons.push("Financial Need");
    if (formData.reason_academic) reasons.push("Academic Excellence");
    if (formData.reason_sports) reasons.push("Sports Achievement");
    if (formData.reason_cultural) reasons.push("Cultural/Arts Achievement");
    if (formData.reason_other) reasons.push(`Other: ${formData.reason_other}`);
    return reasons;
  };

  const ErrorMsg = ({ error }) => error ? (
    <p className="error-msg text-red-500 text-sm mt-1 flex items-center gap-1">
      <AlertCircle size={14} /> {error}
    </p>
  ) : null;

  const inputClass = (field) => {
    const base = "border-2 p-3 w-full rounded-lg transition-all bg-white";
    return errors[field] && touched[field] 
      ? `${base} border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200`
      : `${base} border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200`;
  };

   const NotificationToast = () => {
    if (!notification) return null;

    return (
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg max-w-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border-l-4 border-green-500' 
            : 'bg-red-50 border-l-4 border-red-500'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          )}
          <p className={`text-sm font-medium ${
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {notification.message}
          </p>
          <button
            onClick={() => setNotification(null)}
            className={`ml-auto flex-shrink-0 ${
              notification.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  if (showPreview) {
    return (
      <Layout activePage="scholarships">
        <NotificationToast />
        <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-[#0D47A1] text-white p-8 text-center">
              <h2 className="text-4xl font-bold mb-2">Application Preview</h2>
              <p className="text-blue-100 text-lg">Please review your details before submitting</p>
              <div className="mt-4 h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
            </div>
            <div className="p-8">
              <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg flex items-center gap-2">
                <AlertTriangle className="text-yellow-600" size={20} />
                <p className="text-yellow-800 font-medium">Verify all information carefully. You cannot edit after submission.</p>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <User size={18} />
                  </span>
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Admission Number</p>
                    <p className="font-semibold text-gray-800">{formData.admission_number}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Student Name</p>
                    <p className="font-semibold text-gray-800">{formData.student_name}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <User size={18} />
                  </span>
                  Father's Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{formData.father_name}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-semibold text-gray-800">{formData.father_occupation || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Income</p>
                    <p className="font-semibold text-gray-800">{formData.father_income ? `Rs. ${formData.father_income}` : "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{formData.father_contact || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <User size={18} />
                  </span>
                  Mother's Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{formData.mother_name || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-semibold text-gray-800">{formData.mother_occupation || "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Income</p>
                    <p className="font-semibold text-gray-800">{formData.mother_income ? `Rs. ${formData.mother_income}` : "Not provided"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold text-gray-800">{formData.mother_contact || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <Heart size={18} />
                  </span>
                  Medical/Physical Challenges
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-800">{formData.medical_or_Physical_Challenges || "None specified"}</p>
                </div>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <Star size={18} />
                  </span>
                  Extra-Curricular Activities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Sports</p>
                    <p className="font-semibold text-gray-800">{formData.sports || "None specified"}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Social Works</p>
                    <p className="font-semibold text-gray-800">{formData.social_works || "None specified"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 bg-white p-6 rounded-xl shadow-md border border-blue-100">
                <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center">
                    <Lightbulb size={18} />
                  </span>
                  Reasons for Applying
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <ul className="space-y-2">
                    {getSelectedReasons().map((reason, i) => (
                      <li key={i} className="flex items-center text-gray-800 gap-2">
                        <Check className="text-green-500" size={16} />{reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <button onClick={handleEdit} className="flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105">
                  <Edit3 size={20} /> Edit Application
                </button>
                <button onClick={handleConfirmSubmit} className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105">
                  <Send size={20} /> Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activePage="scholarships">
       <NotificationToast />
      <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden">
          <div className="bg-[#0D47A1] text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-2">Scholarship Application Form</h2>
            <p className="text-blue-100 text-lg">Mahamaya Girls' College, Kandy</p>
            <div className="mt-4 h-2 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
          </div>

          <div className="p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="mb-8 p-5 bg-gradient-to-r from-yellow-50 to-blue-50 border-l-4 border-red-500 rounded-lg shadow-sm flex items-center gap-3">
              <FileText className="text-blue-700" size={24} />
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold text-blue-700">Important:</span> Please fill in all the required details accurately. 
                This information will help us evaluate your application fairly. 
              </p>
            </div>

            {Object.keys(errors).filter(k => errors[k]).length > 0 && Object.keys(touched).length > 3 && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                  <AlertTriangle size={18} /> Please fix the following errors:
                </p>
                <ul className="list-disc list-inside text-red-600 text-sm">
                  {Object.entries(errors).filter(([_, v]) => v).map(([k, v]) => <li key={k}>{v}</li>)}
                </ul>
              </div>
            )}

            <form onSubmit={handlePreview} className="space-y-6">
              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <User size={20} />
                  </span>
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Admission Number <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="admission_number" placeholder="e.g., ADM2025XXX"
                      value={formData.admission_number} onChange={handleChange} onBlur={handleBlur}
                      className={inputClass("admission_number")} />
                    <ErrorMsg error={touched.admission_number && errors.admission_number} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input type="text" name="student_name" placeholder="Enter Full Name"
                      value={formData.student_name} onChange={handleChange} onBlur={handleBlur}
                      className={inputClass("student_name")} />
                    <ErrorMsg error={touched.student_name && errors.student_name} />
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <Users size={20} />
                  </span>
                  Parent / Guardian Information
                </h3>
                <div className="mb-6 p-5 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <User size={18} /> Father's Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input type="text" name="father_name" placeholder="Father's Name"
                        value={formData.father_name} onChange={handleChange} onBlur={handleBlur}
                        className={inputClass("father_name")} />
                      <ErrorMsg error={touched.father_name && errors.father_name} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Briefcase size={14} /> Occupation
                      </label>
                      <input type="text" name="father_occupation" placeholder="Father's Occupation"
                        value={formData.father_occupation} onChange={handleChange}
                        className={inputClass("father_occupation")} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <DollarSign size={14} /> Monthly Income (Rs.)
                      </label>
                      <input type="number" name="father_income" placeholder="Monthly Income" min="0"
                        value={formData.father_income} onChange={handleChange} onBlur={handleBlur}
                        className={inputClass("father_income")} />
                      <ErrorMsg error={touched.father_income && errors.father_income} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Phone size={14} /> Contact Number
                      </label>
                      <input type="text" name="father_contact" placeholder="10-digit number" maxLength="10"
                        value={formData.father_contact} onChange={handleChange} onBlur={handleBlur}
                        className={inputClass("father_contact")} />
                      <ErrorMsg error={touched.father_contact && errors.father_contact} />
                    </div>
                  </div>

                  <div className="mt-8"></div>

                  <h4 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <User size={18} /> Mother's Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input type="text" name="mother_name" placeholder="Mother's Name"
                        value={formData.mother_name} onChange={handleChange}
                        className={inputClass("mother_name")} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Briefcase size={14} /> Occupation
                      </label>
                      <input type="text" name="mother_occupation" placeholder="Mother's Occupation"
                        value={formData.mother_occupation} onChange={handleChange}
                        className={inputClass("mother_occupation")} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <DollarSign size={14} /> Monthly Income (Rs.)
                      </label>
                      <input type="number" name="mother_income" placeholder="Monthly Income" min="0"
                        value={formData.mother_income} onChange={handleChange} onBlur={handleBlur}
                        className={inputClass("mother_income")} />
                      <ErrorMsg error={touched.mother_income && errors.mother_income} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                        <Phone size={14} /> Contact Number
                      </label>
                      <input type="text" name="mother_contact" placeholder="10-digit number" maxLength="10"
                        value={formData.mother_contact} onChange={handleChange} onBlur={handleBlur}
                        className={inputClass("mother_contact")} />
                      <ErrorMsg error={touched.mother_contact && errors.mother_contact} />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <Heart size={20} />
                  </span>
                  Medical or Physical Challenges
                </h3>
                <textarea name="medical_or_Physical_Challenges" placeholder="Describe any medical or physical challenges..."
                  value={formData.medical_or_Physical_Challenges} onChange={handleChange} rows="3"
                  className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all" />
              </section>

              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <Star size={20} />
                  </span>
                  Extra-Curricular Involvement
                </h3>
                <div className="space-y-5">
                  <div className="p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                      <Trophy size={16} /> Sports
                    </label>
                    <input type="text" name="sports" placeholder="List sports activities and achievements"
                      value={formData.sports} onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white" />
                  </div>
                  <div className="p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-700 mb-2 flex items-center gap-2">
                      <HandHeart size={16} /> Social Works
                    </label>
                    <input type="text" name="social_works" placeholder="List social work or community service"
                      value={formData.social_works} onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white" />
                  </div>
                </div>
              </section>

              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center">
                    <Lightbulb size={20} />
                  </span>
                  Reason for Applying <span className="text-red-500 ml-1">*</span>
                </h3>
                {errors.reasons && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600" />
                    <p className="text-red-600 text-sm">{errors.reasons}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <label className="flex items-center p-4 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input type="checkbox" name="reason_financial_need" checked={formData.reason_financial_need}
                      onChange={handleChange} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="ml-3 font-semibold text-gray-700 flex items-center gap-2">
                      <DollarSign size={16} className="text-blue-600" /> Financial Need
                    </span>
                  </label>
                  <label className="flex items-center p-4 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input type="checkbox" name="reason_academic" checked={formData.reason_academic}
                      onChange={handleChange} className="w-5 h-5 text-green-600 rounded" />
                    <span className="ml-3 font-semibold text-gray-700 flex items-center gap-2">
                      <BookOpen size={16} className="text-green-600" /> Academic Excellence
                    </span>
                  </label>
                  <label className="flex items-center p-4 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input type="checkbox" name="reason_sports" checked={formData.reason_sports}
                      onChange={handleChange} className="w-5 h-5 text-yellow-600 rounded" />
                    <span className="ml-3 font-semibold text-gray-700 flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-600" /> Sports Achievement
                    </span>
                  </label>
                  <label className="flex items-center p-4 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input type="checkbox" name="reason_cultural" checked={formData.reason_cultural}
                      onChange={handleChange} className="w-5 h-5 text-purple-600 rounded" />
                    <span className="ml-3 font-semibold text-gray-700 flex items-center gap-2">
                      <Palette size={16} className="text-purple-600" /> Cultural/Arts Achievement
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Other Reasons</label>
                  <textarea name="reason_other" placeholder="Specify any other reasons for applying..."
                    value={formData.reason_other} onChange={handleChange} rows="3"
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all" />
                </div>
              </section>

              <div className="flex justify-center pt-6">
                <button type="submit" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105 hover:shadow-xl">
                  <Eye size={22} /> Preview Application
                </button>
              </div>
            </form>

            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-200 flex items-center gap-3">
              <AlertTriangle size={20} className="text-red-600" />
              <p className="text-sm text-gray-600">
                <span className="font-bold text-red-700">Note:</span> Your application will be reviewed by the school administration. You will be notified of the decision via your registered contact information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}