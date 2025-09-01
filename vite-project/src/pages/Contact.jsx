import React, { useState } from 'react';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-medium mb-4 text-gray-900 dark:text-white">GET IN TOUCH</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            We're here to help with any questions about our luxury collections or to discuss career opportunities
          </p>
        </div>
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-12 py-4 text-sm font-medium ${
              activeTab === 'contact'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow'
              : 'border border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            } rounded-full transition-all duration-200 ease-in-out min-w-[160px]`}
          >
            CONTACT US
          </button>
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-12 py-4 text-sm font-medium ${
              activeTab === 'careers'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-black shadow'
              : 'border border-gray-300 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
            } rounded-full transition-all duration-200 ease-in-out min-w-[160px]`}
          >
            CAREERS
          </button>
        </div>

        {activeTab === 'contact' ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Left Column - Contact Form */}
              <div>
                <h2 className="text-3xl font-medium mb-6">REACH OUT TO US</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-12">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Our dedicated team is ready to assist you.
                </p>

                <div className="space-y-8">
                  <div className="relative group">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-900 dark:bg-white rounded-full">
                          <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Visit Our Showroom</h3>
                          <p className="text-gray-600 dark:text-gray-300">123 Luxury Avenue</p>
                          <p className="text-gray-600 dark:text-gray-300">Fashion District, NY 10001</p>
                          <p className="text-gray-600 dark:text-gray-300">United States</p>
                          <a href="#" className="text-gray-900 dark:text-white font-medium hover:underline mt-3 inline-flex items-center gap-2">
                            Get Directions →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-900 dark:bg-white rounded-full">
                          <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Call Us</h3>
                          <p className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</p>
                          <p className="text-gray-600 dark:text-gray-300">Mon-Fri: 9AM-7PM EST</p>
                          <p className="text-gray-600 dark:text-gray-300">Sat-Sun: 10AM-6PM EST</p>
                          <a href="tel:+1-555-123-4567" className="text-gray-900 dark:text-white font-medium hover:underline mt-3 inline-flex items-center gap-2">
                            Call Now →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gray-900 dark:bg-white rounded-full">
                          <svg className="w-6 h-6 text-white dark:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2 text-gray-900 dark:text-white">Email Support</h3>
                          <p className="text-gray-600 dark:text-gray-300">support@luxe.com</p>
                          <p className="text-gray-600 dark:text-gray-300">Response within 24 hours</p>
                          <p className="text-gray-600 dark:text-gray-300">Multilingual support</p>
                          <a href="mailto:support@luxe.com" className="text-gray-900 dark:text-white font-medium hover:underline mt-3 inline-flex items-center gap-2">
                            Send Email →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">First name</label>
                      <input 
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Last name</label>
                      <input 
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Email</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Message</label>
                    <textarea 
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h2 className="text-4xl font-medium mb-4 text-gray-900 dark:text-white">JOIN OUR TEAM</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-16">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Be part of a team that's redefining luxury fashion for the modern world.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="relative group">
                <div className="bg-white dark:bg-black p-8 rounded-lg transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 group-hover:border-transparent relative transform group-hover:-translate-y-1">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 15H4V8h16v11z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Competitive Package</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Comprehensive benefits including health, dental, vision, and 401k matching
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 dark:from-gray-800/50 to-transparent rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="bg-white dark:bg-black p-8 rounded-lg transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 group-hover:border-transparent relative transform group-hover:-translate-y-1">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM13 16h-2v2h2v-2zm0-6h-2v4h2v-4z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Growth Opportunities</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Professional development programs and clear career advancement paths
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 dark:from-gray-800/50 to-transparent rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="bg-white dark:bg-black p-8 rounded-lg transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-800 group-hover:border-transparent relative transform group-hover:-translate-y-1">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mx-auto mb-6 transition-colors group-hover:bg-gray-200 dark:group-hover:bg-gray-700">
                      <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Work-Life Balance</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      Flexible schedules, remote work options, and generous PTO policy
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-100/50 dark:from-gray-800/50 to-transparent rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-6 mb-16">
              <div className="relative group">
                <div className="p-6 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1 w-full">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-gray-900 dark:text-white">Senior Fashion Designer</h3>
                      <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Design
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          New York, NY
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Full-time
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors text-sm">
                      APPLY NOW
                    </button>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-300 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lead our design team in creating cutting-edge luxury fashion pieces.
                  </p>
                  <div>
                    <h4 className="font-medium mb-3 text-black dark:text-white">REQUIREMENTS:</h4>
                    <ul className="list-disc list-inside text-neutral-600 dark:text-gray-300 space-y-1">
                      <li>5+ years in luxury fashion design</li>
                      <li>Portfolio of premium collections</li>
                      <li>Proficiency in design software</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-black/50 to-white/0 dark:to-black/0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="p-6 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1 w-full">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-black dark:text-white">Digital Marketing Manager</h3>
                      <div className="flex flex-wrap gap-4 text-neutral-600 dark:text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Marketing
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Remote
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Full-time
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors text-sm">
                      APPLY NOW
                    </button>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-300 mb-6">
                    Sed do eiusmod tempor incididunt ut labore. Drive our digital presence and customer engagement strategies.
                  </p>
                  <div>
                    <h4 className="font-medium mb-3 text-black dark:text-white">REQUIREMENTS:</h4>
                    <ul className="list-disc list-inside text-neutral-600 dark:text-gray-300 space-y-1">
                      <li>3+ years digital marketing experience</li>
                      <li>Fashion industry knowledge</li>
                      <li>Data-driven mindset</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-black/50 to-white/0 dark:to-black/0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="p-6 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1 w-full">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-black dark:text-white">Customer Experience Specialist</h3>
                      <div className="flex flex-wrap gap-4 text-neutral-600 dark:text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Customer Service
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Los Angeles, CA
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Full-time
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors text-sm">
                      APPLY NOW
                    </button>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-300 mb-6">
                    Ut labore et dolore magna aliqua. Provide exceptional service to our luxury clientele.
                  </p>
                  <div>
                    <h4 className="font-medium mb-3 text-black dark:text-white">REQUIREMENTS:</h4>
                    <ul className="list-disc list-inside text-neutral-600 dark:text-gray-300 space-y-1">
                      <li>Luxury retail experience</li>
                      <li>Excellent communication skills</li>
                      <li>Problem-solving abilities</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-black/50 to-white/0 dark:to-black/0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>

              <div className="relative group">
                <div className="p-6 bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 group-hover:shadow-lg transition-all duration-300 group-hover:border-transparent transform group-hover:-translate-y-1 w-full">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-black dark:text-white">Supply Chain Coordinator</h3>
                      <div className="flex flex-wrap gap-4 text-neutral-600 dark:text-gray-300">
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Operations
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Chicago, IL
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Contract
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors text-sm">
                      APPLY NOW
                    </button>
                  </div>
                  <p className="text-neutral-600 dark:text-gray-300 mb-6">
                    Duis aute irure dolor in reprehenderit. Optimize our global supply chain for efficiency and sustainability.
                  </p>
                  <div>
                    <h4 className="font-medium mb-3 text-black dark:text-white">REQUIREMENTS:</h4>
                    <ul className="list-disc list-inside text-neutral-600 dark:text-gray-300 space-y-1">
                      <li>Supply chain management background</li>
                      <li>International logistics experience</li>
                      <li>Sustainability focus</li>
                    </ul>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 dark:from-black/50 to-white/0 dark:to-black/0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
              </div>
            </div>

            <div className="text-center p-6 bg-neutral-50 dark:bg-gray-900 rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-medium mb-3 text-gray-900 dark:text-white">DON'T SEE YOUR ROLE?</h3>
              <p className="text-neutral-600 dark:text-gray-300 mb-4">
                We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded hover:bg-neutral-800 dark:hover:bg-gray-100 transition-colors">
                SEND YOUR RESUME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
