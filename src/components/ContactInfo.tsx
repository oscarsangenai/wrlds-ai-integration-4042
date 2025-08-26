
import React from 'react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[15px] md:py-[25px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Judges for the Hackathon
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            To be revealed soon
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Judge 1',
              designation: 'AI Research Director',
              linkedin: 'https://linkedin.com/in/judge1'
            },
            {
              name: 'Judge 2',
              designation: 'Innovation Lead',
              linkedin: 'https://linkedin.com/in/judge2'
            },
            {
              name: 'Judge 3',
              designation: 'Tech Ethics Advisor',
              linkedin: 'https://linkedin.com/in/judge3'
            },
            {
              name: 'Judge 4',
              designation: 'Community Builder',
              linkedin: 'https://linkedin.com/in/judge4'
            }
          ].map((judge, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-6 border border-gray-700 text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl text-gray-400">?</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{judge.name}</h3>
              <p className="text-gray-600 mb-4">{judge.designation}</p>
               <a 
                href={judge.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-8 h-8 bg-[#0077B5] text-white rounded hover:bg-[#005885] transition-colors"
                aria-label={`${judge.name} LinkedIn Profile`}
              >
                in
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
