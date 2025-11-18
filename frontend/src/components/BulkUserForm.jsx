import { useState } from "react";
import { CSVLink } from "react-csv";
import { USER_ROLES } from "../constants";
import { Upload, Download, AlertCircle, CheckCircle, Users, FileText } from "lucide-react";

export default function BulkUserForm() {
  const [role, setRole] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  // Generate CSV template based on role
  const getTemplateData = () => {
  const baseHeaders = [
    { label: "first_name", key: "first_name" },
    { label: "last_name", key: "last_name" },
    { label: "email", key: "email" },
  ];

  if (role === USER_ROLES.TEACHER) {
    return {
      headers: [
        ...baseHeaders,
        { label: "contact_number", key: "contact_number" },
        { label: "grade", key: "grade" },
      ],
      data: [{ 
        first_name: "John", 
        last_name: "Doe", 
        email: "john.doe@example.com", 
        contact_number: "1234567890", 
        grade: "5" 
      }],
      filename: "teacher_template.csv",
    };
  }
  
  return {
    headers: baseHeaders,
    data: [{ first_name: "Jane", last_name: "Smith", email: "jane.smith@example.com" }],
    filename: `${role}_template.csv`,
  };
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

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (!file) {
      setError("Please select a CSV file");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("role", role);
      formData.append("userCsv", file);

      const response = await fetch("/api/auth/users/bulk-create", {
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

  const roleOptions = [
    { value: USER_ROLES.TEACHER, label: "Teacher" },
    { value: USER_ROLES.PRINCIPAL, label: "Principal" },
    { value: USER_ROLES.ADMIN, label: "Admin" },
  ];

  const template = getTemplateData();

  return (
    <div className="p-4">
      {/* Instructions Alert */}
      <div className="alert alert-info mb-6">
        <FileText className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-medium">Bulk Import Instructions:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Select a role for all users in your CSV file</li>
            <li>Download the CSV template for the selected role</li>
            <li>Fill in the user details in the CSV file</li>
            <li>Upload the completed CSV file</li>
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
        {/* Role Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Select Role
          </h3>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                Role (applies to all users in CSV)
              </span>
            </label>
            <div className="flex flex-wrap gap-4">
              {roleOptions.map((option) => (
                <div key={option.value} className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={role === option.value}
                      onChange={(e) => setRole(e.target.value)}
                      className="radio radio-primary mr-2"
                      required
                    />
                    <span className="label-text">{option.label}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Download Template */}
        {role && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Template
            </h3>
            <CSVLink
              data={template.data}
              headers={template.headers}
              filename={template.filename}
              className="btn btn-outline btn-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download {role.charAt(0).toUpperCase() + role.slice(1)} Template
            </CSVLink>
          </div>
        )}

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
                Import Users
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
                  {result.successes.length} Users Created Successfully
                </h3>

                <div className="mt-4">
                  <CSVLink
                    data={result.successes}
                    headers={[
                      { label: "Email", key: "email" },
                      { label: "First Name", key: "first_name" },
                      { label: "Last Name", key: "last_name" },
                      { label: "Temporary Password", key: "tempPassword" },
                    ]}
                    filename={`user_passwords_${new Date().toISOString().split('T')[0]}.csv`}
                    className="btn btn-success btn-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Passwords CSV
                  </CSVLink>
                  <p className="text-sm mt-3 opacity-80">
                    Download this file and securely share the temporary passwords with
                    the newly created users.
                  </p>
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
                  {result.failures.length} Users Failed to Import
                </h3>

                <div className="mt-4 overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.failures.map((failure, index) => (
                        <tr key={index}>
                          <td className="font-mono text-sm">{failure.email}</td>
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