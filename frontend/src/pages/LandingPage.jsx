import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-end p-6">
        <Link 
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Login
        </Link>
      </header>
      
      <div className="flex flex-col justify-center items-center h-full">
        <h1 className="text-4xl font-bold text-gray-900">
          School Management System
        </h1>
      </div>
    </div>
  );
}

export default LandingPage;