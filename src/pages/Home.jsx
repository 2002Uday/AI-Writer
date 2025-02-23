import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { LuBrainCircuit } from "react-icons/lu";
import { TbScript, TbPhotoVideo } from "react-icons/tb";

const Home = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const FeatureCard = ({ title, description, icon, delay }) => {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <div
        ref={ref}
        className={`p-8 bg-white rounded-2xl shadow-xl transform transition-all duration-500 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } hover:scale-105 hover:shadow-2xl`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="w-16 h-16 bg-neutral-900 rounded-xl flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-neutral-900">
      {/* Hero Section */}
      <section className="container mx-auto pt-36 px-6 py-20">
        <div className="flex flex-col items-center text-center">
          <h1
            className={`text-5xl md:text-7xl font-bold text-white mb-8 transition-all duration-1000 ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            Transform Your
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Video Production
            </span>
          </h1>

          <p
            className={`text-xl text-orange-50 mb-12 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10"
            }`}
          >
            AI-powered scriptwriting, storyboarding, and content creation.
            Streamline your workflow and unleash creativity like never before.
          </p>
          <Link to="/dashboard">
            <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg transform transition-all duration-300">
              Start Creating Now
            </button>
          </Link>

          <div className="mt-20 animate-bounce">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="AI Brainstorming"
            description="Generate creative ideas and concepts in seconds with our advanced AI models"
            icon={<LuBrainCircuit className="text-3xl text-orange-400" />}
            delay={100}
          />
          <FeatureCard
            title="Smart Scriptwriting"
            description="Create professional scripts with automatic formatting and style suggestions"
            icon={<TbScript className="text-3xl text-orange-400" />}
            delay={300}
          />
          <FeatureCard
            title="Dynamic Storyboarding"
            description="Visualize your story with AI-generated scenes and shot recommendations"
            icon={<TbPhotoVideo className="text-3xl text-orange-400" />}
            delay={500}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black/20 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Ready to Revolutionize Your
            <br />
            Content Creation Process?
          </h2>
          <Link to="/dashboard">
            <button className="bg-transparent border-2 border-amber-400 text-amber-400 px-12 py-4 rounded-xl font-bold text-lg transform transition-all duration-300 hover:scale-105 hover:bg-amber-400 hover:text-white hover:border-amber-400">
              Try WriterAI Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
