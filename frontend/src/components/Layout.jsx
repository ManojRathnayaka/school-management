// Component imports
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, activePage }) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar activePage={activePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}