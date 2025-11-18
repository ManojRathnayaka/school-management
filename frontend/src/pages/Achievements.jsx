import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import AllAchievementsView from "../components/achievements/AllAchievementsView";
import AcademicAchievements from "../components/achievements/AcademicAchievements";
import SportsAchievements from "../components/achievements/SportsAchievements";
import ArtsAchievements from "../components/achievements/ArtsAchievements";
import ExtracurricularAchievements from "../components/achievements/ExtracurricularAchievements";
import AchievementModal from "../components/achievements/AchievementModal";
import { Trophy, GraduationCap, Award, Palette, Star, Plus } from "lucide-react";

const TABS = [
  { id: "all", label: "All Achievements", icon: Trophy },
  { id: "academic", label: "Academic", icon: GraduationCap },
  { id: "sports", label: "Sports", icon: Award },
  { id: "arts", label: "Arts & Cultural", icon: Palette },
  { id: "extracurricular", label: "Extracurricular", icon: Star },
];

export default function Achievements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const canManage = user?.role === "principal" || user?.role === "teacher";

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setActiveTab(tabId);
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleAddClick = () => {
    document.getElementById('add_achievement_modal').showModal();
  };

  return (
    <Layout activePage="achievements">
      <div className="bg-base-100">
        <div className="card-body">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="card-title text-3xl text-base-content">
              <Trophy className="w-8 h-8 text-primary mr-2" />
              Achievements
            </h1>
            {canManage && (
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleAddClick}
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6 overflow-x-auto">
            <div className="tabs tabs-boxed bg-base-200 p-1 inline-flex min-w-full">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab gap-2 flex-nowrap ${activeTab === tab.id ? 'tab-active' : ''}`}
                    onClick={() => handleTabChange(tab.id)}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                    <span className="sm:hidden whitespace-nowrap">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            ) : (
              <>
                {activeTab === "all" && <AllAchievementsView key={refreshKey} />}
                {activeTab === "academic" && <AcademicAchievements key={refreshKey} />}
                {activeTab === "sports" && <SportsAchievements key={refreshKey} />}
                {activeTab === "arts" && <ArtsAchievements key={refreshKey} />}
                {activeTab === "extracurricular" && <ExtracurricularAchievements key={refreshKey} />}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Achievement Modal */}
      <AchievementModal 
        modalId="add_achievement_modal"
        onSuccess={handleRefresh}
      />
    </Layout>
  );
}