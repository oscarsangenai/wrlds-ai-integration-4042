import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const Bylaws = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <SEO
        title="Bylaws | Gen AI Global"
        description="Official bylaws of MIT Gen AI Global covering membership, distinguished leadership appointments, and governance (v4.0)."
      />
      <section className="pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold mb-4">MIT Gen AI Global Bylaws</h1>
            <p className="text-gray-600 italic mb-8">
              (Membership, Distinguished Leadership Appointments, and Governance)
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-2"><strong>Version:</strong> v4.0</p>
              <p className="text-gray-600 mb-2"><strong>Effective Date:</strong> April 01, 2025</p>
              <p className="text-gray-600 mb-6"><strong>Adopted By:</strong> Founders Council of MIT Gen AI Global</p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">1) Name, Status, and Purpose</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Name</h3>
              <p className="text-gray-600 mb-4">
                The organization shall be known as MIT Gen AI Global (the "Organization").
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Nonprofit Status</h3>
              <p className="text-gray-600 mb-4">
                MIT Gen AI Global is a nonprofit network dedicated to advancing ethical, inclusive, and accessible Generative AI worldwide.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Purpose</h3>
              <p className="text-gray-600 mb-4">The Organization exists to:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Foster a global peer-driven community of Generative AI learners, practitioners, and contributors.</li>
                <li>Promote ethical, inclusive, and accessible AI education.</li>
                <li>Provide knowledge sharing, mentorship, and collaborative opportunities.</li>
                <li>Recognize outstanding contributions through Distinguished Leadership Appointments.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2) Membership</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 General Membership</h3>
              <p className="text-gray-600 mb-4">
                Membership is open to individuals who complete the MIT Generative AI course and submit the official Gen AI Global registration form.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Member Rights</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Access to community channels and resources.</li>
                <li>Participation in events, projects, and discussions.</li>
                <li>Opportunities to collaborate, mentor, and be mentored.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Member Responsibilities</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Adhere to the community Code of Conduct.</li>
                <li>Engage respectfully and constructively.</li>
                <li>Support the mission of ethical, inclusive AI.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3) Distinguished Leadership Appointments</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Purpose</h3>
              <p className="text-gray-600 mb-4">
                Distinguished Leadership Appointments recognize Members who have made exceptional contributions to the Organization and the broader Generative AI ecosystem.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Categories</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Distinguished Member</strong> — recognized for sustained contributions to the community.</li>
                <li><strong>Distinguished Fellow</strong> — recognized for thought leadership and impact in Generative AI.</li>
                <li><strong>Distinguished Advisor</strong> — recognized for strategic guidance to the Organization.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Annual Cap</h3>
              <p className="text-gray-600 mb-4">
                A maximum of ten (10) Distinguished Leadership Appointments may be conferred in any calendar year, across all categories combined.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4) Evaluation Board</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Composition</h3>
              <p className="text-gray-600 mb-4">
                The Evaluation Board shall consist of members of the Founders Council and selected Distinguished Members or Fellows.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Credential Requirements</h3>
              <p className="text-gray-600 mb-4">
                Evaluation Board members must possess demonstrated expertise in Generative AI, ethics, education, or related fields, and must have a verifiable record of professional or academic contributions.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Responsibilities</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Review nominations for Distinguished Leadership Appointments.</li>
                <li>Conduct fair, transparent, and merit-based evaluations.</li>
                <li>Recommend candidates to the Founders Council for final approval.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5) Nomination Process</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Nominations may be submitted by any Member in good standing.</li>
                <li>Self-nominations are permitted.</li>
                <li>Nominations must include a statement of contributions and supporting evidence.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6) Selection and Approval</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Mandatory Review</h3>
              <p className="text-gray-600 mb-4">
                All candidates for Distinguished Leadership Appointments must undergo review by the Evaluation Board. No direct-invitation pathway shall bypass this review.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Final Approval</h3>
              <p className="text-gray-600 mb-4">
                Final approval of all appointments rests with the Founders Council.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7) Term and Renewal</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Distinguished Leadership Appointments are granted for a term of two (2) years.</li>
                <li>Appointments may be renewed based on continued contribution and review.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8) Governance</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Founders Council</h3>
              <p className="text-gray-600 mb-4">
                The Founders Council provides strategic direction, oversees governance, and holds final authority on appointments and amendments.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Decision Making</h3>
              <p className="text-gray-600 mb-4">
                Decisions of the Founders Council shall be made by majority vote.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9) Code of Conduct and Disciplinary Action</h2>
              <p className="text-gray-600 mb-4">
                MIT Gen AI Global maintains a community Code of Conduct applicable to all Members.
              </p>
              <p className="text-gray-600 mb-4">Possible actions include:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Warning</li>
                <li>Temporary suspension</li>
                <li>Removal from the community</li>
                <li>Revocation of Distinguished Member status (if applicable)</li>
              </ul>
              <p className="text-gray-600 mb-4">
                A fair process will be followed with notice and an opportunity to respond.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10) Amendments</h2>
              <p className="text-gray-600 mb-4">
                These Bylaws may be amended by a vote of the Founders Council. Amendments take effect immediately unless otherwise stated.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11) Version History</h2>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>v3.0</strong> — Initial adopted version (April 01, 2025).</li>
                <li><strong>v4.0</strong> — Amended to add annual cap on Distinguished Appointments, strengthen Evaluation Board credential requirements, and remove direct-invitation pathway.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">12) Effective Date</h2>
              <p className="text-gray-600 mb-4">
                These Bylaws are effective as of April 01, 2025.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bylaws;
