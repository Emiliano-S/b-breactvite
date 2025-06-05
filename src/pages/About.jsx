import React from 'react';
import { Card } from '../components/ui/Card';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Users, Award, Heart, Clock } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">About Sunset B&B</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your home away from home, where comfort meets elegance and every stay becomes a cherished memory.
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, Sunset B&B began as a dream to create a welcoming space where travelers could experience the warmth of home while exploring Beach City's beautiful coastline.
            </p>
            <p className="text-gray-600 mb-4">
              What started as a small family-run establishment has grown into one of the area's most beloved bed & breakfasts, known for our exceptional hospitality and attention to detail.
            </p>
            <p className="text-gray-600">
              Today, we continue to welcome guests from around the world, sharing our passion for creating unforgettable experiences and lasting memories.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="rounded-lg overflow-hidden"
          >
            <img 
              src="/images/about-hero.jpg" 
              alt="Sunset B&B" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Heart,
                title: 'Hospitality',
                description: 'We treat every guest like family, ensuring your comfort is our top priority.'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We strive for excellence in every detail, from our rooms to our breakfast.'
              },
              {
                icon: Users,
                title: 'Community',
                description: "We're proud to be part of the Beach City community and support local businesses."
              },
              {
                icon: Clock,
                title: 'Tradition',
                description: 'We blend timeless hospitality traditions with modern comfort and convenience.'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="text-center h-full">
                  <value.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team works tirelessly to ensure your stay is perfect. From our housekeeping staff to our breakfast chef, everyone at Sunset B&B is committed to making your visit memorable.
          </p>
        </div>
      </div>
    </div>
  );
};