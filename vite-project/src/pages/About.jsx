import React from 'react';
import { motion } from 'framer-motion';
import { FaAward, FaUsers, FaHeart, FaGlobe } from 'react-icons/fa';
import { Card } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  const values = [
    {
      icon: FaHeart,
      title: 'Passion for Excellence',
      description: 'We strive for excellence in every aspect of our service, ensuring the highest quality products and customer experience.'
    },
    {
      icon: FaGlobe,
      title: 'Global Accessibility',
      description: 'Making luxury fashion accessible worldwide with efficient shipping and localized customer support.'
    },
    {
      icon: FaAward,
      title: 'Premium Quality',
      description: 'Curating only the finest products from renowned brands, ensuring authenticity and superior craftsmanship.'
    },
    {
      icon: FaUsers,
      title: 'Community First',
      description: 'Building a community of fashion enthusiasts who share our passion for style and quality.'
    }
  ];

  const team = [
    {
      name: 'Alexandra Chen',
      role: 'Founder & Creative Director',
      image: '/src/assets/assets/new_frontend_assets/about_img.png',
      bio: 'Former Vogue editor with 15 years in luxury fashion.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Design',
      image: '/src/assets/assets/new_frontend_assets/bag1.jpg',
      bio: 'Graduate of Parsons School of Design with expertise in contemporary fashion.'
    },
    {
      name: 'Sophie Laurent',
      role: 'Sustainability Director',
      image: '/src/assets/assets/new_frontend_assets/bag2.jpg',
      bio: 'Leading our mission towards ethical and sustainable luxury fashion practices.'
    }
  ];

  return (
    <div className="min-h-screen w-full">
      {/* Values */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 tracking-wider text-neutral-900 dark:text-white">OUR VALUES</h2>
          <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-2xl mx-auto">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full bg-white dark:bg-black dark:border dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white dark:text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl mb-4 tracking-wide text-neutral-900 dark:text-white">{value.title}</h3>
                    <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-neutral-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 tracking-wider text-neutral-900 dark:text-white">MEET OUR TEAM</h2>
            <p className="text-xl text-neutral-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group text-center"
              >
                <Card className="p-8 border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-black dark:border dark:border-gray-700">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl mb-2 tracking-wide text-neutral-900 dark:text-white">{member.name}</h3>
                  <p className="text-neutral-600 dark:text-gray-300 mb-4 tracking-wide uppercase text-sm">{member.role}</p>
                  <p className="text-neutral-600 dark:text-gray-300 leading-relaxed">{member.bio}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: '1M+', label: 'Happy Customers' },
            { number: '50+', label: 'Countries Served' },
            { number: '5000+', label: 'Luxury Items' },
            { number: '99%', label: 'Satisfaction Rate' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl md:text-5xl mb-2 text-neutral-900 dark:text-white tracking-wide">{stat.number}</div>
              <div className="text-neutral-600 dark:text-gray-300 tracking-wide uppercase text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Join Section */}
      <section className="bg-neutral-900 dark:bg-gray-800 text-white py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl mb-6 tracking-wider">JOIN OUR JOURNEY</h2>
          <p className="text-xl text-neutral-300 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black hover:bg-neutral-100 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-colors tracking-wide"
              onClick={() => handleNavigation('/collection')}
            >
              EXPLORE COLLECTIONS
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border border-white text-white hover:bg-white hover:text-black dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-colors tracking-wide"
              onClick={() => handleNavigation('/contact')}
            >
              CONTACT US
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
