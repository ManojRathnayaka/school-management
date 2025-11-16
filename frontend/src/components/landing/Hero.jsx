import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import MahamayaImage from "../../assets/Mahamaya.jpg";

function Hero() {
  return (
    <div
      id="hero"
      className="hero min-h-screen"
      style={{
        backgroundImage: `url(${MahamayaImage})`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-2xl">
          <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
            Mahamaya Girls' College School Management System
          </h1>
          <p className="mb-8 text-lg md:text-xl leading-relaxed">
            Your central hub for managing academics, school events, and student
            activities. Please log in with your provided credentials to access
            your dashboard.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
