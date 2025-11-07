import React from 'react';
import { Users, GraduationCap, Briefcase, Shield } from 'lucide-react';

function SystemOverview() {
  return (
    <section id="overview" className="py-20 bg-base-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            A System Designed for Our Community
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            This system replaces traditional manual processes with a single, unified web platform. It's designed to streamline administrative tasks, enhance communication, and provide a secure, centralized source for all school data.
          </p>
        </div>

        {/* 2. DaisyUI Tabs (CSS-Only) */}
        <div role="tablist" className="tabs tabs-boxed grid grid-cols-2 md:grid-cols-4 gap-4 p-2 bg-base-200 rounded-box">
          
          {/* Tab 1: Parents */}
          <input type="radio" name="role_tabs" role="tab" className="tab" aria-label="Parents" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-8 col-span-2 md:col-span-4">
            <div className="flex items-center gap-4">
              <Users size={32} className="text-primary" />
              <h3 className="text-2xl font-bold">For Our Parents</h3>
            </div>
            <p className="py-4 text-base-content/80">
              The parent portal helps you stay connected and involved in your child's school life.
            </p>
            <ul className="list-disc list-inside space-y-2 text-base-content/70">
              <li>View overall student performance.</li>
              <li>See special notes from class teachers.</li>
              <li>Request appointments.</li>
            </ul>
          </div>

          {/* Tab 2: Students */}
          <input type="radio" name="role_tabs" role="tab" className="tab" aria-label="Students" />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-8 col-span-2 md:col-span-4">
            <div className="flex items-center gap-4">
              <GraduationCap size={32} className="text-primary" />
              <h3 className="text-2xl font-bold">For Our Students</h3>
            </div>
            <p className="py-4 text-base-content/80">
              Access your entire school life from one simple dashboard.
            </p>
            <ul className="list-disc list-inside space-y-2 text-base-content/70">
              <li>Apply for scholarships.</li>
              <li>View your academic & sports achievements.</li>
              <li>Check event schedules.</li>
            </ul>
          </div>

          {/* Tab 3: Teachers */}
          <input type="radio" name="role_tabs" role="tab" className="tab" aria-label="Teachers" />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-8 col-span-2 md:col-span-4">
            <div className="flex items-center gap-4">
              <Briefcase size={32} className="text-primary" />
              <h3 className="text-2xl font-bold">For Our Teachers</h3>
            </div>
            <p className="py-4 text-base-content/80">
              Streamline your administrative tasks and manage your class with ease.
            </p>
            <ul className="list-disc list-inside space-y-2 text-base-content/70">
              <li>Request time slots for the auditorium.</li>
              <li>Track and update student achievements.</li>
              <li>Send special notices directly to parents.</li>
            </ul>
          </div>

          {/* Tab 4: Principal */}
          <input type="radio" name="role_tabs" role="tab" className="tab" aria-label="Principal" />
          <div role="tabpanel" className="tab-content bg-base-100 border border-base-300 rounded-box p-8 col-span-2 md:col-span-4">
            <div className="flex items-center gap-4">
              <Shield size={32} className="text-primary" />
              <h3 className="text-2xl font-bold">For the Administration</h3>
            </div>
            <p className="py-4 text-base-content/80">
              Get a high-level overview and full administrative control of the system.
            </p>
            <ul className="list-disc list-inside space-y-2 text-base-content/70">
              <li>Manage all student registrations.</li>
              <li>Approve or reject venue requests.</li>
              <li>Oversee scholarship and hostel data.</li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
}

export default SystemOverview;