import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
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
  MapPin
} from 'lucide-react';

const AchievementCard = ({ achievement, activeTab, isAdmin, handleEdit, handleView }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
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
        <div className="absolute top-4 left-4">
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

const Modal = (showModal,
  setShowModal,
  modalType,
  activeTab,
  selectedAchievement,
  formData,
  setFormData,
  getCurrentCategories,
  levels,
  handleSave) => (
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
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {activeTab === 'academic' ? (
                  <GraduationCap className="w-10 h-10 text-blue-600" />
                ) : (
                  <Trophy className="w-10 h-10 text-yellow-600" />
                )}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">{selectedAchievement?.title}</h4>
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium">
                {selectedAchievement?.level} Level
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Student</p>
                    <p className="font-semibold">{selectedAchievement?.student}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Grade</p>
                    <p className="font-semibold">{selectedAchievement?.grade}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {selectedAchievement?.date && new Date(selectedAchievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold">{selectedAchievement?.category}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Medal className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-semibold">{selectedAchievement?.position}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">
                      {activeTab === 'academic' ? 'Teacher' : 'Coach'}
                    </p>
                    <p className="font-semibold">
                      {selectedAchievement?.teacher || selectedAchievement?.coach}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-gray-800 leading-relaxed">{selectedAchievement?.description}</p>
            </div>

            {((activeTab === 'academic' && selectedAchievement?.points) ||
              (activeTab === 'sports' && selectedAchievement?.records)) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    {activeTab === 'academic' ? 'Points' : 'Records'}
                  </h5>
                  <p className="text-gray-700">
                    {activeTab === 'academic' ?
                      `${selectedAchievement?.points} points scored` :
                      selectedAchievement?.records
                    }
                  </p>
                </div>
              )}
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
                  placeholder="e.g., Grade 11A"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1st Place, Winner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab === 'academic' ? 'Teacher' : 'Coach'}
                </label>
                <input
                  type="text"
                  value={activeTab === 'academic' ? formData.teacher : formData.coach}
                  onChange={(e) => setFormData({
                    ...formData,
                    [activeTab === 'academic' ? 'teacher' : 'coach']: e.target.value
                  })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`${activeTab === 'academic' ? 'Teacher' : 'Coach'} name`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detailed description of the achievement"
              />
            </div>

            {activeTab === 'academic' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                <input
                  type="number"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Points scored"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Records</label>
                <input
                  type="text"
                  value={formData.records}
                  onChange={(e) => setFormData({ ...formData, records: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., New school record: 1:02.45"
                />
              </div>
            )}

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



const AchievementsSystem = () => {
  const [activeTab, setActiveTab] = useState('academic');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add'
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const mapToMainCategory = (cat) => {
    const academicList = ['Science', 'Mathematics', 'Literature', 'Art', 'Music', 'Technology'];
    const sportsList = ['Swimming', 'Netball', 'Athletics', 'Basketball', 'Volleyball', 'Tennis', 'Sports'];

    if (academicList.includes(cat)) return 'academic';
    if (sportsList.includes(cat)) return 'sports';
    return 'extra';
  };



  // Sample data - replace with actual API calls
  const [academicAchievements, setAcademicAchievements] = useState([]);
  const [sportsAchievements, setSportsAchievements] = useState([]);
  const [extraAchievements, setExtraAchievements] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/achievements/")
      .then(res => res.json())
      .then(data => {
        const updated = data.data.map(a => ({
          ...a,
          image: `http://localhost:4000${a.image}`,
          date: a.date.split("T")[0]
        }));

        const academic = [];
        const sports = [];
        const extra = [];

        updated.forEach(a => {
          const mainCat = mapToMainCategory(a.category);
          if (mainCat === 'academic') academic.push(a);
          else if (mainCat === 'sports') sports.push(a);
          else extra.push(a);
        });

        setAcademicAchievements(academic);
        setSportsAchievements(sports);
        setExtraAchievements(extra);
      })
      .catch(err => console.error("Error loading achievements:", err));
  }, []);




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

  const levels = ['School', 'District', 'Provincial', 'National', 'International'];
  const years = ['2024', '2023', '2022', '2021', '2020'];

  const getCurrentAchievements = () => {
    if (activeTab === 'academic') return academicAchievements;
    if (activeTab === 'sports') return sportsAchievements;
    return extraAchievements;
  };

  const getCurrentCategories = () => {
    const list = activeTab === 'academic'
      ? academicAchievements
      : activeTab === 'sports'
        ? sportsAchievements
        : extraAchievements;

    return [...new Set(list.map(i => i.category))];
  };

  const filteredAchievements = getCurrentAchievements().filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.student.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || achievement.date.startsWith(selectedYear);
    const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;

    return matchesSearch && matchesYear && matchesCategory;
  });

  const handleEdit = (achievement) => {
    setSelectedAchievement(achievement);
    setFormData(achievement);
    setModalType('edit');
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedAchievement(null);
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

  const handleView = (achievement) => {
    setSelectedAchievement(achievement);
    setModalType('view');
    setShowModal(true);
  };

const handleSave = () => {
  
  if (modalType === 'add') {
    const newAchievement = {
      ...formData,
      id: Date.now()
    };

    if (activeTab === 'academic') {
      setAcademicAchievements([...academicAchievements, newAchievement]);
    } else if (activeTab === 'sports') {
      setSportsAchievements([...sportsAchievements, newAchievement]);
    } else {
      setExtraAchievements([...extraAchievements, newAchievement]);
    }
  } else if (modalType === 'edit') {
    if (activeTab === 'academic') {
      setAcademicAchievements(academicAchievements.map(item =>
        item.id === selectedAchievement.id ? { ...formData } : item
      ));
    } else if (activeTab === 'sports') {
      setSportsAchievements(sportsAchievements.map(item =>
        item.id === selectedAchievement.id ? { ...formData } : item
      ));
    } else {
      setExtraAchievements(extraAchievements.map(item =>
        item.id === selectedAchievement.id ? { ...formData } : item
      ));
    }
  }

  setShowModal(false);
};


  return (
    <Layout activePage="achievements">
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Academic & Sports Achievements</h1>
                <p className="text-gray-600 mt-1">Mahamaya Girls College, Kandy</p>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Admin Mode</span>
                </label>

                {isAdmin && (
                  <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Achievement
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'academic' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <GraduationCap className="w-5 h-5 mr-2" />
          Academic
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'sports' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <Trophy className="w-5 h-5 mr-2" />
          Sports
        </button>

        <button
          onClick={() => setActiveTab('extra')}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${activeTab === 'extra' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          <Star className="w-5 h-5 mr-2" />
          Extra-Curricular
        </button>
      </div>


      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search achievements or students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {getCurrentCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Grades</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                    <option value="13">Grade 13</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="all">All Positions</option>
                    <option value="1st">1st Place</option>
                    <option value="2nd">2nd Place</option>
                    <option value="3rd">3rd Place</option>
                    <option value="winner">Winner</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Achievements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {academicAchievements.length + sportsAchievements.length + extraAchievements.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Academic</p>
                <p className="text-2xl font-bold text-gray-900">{academicAchievements.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Medal className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sports</p>
                <p className="text-2xl font-bold text-gray-900">{sportsAchievements.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Extra curricular</p>
                <p className="text-2xl font-bold text-gray-900">
                  {extraAchievements.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        {filteredAchievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'academic' ? (
                <GraduationCap className="w-12 h-12 text-gray-400" />
              ) : (
                <Trophy className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedYear !== 'all' || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : `No ${activeTab} achievements have been added yet`}
            </p>
            {isAdmin && (
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Achievement
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <AchievementCard key={achievement.id}
                achievement={achievement}
                activeTab={activeTab}
                isAdmin={isAdmin}
                handleEdit={handleEdit}
                handleView={handleView} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Highlights Section */}
      {filteredAchievements.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">🎉 Recent Highlights</h3>
                <p className="text-blue-100">Celebrating our students' outstanding achievements</p>
              </div>
              <div className="hidden md:block">
                <Star className="w-16 h-16 text-yellow-300 opacity-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentAchievements().slice(0, 3).map(achievement => (
                <div key={achievement.id} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                  <h4 className="font-semibold mb-1 line-clamp-2">{achievement.title}</h4>
                  <p className="text-blue-100 text-sm mb-2">{achievement.student} • {achievement.grade}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {achievement.level}
                    </span>
                    <span className="text-xs text-blue-100">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600">
              © 2024 Mahamaya Girls College, Kandy - Academic & Sports Achievements System
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Developed by Computer Science Students, University of Peradeniya
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showModal && <Modal showModal={showModal}
        setShowModal={setShowModal}
        modalType={modalType}
        activeTab={activeTab}
        selectedAchievement={selectedAchievement}
        formData={formData}
        setFormData={setFormData}
        getCurrentCategories={getCurrentCategories}
        levels={levels}
        handleSave={handleSave} />}
    </div>
    </Layout>
  );
};

export default AchievementsSystem;