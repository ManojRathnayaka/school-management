import React from 'react';
import { Users, Trophy, Award, Calendar, Home, UserPlus } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: Users,
      title: 'Parent Portal',
      description: 'Gives parents a clear view of their student\'s overall performance and provides a direct communication line to class teachers.',
      gradient: 'bg-gradient-to-br from-blue-100 to-purple-100'
    },
    {
      icon: Trophy,
      title: 'Achievement Tracking',
      description: 'A structured way to record, view, and recognize all academic and sports achievements of students throughout their school life.',
      gradient: 'bg-gradient-to-br from-yellow-100 to-orange-100'
    },
    {
      icon: Award,
      title: 'Scholarship Management',
      description: 'A transparent system for students to apply for scholarships and for the principal to efficiently review and manage all applications.',
      gradient: 'bg-gradient-to-br from-green-100 to-teal-100'
    },
    {
      icon: Calendar,
      title: 'Venue Management',
      description: 'Digitizes the scheduling of the auditorium and other school venues, preventing booking conflicts and providing an organized calendar for staff.',
      gradient: 'bg-gradient-to-br from-pink-100 to-rose-100'
    },
    {
      icon: Home,
      title: 'Hostel Management',
      description: 'Allows the principal to efficiently manage hostel accommodations, including room allocations and student residency records.',
      gradient: 'bg-gradient-to-br from-indigo-100 to-blue-100'
    },
    {
      icon: UserPlus,
      title: 'Student Registration',
      description: 'Streamlines the student enrollment process, allowing school administration to maintain all student records in one centralized, secure system.',
      gradient: 'bg-gradient-to-br from-purple-100 to-pink-100'
    }
  ];

  return (
    <section id="features" className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Our System Features
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            A centralized platform to manage all school activities and enhance communication.
          </p>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature Cards */}
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className={`card shadow-xl transition-transform duration-300 hover:scale-105 ${feature.gradient}`}>
                <figure className="px-10 pt-10">
                  <IconComponent size={48} className="text-gray-700" />
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title text-gray-800">{feature.title}</h2>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default Features;