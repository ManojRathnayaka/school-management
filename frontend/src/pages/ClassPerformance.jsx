

import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

const ClassPerformance = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [academicScore, setAcademicScore] = useState(0);
  const [sportsScore, setSportsScore] = useState(0);
  const [disciplineScore, setDisciplineScore] = useState(0);
  const [leadershipScore, setLeadershipScore] = useState(0);
  const [comments, setComments] = useState("");

  const [overallScore, setOverallScore] = useState(0);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // Calculate overall score
  useEffect(() => {
    const a = Number(academicScore) || 0;
    const b = Number(sportsScore) || 0;
    const c = Number(disciplineScore) || 0;
    const d = Number(leadershipScore) || 0;

    setOverallScore(Math.round((a + b + c + d) / 4));
  }, [academicScore, sportsScore, disciplineScore, leadershipScore]);

  // Load teacher classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/class-performance/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data || []);
      } catch (err) {
        console.error("Failed to load classes", err);
        alert("Failed to load classes.");
      }
    };
    fetchClasses();
  }, [token]);

  // Load students for selected class
  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setSelectedStudentId("");
      resetPerformance();
      return;
    }

    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await axios.get(
          `/api/class-performance/classes/${selectedClassId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data || []);
        setSelectedStudentId("");
        resetPerformance();
      } catch (err) {
        console.error("Failed to load students", err);
        alert("Failed to load students.");
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [selectedClassId, token]);

  // Load performance for selected student
  useEffect(() => {
    if (!selectedClassId || !selectedStudentId) {
      resetPerformance();
      return;
    }

    const fetchPerformance = async () => {
      setLoadingPerformance(true);
      try {
        const res = await axios.get(
          `/api/class-performance/classes/${selectedClassId}/students/${selectedStudentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data) {
          const p = res.data;
          setAcademicScore(p.academic_score ?? 0);
          setSportsScore(p.sports_score ?? 0);
          setDisciplineScore(p.discipline_score ?? 0);
          setLeadershipScore(p.leadership_score ?? 0);
          setComments(p.comments ?? "");
        } else {
          resetPerformance();
        }
      } catch (err) {
        console.error("Failed to load performance", err);
        alert("Failed to load performance.");
      } finally {
        setLoadingPerformance(false);
      }
    };

    fetchPerformance();
  }, [selectedStudentId, selectedClassId, token]);

  // Reset sliders
  const resetPerformance = () => {
    setAcademicScore(0);
    setSportsScore(0);
    setDisciplineScore(0);
    setLeadershipScore(0);
    setComments("");
  };

  // Save performance
  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedClassId || !selectedStudentId) {
      alert("Please select a class and a student");
      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `/api/class-performance/classes/${selectedClassId}/students/${selectedStudentId}`,
        {
          academic_score: academicScore,
          sports_score: sportsScore,
          discipline_score: disciplineScore,
          leadership_score: leadershipScore,
          comments,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Performance saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save performance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout activePage="classPerformance">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Class Performance</h2>

        {/* CLASS & STUDENT SELECT */}
        <div className="flex gap-4 mb-8">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="border px-4 py-2 rounded w-48"
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="border px-4 py-2 rounded w-64"
            disabled={!selectedClassId || loadingStudents}
          >
            <option value="">
              {loadingStudents ? "Loading..." : "Select Student"}
            </option>

            {students.map((s) => (
              <option key={s.student_id} value={s.student_id}>
                {s.admission_number} — {s.first_name} {s.last_name}
              </option>
            ))}
          </select>
        </div>

        {/* SLIDERS */}
        <form onSubmit={handleSave} className="space-y-6 max-w-xl">

          <div>
            <label className="font-semibold">
              Academic Score: {academicScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={academicScore}
              onChange={(e) => setAcademicScore(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Sports Score: {sportsScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={sportsScore}
              onChange={(e) => setSportsScore(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Discipline Score: {disciplineScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={disciplineScore}
              onChange={(e) => setDisciplineScore(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="font-semibold">
              Leadership Score: {leadershipScore}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={leadershipScore}
              onChange={(e) => setLeadershipScore(e.target.value)}
              className="w-full"
            />
          </div>

          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Add comments"
            className="border rounded w-full p-2 min-h-[100px]"
          />

          <p className="font-bold text-lg">Overall Score: {overallScore}</p>

          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ClassPerformance;
