// Component imports
import { useState } from "react";
import axios from "axios";


import Layout from "../components/Layout";

export default function Scholarships() {

  const [formData, setFormData] = useState({
    student_id: "",
    father_name: "",
    father_occupation: "",
    father_income: "",
    father_contact: "",
    mother_name: "",
    mother_occupation: "",
    mother_income: "",
    mother_contact: "",
    school_name: "",
    academic_year: "",
    last_exam_passed: "",
    percentage_grade: "",
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
      await axios.post("http://localhost:5000/api/scholarships", formData);
      alert("Scholarship application submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting application");
    }
  };



  return (
    <Layout activePage="scholarships">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Scholarships Application Form</h2>
      
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID */}
          <input type="text" name="student_id" placeholder="Student ID" value={formData.student_id} onChange={handleChange} className="border p-2 w-full" required />

          {/* Parent Information */}
          <h3 className="font-bold">Parent / Guardian Information</h3>
          <input type="text" name="father_name" placeholder="Father Name" value={formData.father_name} onChange={handleChange} className="border p-2 w-full" required />
          <input type="text" name="father_occupation" placeholder="Father Occupation" value={formData.father_occupation} onChange={handleChange} className="border p-2 w-full" />
          <input type="number" name="father_income" placeholder="Father Monthly Income" value={formData.father_income} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="father_contact" placeholder="Father Contact Number" value={formData.father_contact} onChange={handleChange} className="border p-2 w-full" />

          <input type="text" name="mother_name" placeholder="Mother Name" value={formData.mother_name} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="mother_occupation" placeholder="Mother Occupation" value={formData.mother_occupation} onChange={handleChange} className="border p-2 w-full" />
          <input type="number" name="mother_income" placeholder="Mother Monthly Income" value={formData.mother_income} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="mother_contact" placeholder="Mother Contact Number" value={formData.mother_contact} onChange={handleChange} className="border p-2 w-full" />

          {/* Academic Information */}
          <h3 className="font-bold">Academic Information</h3>
          <input type="text" name="school_name" placeholder="School Name" value={formData.school_name} onChange={handleChange} className="border p-2 w-full" required />
          <input type="text" name="academic_year" placeholder="Academic Year" value={formData.academic_year} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="last_exam_passed" placeholder="Last Examination Passed" value={formData.last_exam_passed} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="percentage_grade" placeholder="Percentage/Grade" value={formData.percentage_grade} onChange={handleChange} className="border p-2 w-full" />

          {/* Reason for Applying */}
          <h3 className="font-bold">Reason for Applying</h3>
          <label><input type="checkbox" name="reason_financial_need" checked={formData.reason_financial_need} onChange={handleChange} /> Financial Need</label><br />
          <label><input type="checkbox" name="reason_academic" checked={formData.reason_academic} onChange={handleChange} /> Academic Excellence</label><br />
          <label><input type="checkbox" name="reason_sports" checked={formData.reason_sports} onChange={handleChange} /> Sports Achievement</label><br />
          <label><input type="checkbox" name="reason_cultural" checked={formData.reason_cultural} onChange={handleChange} /> Cultural/Arts Achievement</label><br />
          <input type="text" name="reason_other" placeholder="Other Reason" value={formData.reason_other} onChange={handleChange} className="border p-2 w-full" />

          {/* Submit Button */}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit Application</button>
        </form>
      </div>
    </Layout>
  );
}