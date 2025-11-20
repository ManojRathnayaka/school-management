import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

// School Branding Colors
const SCHOOL_BLUE = "#0D47A1";
const SCHOOL_YELLOW = "#FBC02D";

const ClassPerformance = () => {
  // ───────────────────────────────────────────────
  // STATE
  // ───────────────────────────────────────────────
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

  const [lastUpdated, setLastUpdated] = useState(null);
  const [updatedByName, setUpdatedByName] = useState(null);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [saving, setSaving] = useState(false);

  // Student Photo State
  const [studentPhoto, setStudentPhoto] = useState("/src/assets/default_user.jpg");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  // ───────────────────────────────────────────────
  // CALCULATE FINAL SCORE
  // ───────────────────────────────────────────────
  useEffect(() => {
    const a = Number(academicScore) || 0;
    const b = Number(sportsScore) || 0;
    const c = Number(disciplineScore) || 0;
    const d = Number(leadershipScore) || 0;

    setOverallScore(Math.round((a + b + c + d) / 4));
  }, [academicScore, sportsScore, disciplineScore, leadershipScore]);

  // ───────────────────────────────────────────────
  // FETCH CLASSES
  // ───────────────────────────────────────────────
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await axios.get("/api/class-performance/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(res.data || []);
      } catch (err) {
        alert("Failed to load classes");
      }
    };

    loadClasses();
  }, [token]);

  // ───────────────────────────────────────────────
  // FETCH STUDENTS
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setSelectedStudentId("");
      resetPerformance();
      return;
    }

    const loadStudents = async () => {
      setLoadingStudents(true);

      try {
        const res = await axios.get(
          `/api/class-performance/classes/${selectedClassId}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStudents(res.data || []);
      } catch {
        alert("Failed to load students");
      } finally {
        setLoadingStudents(false);
      }
    };

    loadStudents();
  }, [selectedClassId]);

  // ───────────────────────────────────────────────
  // FETCH PERFORMANCE + PHOTO
  // ───────────────────────────────────────────────
  useEffect(() => {
    if (!selectedClassId || !selectedStudentId) {
      resetPerformance();
      return;
    }

    const loadPerformance = async () => {
      setLoadingPerformance(true);

      try {
        const res = await axios.get(
          `/api/class-performance/classes/${selectedClassId}/students/${selectedStudentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const p = res.data;

        if (p) {
          setAcademicScore(p.academic_score ?? 0);
          setSportsScore(p.sports_score ?? 0);
          setDisciplineScore(p.discipline_score ?? 0);
          setLeadershipScore(p.leadership_score ?? 0);
          setComments(p.comments ?? "");

          setLastUpdated(p.updated_at ?? null);
          setUpdatedByName(p.updated_by_name ?? null);

          // ⭐ Load student photo
          loadStudentPhoto(p.admission_number);
        }
      } catch {
        alert("Failed to load performance");
      } finally {
        setLoadingPerformance(false);
      }
    };

    loadPerformance();
  }, [selectedStudentId]);

  // ───────────────────────────────────────────────
  // ⭐ CORRECTED STUDENT PHOTO LOADER (final working)
  // ───────────────────────────────────────────────
  const loadStudentPhoto = (admission) => {
    if (!admission) {
      setStudentPhoto("/src/assets/default_user.jpg");
      return;
    }

    const formats = ["jpg", "jpeg", "png"];

    const tryLoad = (i) => {
      if (i >= formats.length) {
        setStudentPhoto("/src/assets/default_user.jpg");
        return;
      }

      const path = `/src/assets/${admission}.${formats[i]}`;
      const img = new Image();
      img.src = path;

      img.onload = () => setStudentPhoto(path);
      img.onerror = () => tryLoad(i + 1);
    };

    tryLoad(0);
  };

  // ───────────────────────────────────────────────
  // RESET PERFORMANCE
  // ───────────────────────────────────────────────
  const resetPerformance = () => {
    setAcademicScore(0);
    setSportsScore(0);
    setDisciplineScore(0);
    setLeadershipScore(0);
    setComments("");

    setLastUpdated(null);
    setUpdatedByName(null);

    setStudentPhoto("/src/assets/default_user.jpg");
  };

  // ───────────────────────────────────────────────
  // SAVE PERFORMANCE
  // ───────────────────────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedClassId || !selectedStudentId) return alert("Select class and student");

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Saved!");
      setLastUpdated(new Date().toISOString());
      setUpdatedByName("You");
    } catch (err) {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // ───────────────────────────────────────────────
  // SCORE FIELD COMPONENT
  // ───────────────────────────────────────────────
  const ScoreField = ({ label, value, setValue }) => (
    <div className="mb-6">
      <p className="font-semibold mb-1 text-gray-700">{label}</p>

      <div className="flex items-center gap-4">
        <input
          type="number"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 border rounded-lg px-3 py-2 text-center"
        />

        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 accent-blue-600"
        />
      </div>
    </div>
  );

  // FORMAT LAST UPDATED
  const formatDateTime = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
  return (
    <Layout activePage="classPerformance">
      <div className="bg-white p-8 rounded-lg shadow max-w-4xl mx-auto mt-6">

        {/* HEADER */}
        <h1
          className="text-3xl font-bold text-white p-4 mb-6 rounded-lg text-center"
          style={{ backgroundColor: SCHOOL_BLUE }}
        >
          Class Performance
        </h1>

        {/* CLASS & STUDENT SELECT */}
        <div className="flex flex-wrap gap-4 mb-10 items-center">

          {/* Student Photo */}
          {selectedStudentId && (
            <img
              src={studentPhoto}
              onClick={() => setIsModalOpen(true)}
              className="w-20 h-20 rounded-full object-cover border-2 shadow cursor-pointer hover:scale-105 transition"
              alt="Student"
            />
          )}

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
            disabled={!selectedClassId || loadingStudents}
            className="border px-4 py-2 rounded w-64"
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

        {/* PERFORMANCE FORM */}
        <form onSubmit={handleSave}>
          <ScoreField label="Academic Score" value={academicScore} setValue={setAcademicScore} />
          <ScoreField label="Sports Score" value={sportsScore} setValue={setSportsScore} />
          <ScoreField label="Discipline Score" value={disciplineScore} setValue={setDisciplineScore} />
          <ScoreField label="Leadership Score" value={leadershipScore} setValue={setLeadershipScore} />

          {/* COMMENTS */}
          <div className="mb-6">
            <p className="font-semibold text-gray-700 mb-2">Comments</p>
            <textarea
              className="border w-full rounded-lg p-3 min-h-[120px]"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments..."
            />
          </div>

          {/* OVERALL */}
          <p className="text-xl font-bold mb-4">
            Overall Score: <span className="text-blue-700">{overallScore}</span>
          </p>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-lg text-white font-semibold shadow"
            style={{ backgroundColor: saving ? "#888" : SCHOOL_BLUE }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* LAST UPDATED INFO */}
        {lastUpdated && (
          <div
            className="mt-10 p-4 rounded-lg shadow border"
            style={{
              backgroundColor: SCHOOL_YELLOW + "20",
              borderColor: SCHOOL_YELLOW,
            }}
          >
            <p className="font-bold text-lg text-gray-800">Last Updated</p>

            <p className="text-gray-700 mt-1">
              <span className="font-semibold">Date & Time:</span>{" "}
              {formatDateTime(lastUpdated)}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Updated By:</span>{" "}
              {updatedByName || "Unknown Teacher"}
            </p>
          </div>
        )}

        {/* PHOTO MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-xl shadow-xl relative">
              <img src={studentPhoto} className="max-h-[80vh] rounded-xl" alt="Student" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded"
              >
                ✖
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ClassPerformance;
