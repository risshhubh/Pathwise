import React, { useState } from "react";
import axios from "axios";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a resume (PDF, DOC, DOCX).");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to parse resume. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white px-6 py-12">
      <div className="max-w-xl w-full p-6 rounded-2xl shadow-lg bg-white/20 backdrop-blur-lg border border-white/30">
        <h2 className="text-2xl font-semibold mb-4">📄 Resume Builder & Analyzer</h2>

        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="block w-full mb-4 text-sm text-gray-200
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-100 file:text-blue-700
                     hover:file:bg-blue-200"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
        >
          {loading ? "Parsing..." : "Parse Resume"}
        </button>

        {error && <p className="text-red-400 mt-4">{error}</p>}

        {result && (
          <div className="mt-6 p-4 rounded-lg bg-white/30 backdrop-blur border border-white/30 shadow">
            <h3 className="text-lg font-semibold mb-2">Parsed Resume Data:</h3>

            {result.name && <p><strong>Name:</strong> {result.name}</p>}
            {result.email && <p><strong>Email:</strong> {result.email}</p>}
            {result.phone && <p><strong>Phone:</strong> {result.phone}</p>}

            {result.skills?.length > 0 && (
              <div className="mt-2">
                <strong>Skills:</strong>
                <ul className="list-disc ml-5">
                  {result.skills.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {result.experience?.length > 0 && (
              <div className="mt-2">
                <strong>Experience:</strong>
                <ul className="list-disc ml-5">
                  {result.experience.map((exp, i) => (
                    <li key={i}>
                      {exp.title} at {exp.company} ({exp.start_date} - {exp.end_date || "Present"})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.education?.length > 0 && (
              <div className="mt-2">
                <strong>Education:</strong>
                <ul className="list-disc ml-5">
                  {result.education.map((edu, i) => (
                    <li key={i}>
                      {edu.degree} at {edu.institution} ({edu.start_date} - {edu.end_date})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
