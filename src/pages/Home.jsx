import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useRooms } from '../hooks/useRooms';
import { RoomCard } from '../components/rooms/RoomCard';
import { 
  MapPin, 
  Star, 
  Coffee, 
  Wifi, 
  Car, 
  ArrowRight 
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export const Home = () => {
  const { rooms, loading } = useRooms();
  const featuredRooms = rooms.slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-cover bg-center" 
        style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">
              Welcome to Sunset B&B
            </h1>
            <p className="text-xl mb-8">
              Experience comfort and luxury in the heart of Beach City. 
              Your perfect home away from home awaits.
            </p>
            <Link to="/rooms">
              <Button size="large" variant="primary">
                Explore Our Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Sunset B&B?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer more than just a place to stay. Experience hospitality at its finest.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Prime Location',
                description: 'Walking distance to beach and downtown attractions'
              },
              {
                icon: Coffee,
                title: 'Complimentary Breakfast',
                description: 'Start your day with our delicious homemade breakfast'
              },
              {
                icon: Wifi,
                title: 'High-Speed WiFi',
                description: 'Stay connected with fast and reliable internet'
              },
              {
                icon: Car,
                title: 'Free Parking',
                description: 'Secure parking available for all guests'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full">
                  <feature.icon className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Rooms</h2>
            <p className="text-gray-600">Discover our most popular accommodations</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="outline" size="large">
                View All Rooms
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Guests Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                rating: 5,
                comment: 'Amazing experience! The room was clean, comfortable, and the breakfast was delicious.'
              },
              {
                name: 'Mike Chen',
                rating: 5,
                comment: 'Perfect location and wonderful staff. Will definitely come back!'
              },
              {
                name: 'Emily Brown',
                rating: 5,
                comment: 'Best B&B experience ever. Felt like home away from home.'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};