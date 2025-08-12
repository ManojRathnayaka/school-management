// Component imports
import {  useState } from "react";
import axios from "axios";


import Layout from "../components/Layout";

export default function Scholarships() {

  const [formData, setFormData] = useState({
    student_id: "",
    student_name:"",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/scholarships", formData , { withCredentials: true });
      alert("Scholarship application submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };



  return (
    <Layout activePage="scholarships">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">Scholarships Application Form</h2>

        <p className="text-center text-gray-600 mb-10">
            Please fill in all the required details accurately. This will help us evaluate your application fairly.
          </p>
      
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Information */}
          <section>
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Student Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="student_id" placeholder="Student ID" value={formData.student_id} onChange={handleChange} className="border p-2 w-full" required />
          <input type="text" name="student_name" placeholder="Student Name" value={formData.student_name} onChange={handleChange} className="border p-2 w-full" />
          </div>
          </section>

          {/* Parent Information */}
          <section>
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Parent / Guardian Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="father_name" placeholder="Father Name" value={formData.father_name} onChange={handleChange} className="border p-2 w-full" required />
          <input type="text" name="father_occupation" placeholder="Father Occupation" value={formData.father_occupation} onChange={handleChange} className="border p-2 w-full" />
          <input type="number" name="father_income" placeholder="Father Monthly Income" value={formData.father_income} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="father_contact" placeholder="Father Contact Number" value={formData.father_contact} onChange={handleChange} className="border p-2 w-full" />

          <input type="text" name="mother_name" placeholder="Mother Name" value={formData.mother_name} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="mother_occupation" placeholder="Mother Occupation" value={formData.mother_occupation} onChange={handleChange} className="border p-2 w-full" />
          <input type="number" name="mother_income" placeholder="Mother Monthly Income" value={formData.mother_income} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="mother_contact" placeholder="Mother Contact Number" value={formData.mother_contact} onChange={handleChange} className="border p-2 w-full" />
          </div>
          </section>

          {/* Academic Information */}
            <section>
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Medical or Physical Challenges</h3>
          <input type="text" name="medical_or_Physical_Challenges" placeholder="Insert Here " value={formData.medical_or_Physical_Challenges} onChange={handleChange} className="border p-2 w-full" />

          </section>


          <section>

          <h3 className="text-xl font-semibold text-blue-600 mb-4">Extra - Curricular Involvement</h3>
          <h4 className="text-xl font-semibold text-blue-600 mb-4">Sports</h4>
          <input type="text" name="sports" placeholder="Sports" value={formData.sports} onChange={handleChange} className="border p-2 w-full" />

          <h4 className="text-xl font-semibold text-blue-600 mb-4">Social Works</h4>
          <input type="text" name="social_works" placeholder="Social works" value={formData.social_works} onChange={handleChange} className="border p-2 w-full" />
          </section>
          

          {/* Reason for Applying */}
          <section>
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Reason for Applying</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <label><input type="checkbox" name="reason_financial_need" checked={formData.reason_financial_need} onChange={handleChange} /> Financial Need</label><br />
          <label><input type="checkbox" name="reason_academic" checked={formData.reason_academic} onChange={handleChange} /> Academic Excellence</label><br />
          <label><input type="checkbox" name="reason_sports" checked={formData.reason_sports} onChange={handleChange} /> Sports Achievement</label><br />
          <label><input type="checkbox" name="reason_cultural" checked={formData.reason_cultural} onChange={handleChange} /> Cultural/Arts Achievement</label><br />
          </div>
          <input type="text" name="reason_other" placeholder="Other Reason" value={formData.reason_other} onChange={handleChange} className="border p-2 w-full" />
          </section>

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Application</button>
        </form>
        </div>
      </div>
    </Layout>
  );
}