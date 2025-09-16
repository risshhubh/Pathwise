import React, { useState } from 'react';
import { HelpCircle, Book, MessageCircle, Video, ChevronDown, ChevronUp, Search } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('faq');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      question: "How do I prepare for an AI interview?",
      answer: "To prepare for an AI interview, review common interview questions in your field, practice speaking clearly, ensure you have a stable internet connection, and find a quiet environment. Our system uses advanced AI to evaluate your responses based on content, clarity, and professional demeanor."
    },
    {
      question: "What types of interviews are available?",
      answer: "We offer various interview types including technical interviews for different programming languages, behavioral interviews, and role-specific interviews for positions like frontend developer, backend developer, full-stack developer, and more."
    },
    {
      question: "How is my interview evaluated?",
      answer: "Your interview is evaluated based on multiple factors including technical accuracy, communication skills, problem-solving ability, and professional conduct. Our AI provides detailed feedback and scoring for each aspect of your responses."
    },
    {
      question: "Can I review my past interviews?",
      answer: "Yes, you can access all your past interviews from your profile dashboard. Each interview includes a detailed breakdown of your performance, feedback, and areas for improvement."
    },
    {
      question: "What if I encounter technical issues during an interview?",
      answer: "If you experience technical issues, you can pause the interview and resume when the issues are resolved. Contact our support team for immediate assistance if needed."
    }
  ];

  const guides = [
    {
      title: "Getting Started Guide",
      description: "Learn how to set up your profile and start your first interview",
      icon: <Book size={24} className="text-blue-400" />
    },
    {
      title: "Interview Best Practices",
      description: "Tips and tricks for succeeding in AI interviews",
      icon: <Video size={24} className="text-purple-400" />
    },
    {
      title: "Technical Requirements",
      description: "Ensure your system is ready for the interview",
      icon: <MessageCircle size={24} className="text-green-400" />
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Help Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveSection('faq')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'faq'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveSection('guides')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'guides'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Guides
          </button>
        </div>

        {/* FAQ Section */}
        {activeSection === 'faq' && (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp size={20} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-gray-750 border-t border-gray-700">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Guides Section */}
        {activeSection === 'guides' && (
          <div className="grid gap-6 md:grid-cols-2">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-700 rounded-lg">
                    {guide.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{guide.title}</h3>
                    <p className="text-gray-400 text-sm">{guide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold mb-4">Still need help?</h2>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors">
            <HelpCircle size={20} />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Help;