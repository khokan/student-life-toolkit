import React from 'react';
import FeatureCard from '../components/FeatureCard';
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  ClipboardList,
  Brain,
  Target,
  BarChart3,
  BookOpen
} from 'lucide-react';

const features = [
  { 
    title: 'Class Schedule', 
    description: 'Manage subjects, timings, and instructors with color-coded system', 
    to: '/schedule',
    icon: <Calendar className="w-5 h-5" />,
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    title: 'Budget Tracker', 
    description: 'Monitor income, expenses, and financial goals with visual analytics', 
    to: '/budget',
    icon: <DollarSign className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-500'
  },
  { 
    title: 'Exam Q&A', 
    description: 'Generate and practice with randomized exam questions and answers', 
    to: '/exam',
    icon: <FileText className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    title: 'Study Planner', 
    description: 'Organize tasks, deadlines, and priorities with smart scheduling', 
    to: '/planner',
    icon: <ClipboardList className="w-5 h-5" />,
    gradient: 'from-orange-500 to-amber-500'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
            <Brain className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Student Life Toolkit
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your academic journey with powerful tools designed for modern students. 
            Everything you need to succeed, in one place.
          </p>
        </div>

        {/* Stats Banner */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-12 border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-500">Integrated Tools</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">100%</div>
              <div className="text-sm text-gray-500">Productivity Boost</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">24/7</div>
              <div className="text-sm text-gray-500">Accessibility</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">∞</div>
              <div className="text-sm text-gray-500">Possibilities</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ready to Transform Your Study Experience?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join thousands of students who are already achieving academic excellence with our suite of tools.
            </p>
            <button className="btn btn-primary rounded-full px-8 gap-2">
              <BookOpen className="w-4 h-4" />
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}