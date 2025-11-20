import { useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
   
  //handleSubmit - Submitting Application
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/scholarships", formData, { withCredentials: true });
      alert("Scholarship application submitted successfully!");
      // Reset form
      setFormData({
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
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };

  return (
    <Layout activePage="scholarships">
      <div className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-white  rounded-2xl overflow-hidden ">
          {/* Header Section with School Colors */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-700 text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-2">Scholarship Application Form</h2>
            <p className="text-blue-100 text-lg">Mahamaya Girls' College, Kandy</p>
            <div className="mt-4 h-2 bg-gradient-to-r from-yellow-500 via-yellow-500 to-yellow-600 rounded-full"></div>
          </div>

          <div className="p-8 bg-gradient-to-br from-white to-blue-50">
            <div className="mb-8 p-5 bg-gradient-to-r from-yellow-50 to-blue-50 border-l-4 border-red-500 rounded-lg shadow-sm">
              <p className="text-gray-700 leading-relaxed">
                <span className="font-bold text-blue-700">📝 Important:</span> Please fill in all the required details accurately. 
                This information will help us evaluate your application fairly and determine your eligibility for financial assistance.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Information */}
              <section className="bg-white p-6 rounded-xl shadow-md ">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                  <span className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">👧</span>
                  Student Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student Admission Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="admission_number"
                      placeholder="Enter Admission Number (e.g., ADM2025001)"
                      value={formData.student_id}
                      onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="student_name"
                      placeholder="Enter Full Name"
                      value={formData.student_name}
                      onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Parent Information */}
              <section className="bg-white p-6 rounded-xl shadow-md ">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                  <span className="bg-yellow-100 text-yellow-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">👨‍👩‍👧</span>
                  Parent / Guardian Information
                </h3>

                {/* Father's Information */}
                <div className="mb-6 p-5 bg-white-50 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-bold text-blue-700 mb-4">Father's Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="father_name"
                        placeholder="Father's Name"
                        value={formData.father_name}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                      <input
                        type="text"
                        name="father_occupation"
                        placeholder="Father's Occupation"
                        value={formData.father_occupation}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income (Rs.)</label>
                      <input
                        type="number"
                        name="father_income"
                        placeholder="Monthly Income"
                        value={formData.father_income}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="text"
                        name="father_contact"
                        placeholder="Contact Number"
                        value={formData.father_contact}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                  </div>
                
                <div className="mt-10"></div>

                {/* Mother's Information */}
                
                  <h4 className="text-lg font-bold text-blue-700 mb-4">Mother's Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="mother_name"
                        placeholder="Mother's Name"
                        value={formData.mother_name}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Occupation</label>
                      <input
                        type="text"
                        name="mother_occupation"
                        placeholder="Mother's Occupation"
                        value={formData.mother_occupation}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Income (Rs.)</label>
                      <input
                        type="number"
                        name="mother_income"
                        placeholder="Monthly Income"
                        value={formData.mother_income}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                      <input
                        type="text"
                        name="mother_contact"
                        placeholder="Contact Number"
                        value={formData.mother_contact}
                        onChange={handleChange}
                        className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Medical Challenges */}
              <section className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                  <span className="bg-red-100 text-red-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">🏥</span>
                  Medical or Physical Challenges
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Please describe any medical or physical challenges (if applicable)
                  </label>
                  <textarea
                    name="medical_or_Physical_Challenges"
                    placeholder="Describe any medical or physical challenges..."
                    value={formData.medical_or_Physical_Challenges}
                    onChange={handleChange}
                    rows="3"
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all"
                  />
                </div>
              </section>

              {/* Extra-Curricular Activities */}
              <section className="bg-white p-6 rounded-xl shadow-md ">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                  <span className="bg-green-100 text-green-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">⭐</span>
                  Extra-Curricular Involvement
                </h3>

                <div className="space-y-5">
                  <div className="bg-white-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-700 mb-2">🏆 Sports</label>
                    <input
                      type="text"
                      name="sports"
                      placeholder="List any sports activities and achievements"
                      value={formData.sports}
                      onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                    />
                  </div>

                  <div className="bg-white-50 p-4 rounded-lg border border-blue-200">
                    <label className="block text-sm font-bold text-blue-700 mb-2">🤝 Social Works</label>
                    <input
                      type="text"
                      name="social_works"
                      placeholder="List any social work or community service"
                      value={formData.social_works}
                      onChange={handleChange}
                      className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all bg-white"
                    />
                  </div>
                </div>
              </section>

              {/* Reason for Applying */}
              <section className="bg-white p-6 rounded-xl shadow-md ">
                <h3 className="text-2xl font-bold text-blue-700 mb-5 flex items-center">
                  <span className="bg-purple-100 text-purple-600 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-xl">💡</span>
                  Reason for Applying
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <label className="flex items-center p-4 bg-white-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input
                      type="checkbox"
                      name="reason_financial_need"
                      checked={formData.reason_financial_need}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-3 font-semibold text-gray-700">💰 Financial Need</span>
                  </label>

                  <label className="flex items-center p-4 bg-white-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input
                      type="checkbox"
                      name="reason_academic"
                      checked={formData.reason_academic}
                      onChange={handleChange}
                      className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="ml-3 font-semibold text-gray-700">📖 Academic Excellence</span>
                  </label>

                  <label className="flex items-center p-4 bg-white-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input
                      type="checkbox"
                      name="reason_sports"
                      checked={formData.reason_sports}
                      onChange={handleChange}
                      className="w-5 h-5 text-yellow-600 rounded focus:ring-2 focus:ring-yellow-500"
                    />
                    <span className="ml-3 font-semibold text-gray-700">🏆 Sports Achievement</span>
                  </label>

                  <label className="flex items-center p-4 bg-white-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:bg-blue-100 transition-all">
                    <input
                      type="checkbox"
                      name="reason_cultural"
                      checked={formData.reason_cultural}
                      onChange={handleChange}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="ml-3 font-semibold text-gray-700">🎭 Cultural/Arts Achievement</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Other Reasons</label>
                  <textarea
                    name="reason_other"
                    placeholder="Please specify any other reasons for applying..."
                    value={formData.reason_other}
                    onChange={handleChange}
                    rows="3"
                    className="border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-3 w-full rounded-lg transition-all"
                  />
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-12 py-4 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  📤 Submit Application
                </button>
              </div>
            </form>

            {/* Footer Note */}
            <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-bold text-red-700">Note:</span> Your application will be reviewed by the school administration. 
                You will be notified of the decision via your registered contact information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}