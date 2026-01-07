import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-12">
      <div className="container mx-auto py-6 px-4 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} BelgaCycling. All rights reserved.</p>
        <p className="text-sm mt-2">Ride with passion. Predict with precision.</p>
      </div>
    </footer>
  );
};

export default Footer;