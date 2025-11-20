import { useState } from "react";
import { CSVLink } from "react-csv";
import { Upload, Download, AlertCircle, CheckCircle, Users, FileText } from "lucide-react";

export default function BulkStudentForm() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // CSV template data
  const templateData = {
    headers: [
      { label: "student_first_name", key: "student_first_name" },
      { label: "student_last_name", key: "student_last_name" },
      { label: "student_email", key: "student_email" },
      { label: "admission_number", key: "admission_number" },
      { label: "date_of_birth", key: "date_of_birth" },
      { label: "grade", key: "grade" },
      { label: "section", key: "section" },
      { label: "address", key: "address" },
      { label: "parent_first_name", key: "parent_first_name" },
      { label: "parent_last_name", key: "parent_last_name" },
      { label: "parent_email", key: "parent_email" },
      { label: "contact_number", key: "contact_number" },
    ],
    data: [
      {
        student_first_name: "John",
        student_last_name: "Doe",
        student_email: "john.doe@student.com",
        admission_number: "2024001",
        date_of_birth: "2010-05-15",
        grade: "8",
        section: "A",
        address: "123 Main St, City",
        parent_first_name: "Jane",
        parent_last_name: "Doe",
        parent_email: "jane.doe@parent.com",
        contact_number: "1234567890",
      },
    ],
    filename: "student_registration_template.csv",
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid CSV file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("studentCsv", file);

      const response = await fetch("/api/students/bulk-register", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Bulk import failed");
      }

      setResult(data);
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      setError(err.message || "An error occurred during import");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Instructions Alert */}
      <div className="alert alert-info mb-6">
        <FileText className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-medium">Bulk Student Registration Instructions:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Download the CSV template below</li>
            <li>Fill in student and parent details for each row</li>
            <li>Each student must have a parent (1:1 relationship)</li>
            <li>Upload the completed CSV file</li>
            <li>Both student and parent will share the same initial password</li>
          </ol>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Download Template */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Template
          </h3>
          <CSVLink
            data={templateData.data}
            headers={templateData.headers}
            filename={templateData.filename}
            className="btn btn-outline btn-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Student Registration Template
          </CSVLink>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload CSV File
          </h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Select CSV File</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="file-input file-input-bordered file-input-sm w-full"
              required
            />
            {file && (
              <label className="label">
                <span className="label-text-alt text-success">
                  Selected: {file.name}
                </span>
              </label>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Students
              </>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="divider">Import Results</div>

          {/* Success Summary */}
          {result.successes.length > 0 && (
            <div className="card bg-success/10 border border-success/20">
              <div className="card-body">
                <h3 className="card-title text-success flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {result.successes.length} Students Registered Successfully
                </h3>

                <div className="mt-4">
                  <CSVLink
                    data={result.successes}
                    headers={[
                      { label: "Admission Number", key: "admission_number" },
                      { label: "Student First Name", key: "student_first_name" },
                      { label: "Student Last Name", key: "student_last_name" },
                      { label: "Student Email", key: "student_email" },
                      { label: "Parent First Name", key: "parent_first_name" },
                      { label: "Parent Last Name", key: "parent_last_name" },
                      { label: "Parent Email", key: "parent_email" },
                      { label: "Shared Password", key: "sharedPassword" },
                    ]}
                    filename={`student_passwords_${new Date().toISOString().split('T')[0]}.csv`}
                    className="btn btn-success btn-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Passwords CSV
                  </CSVLink>
                  <p className="text-sm mt-3 opacity-80">
                    Download this file and securely share the passwords with students and parents.
                    Each student-parent pair shares the same password.
                  </p>
                </div>

                {/* Preview Table */}
                <div className="mt-4 overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Admission #</th>
                        <th>Student Name</th>
                        <th>Student Email</th>
                        <th>Parent Name</th>
                        <th>Parent Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.successes.slice(0, 5).map((success, index) => (
                        <tr key={index}>
                          <td className="font-mono text-sm">{success.admission_number}</td>
                          <td className="text-sm">{success.student_first_name} {success.student_last_name}</td>
                          <td className="font-mono text-sm">{success.student_email}</td>
                          <td className="text-sm">{success.parent_first_name} {success.parent_last_name}</td>
                          <td className="font-mono text-sm">{success.parent_email}</td>
                        </tr>
                      ))}
                      {result.successes.length > 5 && (
                        <tr>
                          <td colSpan="5" className="text-center text-sm opacity-60">
                            ... and {result.successes.length - 5} more
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Failure Summary */}
          {result.failures.length > 0 && (
            <div className="card bg-error/10 border border-error/20">
              <div className="card-body">
                <h3 className="card-title text-error flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {result.failures.length} Students Failed to Import
                </h3>

                <div className="mt-4 overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Admission Number</th>
                        <th>Student Email</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.failures.map((failure, index) => (
                        <tr key={index}>
                          <td className="font-mono text-sm">{failure.admission_number}</td>
                          <td className="font-mono text-sm">{failure.student_email}</td>
                          <td className="text-sm">{failure.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}