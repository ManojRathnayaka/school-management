// Component imports
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, activePage }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activePage={activePage} />
      <div className="flex-1">
        <Header />
        <div>
          {children}
        </div>
      </div>
    </div>
  );
} 