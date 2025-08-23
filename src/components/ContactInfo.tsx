
import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[15px] md:py-[25px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
            Hackathon Judges
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Judges for the Hackathon
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            To be revealed soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Judge 1 - To be revealed */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl text-gray-400">?</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Judge 1</h3>
              <p className="text-gray-600 mb-4">To be revealed</p>
            </div>
          </div>

          {/* Judge 2 - To be revealed */}
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-4 bg-gray-200 flex items-center justify-center">
                <span className="text-6xl text-gray-400">?</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Judge 2</h3>
              <p className="text-gray-600 mb-4">To be revealed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
