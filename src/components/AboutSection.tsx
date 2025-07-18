import React from 'react';
import { User, MapPin, Calendar, Mail, Phone, Download } from 'lucide-react';

const AboutSection: React.FC = () => {
  return (
    <div className="min-h-screen p-8 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-24 h-24 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Name</h1>
              <p className="text-lg text-gray-600 mb-4">Aspiring Data Scientist</p>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Delhi, India</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>3rd Year B.Tech Student</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>your.email@example.com</span>
                </div>
              </div>
              
              <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 mx-auto">
                <Download className="w-4 h-4" />
                Download Resume
              </button>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Skills</h3>
              <div className="space-y-4">
                {[
                  { skill: 'Python', level: 90 },
                  { skill: 'Machine Learning', level: 85 },
                  { skill: 'Data Visualization', level: 88 },
                  { skill: 'SQL', level: 80 },
                  { skill: 'R', level: 75 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{item.skill}</span>
                      <span className="text-gray-500">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - About Content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-100 to-gray-100 rounded-full text-sm font-medium text-slate-700 mb-6">
                <User className="w-4 h-4" />
                About Me
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Passionate about turning data into insights
              </h2>
              
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                  I'm a 2nd year B.Tech student in Information Technology and Mathematical Innovations 
                  at the Cluster Innovation Centre, University of Delhi. My journey in data science 
                  began with a fascination for patterns and the stories that data can tell.
                </p>
                
                <p>
                  Currently, I'm building my expertise in machine learning, statistical analysis, 
                  and data visualization while exploring the creative side through UI/UX design. 
                  I believe that great data science isn't just about algorithms—it's about 
                  communicating insights in ways that drive meaningful decisions.
                </p>
                
                <p>
                  When I'm not coding or analyzing datasets, you'll find me exploring the latest 
                  developments in generative AI, creating knowledge-sharing content, or working 
                  on design projects that blend aesthetics with functionality.
                </p>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Education</h3>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h4 className="text-lg font-semibold text-gray-900">
                    B.Tech in Information Technology and Mathematical Innovations
                  </h4>
                  <p className="text-gray-600">Cluster Innovation Centre, University of Delhi</p>
                  <p className="text-sm text-gray-500">2023 - 2027 (Expected)</p>
                  <p className="text-gray-600 mt-2">
                    Focusing on the intersection of technology and mathematics, with coursework 
                    in data structures, algorithms, statistics, and machine learning.
                  </p>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Interests & Goals</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Current Interests</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Machine Learning & AI</li>
                    <li>• Data Visualization</li>
                    <li>• UI/UX Design</li>
                    <li>• Generative AI</li>
                    <li>• Knowledge Sharing</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Future Goals</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Data Science Internships</li>
                    <li>• Open Source Contributions</li>
                    <li>• Research Publications</li>
                    <li>• Building AI Products</li>
                    <li>• Teaching & Mentoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;