import React from "react";
import { ArrowRight, Video, List, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
  return (
    <div className=" px-14 bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Create Script and Video Content
            <span className="text-blue-600"> with AI</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Transform your video production workflow with AI-powered
            Brainstorming, Scriptwriting, and Storyboarding Using AI, Save time
            and enhance your creative process.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Try Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={<Video className="h-8 w-8 text-blue-600" />}
          title="AI Shot Generation"
          description="Get intelligent shot suggestions based on your scene descriptions and requirements."
        />
        <FeatureCard
          icon={<List className="h-8 w-8 text-blue-600" />}
          title="Shot Organization"
          description="Easily organize and rearrange your shots in a clear, professional format."
        />
        <FeatureCard
          icon={<User className="h-8 w-8 text-blue-600" />}
          title="Team Collaboration"
          description="Share your shot lists with team members and collaborate in real-time."
        />
      </div>
    </div>
  );
};

export default Home;
