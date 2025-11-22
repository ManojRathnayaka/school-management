import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from "../context/AuthContext";

import axios from "axios";

import {
  Trophy,
  Medal,
  Star,
  Calendar,
  User,
  Edit2,
  Plus,
  Search,
  Filter,
  GraduationCap,
  Award,
  Target,
  BookOpen,
  Zap,
  ChevronDown,
  X,
  Save,
  Eye,
  Users,
} from 'lucide-react';


// Achievement card component
const AchievementCard = ({ achievement, activeTab, isAdmin, handleEdit, handleView, index }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 relative">
    {/* Row number */}
    <div className="absolute top-2 left-2 bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold z-10">
      {index + 1}
    </div>

    <div className="relative">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          {activeTab === 'academic' ? (
            <GraduationCap className="w-16 h-16 text-blue-600 mx-auto mb-2" />
          ) : (
            <Trophy className="w-16 h-16 text-yellow-600 mx-auto mb-2" />
          )}
          <span className="text-sm font-medium text-gray-600">{achievement.level}</span>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
          {achievement.position}
        </div>
      </div>

      {achievement.level === 'National' && (
        <div className="absolute top-4 left-12">
          <Star className="w-6 h-6 text-yellow-500 fill-current" />
        </div>
      )}
    </div>

    <div className="p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {achievement.title}
        </h3>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(achievement);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-gray-100"
          >
            <Edit2 className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <User className="w-4 h-4 mr-2" />
          <span className="font-medium">{achievement.student}</span>
          <span className="mx-2">•</span>
          <span className="text-sm">{achievement.grade}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">{new Date(achievement.date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <Award className="w-4 h-4 mr-2" />
          <span className="text-sm">{achievement.category}</span>
        </div>
      </div>

      <p className="text-gray-700 text-sm line-clamp-3 mb-4">
        {achievement.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {activeTab === 'academic' && achievement.points && (
            <div className="flex items-center text-green-600">
              <Target className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">{achievement.points} pts</span>
            </div>
          )}

          {activeTab === 'sports' && achievement.records && (
            <div className="flex items-center text-purple-600">
              <Zap className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Record</span>
            </div>
          )}
        </div>

        <button
          onClick={() => handleView(achievement)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View Details
        </button>
      </div>
    </div>
  </div>
);

// Modal component
const Modal = ({
  showModal,
  setShowModal,
  modalType,
  activeTab,
  selectedAchievement,
  formData,
  setFormData,
  getCurrentCategories,
  levels,
  handleSave
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              {modalType === 'add' ? `Add New ${activeTab === 'academic' ? 'Academic' : 'Sports'} Achievement` :
                modalType === 'edit' ? 'Edit Achievement' : 'Achievement Details'}
            </h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {modalType === 'view' ? (
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedAchievement?.title}</h4>
              {/* Display other fields as needed */}
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Achievement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                  <input
                    type="text"
                    value={formData.student}
                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Student name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Grade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {getCurrentCategories().map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select level</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// Main component
const AchievementsSystem = () => {
  const [activeTab, setActiveTab] = useState('academic');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add'
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const [academicAchievements, setAcademicAchievements] = useState([]);
  const [sportsAchievements, setSportsAchievements] = useState([]);
  const [extraAchievements, setExtraAchievements] = useState([]);

  // New states for Add/Edit

  const [editingItem, setEditingItem] = useState(null);

  const levels = ['School', 'District', 'Provincial', 'National', 'International'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  const mapToMainCategory = (cat) => {
    const academicList = ['Science', 'Mathematics', 'Literature', 'Arts', 'Music', 'Technology'];
    const sportsList = ['Swimming', 'Netball', 'Athletics', 'Basketball', 'Volleyball', 'Tennis', 'Sports'];
    if (academicList.includes(cat)) return 'academic';
    if (sportsList.includes(cat)) return 'sports';
    return 'extra';
  };

useEffect(() => {
  axios
    .get("/api/achievements/")
    .then(res => {
      const data = res.data.data;

      const updated = data.map(a => ({
        ...a,
        image: `http://localhost:4000${a.image}`,
        date: a.date.split("T")[0]
      }));

      const academic = [];
      const sports = [];
      const extra = [];

      updated.forEach(a => {
        const mainCat = mapToMainCategory(a.category);
        if (mainCat === "academic") academic.push(a);
        else if (mainCat === "sports") sports.push(a);
        else extra.push(a);
      });

      setAcademicAchievements(academic);
      setSportsAchievements(sports);
      setExtraAchievements(extra);
    })
    .catch(err =>
      console.error("Error loading achievements:", err)
    );
}, []);



  const getCurrentAchievements = () => {
    if (activeTab === 'academic') return academicAchievements;
    if (activeTab === 'sports') return sportsAchievements;
    return extraAchievements;
  };

  const getCurrentCategories = () => {
    const list = activeTab === 'academic' ? academicAchievements : activeTab === 'sports' ? sportsAchievements : extraAchievements;
    return [...new Set(list.map(i => i.category))];
  };

  const filteredAchievements = getCurrentAchievements().filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || achievement.date.startsWith(selectedYear);
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
    return matchesSearch && matchesYear && matchesCategory;
  });

  const handleAdd = () => {

    setEditingItem(null);
    setFormData({
      title: '',
      student: '',
      grade: '',
      date: '',
      category: '',
      description: '',
      level: '',
      position: '',
      teacher: '',
      coach: '',
      points: '',
      records: ''
    });
    setModalType('add');
    setShowModal(true);
  };

  const handleEdit = (achievement) => {
    setEditingItem(achievement);
    setFormData(achievement);
    setModalType('edit');

    setShowModal(true);
  };

  const handleView = (achievement) => {
    setSelectedAchievement(achievement);
    setModalType('view');
    setShowModal(true);
  };

  const [formData, setFormData] = useState({
    title: '',
    student: '',
    grade: '',
    date: '',
    category: '',
    description: '',
    level: '',
    position: '',
    teacher: '',
    coach: '',
    points: '',
    records: ''
  });

const handleSave = async () => {
  try {
    // Build correct data object for backend
    const data = {
      title: formData.title,
      student: formData.student,
      grade: formData.grade,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      image: formData.image,
      level: formData.level,
      position: formData.position,
      points: formData.points,
      teacher: formData.teacher
    };

    console.log("Sending data:", data);

    const res = await axios.post(
      "http://localhost:4000/api/achievements",
      data
    );

    console.log("Saved:", res.data);

    // Add new achievement to UI list
    setAcademicAchievements((prev) => [...prev, res.data.data]);

    // Close modal
    setShowModal(false);

    alert("Achievement saved successfully!");

  } catch (err) {
    console.error("Error saving achievement:", err.response?.data || err);
    alert("Error: " + (err.response?.data?.message || "Could not save"));
  }
};

  const { user } = useAuth();

  return (
    <Layout activePage="achievements">
      <div className="min-h-screen bg-gray-50">
        {/* Header and Admin Button */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic & Sports Achievements</h1>
                <p className="text-gray-600 mt-1">Mahamaya Girls College, Kandy</p>
              </div>
              <div className="flex items-center space-x-4">

                {(user?.role === "principal" || user?.role === "teacher") && (
                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" /> Add Achievement
                  </button>
                )}


              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit mx-4 mt-6">
          <button onClick={() => setActiveTab('academic')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'academic' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><GraduationCap className="w-5 h-5 mr-2" /> Academic</button>
          <button onClick={() => setActiveTab('sports')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'sports' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Trophy className="w-5 h-5 mr-2" /> Sports</button>
          <button onClick={() => setActiveTab('extra')} className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'extra' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}><Star className="w-5 h-5 mr-2" /> Extra</button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center justify-between px-4 mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>

          <div className="flex items-center space-x-2">
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Categories</option>
              {getCurrentCategories().map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-6">
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              activeTab={activeTab}
              isAdmin={isAdmin}
              handleEdit={handleEdit}
              handleView={handleView}
              index={index} // row number
            />
          ))}
        </div>

        {/* Modal */}
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          modalType={modalType}
          activeTab={activeTab}
          selectedAchievement={selectedAchievement}
          formData={formData}
          setFormData={setFormData}
          getCurrentCategories={getCurrentCategories}
          levels={levels}
          handleSave={handleSave}
        />
      </div>
    </Layout>
  );
};

export default AchievementsSystem;
