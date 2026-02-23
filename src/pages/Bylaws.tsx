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
        description="MIT Gen AI Global Bylaws covering membership, distinguished leadership appointments, and governance. Effective April 01, 2025."
        keywords={['Gen AI Global', 'bylaws', 'governance', 'membership', 'AI community', 'nonprofit']}
      />
      <section className="pt-16 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>

            <h1 className="text-4xl font-bold mb-4">MIT Gen AI Global Bylaws</h1>
            <p className="text-xl text-muted-foreground mb-2">(Membership, Distinguished Leadership Appointments, and Governance)</p>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-1"><strong>Version:</strong> v3.0</p>
              <p className="text-muted-foreground mb-1"><strong>Effective Date:</strong> April 01, 2025</p>
              <p className="text-muted-foreground mb-8"><strong>Adopted By:</strong> Founders Council of MIT Gen AI Global on April 01, 2025</p>

              {/* Section 1 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">1) Name, Status, and Purpose</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Name</h3>
              <p className="text-muted-foreground mb-4">The organization shall be known as MIT Gen AI Global (the "Organization").</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Nonprofit Status</h3>
              <p className="text-muted-foreground mb-4">MIT Gen AI Global is a nonprofit network dedicated to advancing ethical, inclusive, and practical applications of artificial intelligence.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Mission</h3>
              <p className="text-muted-foreground mb-4">The mission of MIT Gen AI Global is to democratize access to artificial intelligence education and foster the responsible adoption of AI technologies worldwide, bridging academia, industry, and community learning to create equitable access to AI knowledge and tools.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">1.4 Organizational Focus</h3>
              <p className="text-muted-foreground mb-4">MIT Gen AI Global operates as a global community of thought leaders, educators, and innovators that drives initiatives to promote:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>AI literacy</li>
                <li>Open-source collaboration</li>
                <li>Sustainable digital transformation</li>
                <li>Responsible AI ecosystems</li>
                <li>Empowerment of underserved communities through accessible, high-quality AI education</li>
              </ul>

              {/* Section 2 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">2) Membership</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Member (Open Membership)</h3>
              <p className="text-muted-foreground mb-4">Membership is open to any individual who registers or joins the community and agrees to comply with these Bylaws and the Code of Conduct.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Member Participation</h3>
              <p className="text-muted-foreground mb-4">Members may participate in:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Events, programs, and learning initiatives</li>
                <li>Working groups and community projects</li>
                <li>Volunteer opportunities and community collaboration efforts</li>
              </ul>
              <p className="text-muted-foreground mb-4">Membership does not grant governance authority or leadership appointment.</p>

              {/* Section 3 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">3) Distinguished Members (Elite Membership Category)</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Definition</h3>
              <p className="text-muted-foreground mb-4">A Distinguished Member is an individual admitted to an elite membership category of the Organization based on sustained and nationally or internationally recognized achievements in artificial intelligence, technology leadership, education, or closely related fields. Distinguished Members are selected for accomplishments that place them among a small percentage of top professionals in their field.</p>
              <p className="text-muted-foreground mb-4">Distinguished Member status is not honorary or automatic and is granted only through a formal selection process with clearly defined evaluation criteria.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Scope of Distinguished Membership</h3>
              <p className="text-muted-foreground mb-4">Distinguished Members may serve in one of the following leadership capacities:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Directors (e.g., Program Director, Partnerships Director, Community Director, Operations Director, Technology Director, Finance Director)</li>
                <li>C-Suite Officers (e.g., CEO/President, COO, CTO, CFO, Chief Community Officer, Chief Ethics Officer)</li>
              </ul>
              <p className="text-muted-foreground mb-4">Appointment to any Director or C-Suite position confers Distinguished Member status. Distinguished Member status may also be granted independently of a specific role if approved by the Founders Council.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Selection and Exclusivity</h3>
              <p className="text-muted-foreground mb-4">Distinguished Membership is limited in number and not available through open application, payment, or volunteer service. Nomination does not guarantee appointment.</p>
              <p className="text-muted-foreground mb-4"><strong>Selection Process:</strong> All candidates for Distinguished Membership or C-Suite/Director roles must undergo a structured evaluation by the Evaluation Board, using clear criteria including:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Sustained and recognized achievements in AI or related fields</li>
                <li>Demonstrated leadership and strategic impact</li>
                <li>Operational and programmatic execution</li>
                <li>Technical or intellectual contributions</li>
                <li>Ethics, integrity, and adherence to responsible AI principles</li>
              </ul>
              <p className="text-muted-foreground mb-4">The Evaluation Board recommends candidates to the Founders Council, which makes the final approval.</p>
              <p className="text-muted-foreground mb-4">The process must be transparent, documented, and consistent, with a record of nominations, scoring, and outcomes to demonstrate selectivity.</p>

              {/* Section 4 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">4) Governance Bodies</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Founders Council</h3>
              <p className="text-muted-foreground mb-4">The Founders Council is the Organization's highest governing authority and is responsible for:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Approving and amending these Bylaws</li>
                <li>Appointing and overseeing the Evaluation Board</li>
                <li>Making final decisions on Distinguished Member (Director/C-Suite) appointments and removals</li>
                <li>Resolving escalations related to ethics, conduct, and governance matters</li>
              </ul>
              <p className="text-muted-foreground mb-4"><strong>Voting:</strong> Simple majority unless otherwise specified.<br /><strong>Quorum:</strong> Majority of Founders Council members.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Evaluation Board</h3>
              <p className="text-muted-foreground mb-4">The Evaluation Board is responsible for evaluating candidates for Distinguished Membership and leadership roles and making recommendations to the Founders Council.</p>
              <p className="text-muted-foreground mb-4"><strong>Composition:</strong> The Evaluation Board shall consist of individuals with recognized expertise and senior standing in artificial intelligence, technology, education, industry, and governance. Members should demonstrate:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Significant professional achievements</li>
                <li>Independence from candidates under review</li>
                <li>Ability to assess excellence and impact at a national or international level</li>
              </ul>
              <p className="text-muted-foreground mb-4"><strong>Quorum:</strong> Majority of voting members.<br /><strong>Term:</strong> 1 year, renewable.<br /><strong>Independence:</strong> Members must adhere to conflict-of-interest rules (Section 7).</p>

              {/* Section 5 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">5) Distinguished Member Evaluation Criteria</h2>
              <p className="text-muted-foreground mb-4">Candidates for Distinguished Membership (including Directors and C-Suite Officers) must present evidence of outstanding achievement across the following categories:</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Sustained Excellence and Recognition</h3>
              <p className="text-muted-foreground mb-4">Documented accomplishments demonstrating national or international recognition in artificial intelligence, technology leadership, education, or related fields.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Leadership and Strategic Impact</h3>
              <p className="text-muted-foreground mb-4">Demonstrated ability to shape direction, strategy, and large-scale outcomes for organizations, communities, or initiatives of significance.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Operational and Programmatic Execution</h3>
              <p className="text-muted-foreground mb-4">Proven record of building, scaling, or governing impactful programs, platforms, or institutions.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.4 Technical or Intellectual Contributions</h3>
              <p className="text-muted-foreground mb-4">Evidence of original contributions, frameworks, systems, research, products, or deployments that have influenced practice, education, or adoption of AI or related technologies.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.5 Ethics, Integrity, and Responsible AI</h3>
              <p className="text-muted-foreground mb-4">Demonstrated commitment to ethical conduct, responsible AI principles, transparency, fairness, and public trust.</p>

              {/* Section 6 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">6) Distinguished Member Appointment Process</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Pathways</h3>
              <p className="text-muted-foreground mb-4">Candidates may be considered through:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Nomination by the Founders Council</li>
                <li>Nomination by the Evaluation Board</li>
                <li>Nomination by Distinguished Members (if enabled)</li>
                <li>Direct invitation by the Founders Council</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Candidate Submission Package</h3>
              <p className="text-muted-foreground mb-4">A candidate must provide:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Professional biography and leadership profile</li>
                <li>Description of proposed role and intended impact</li>
                <li>Evidence aligned with Section 5 criteria</li>
                <li>References (recommended)</li>
                <li>Conflict-of-interest disclosures</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Evaluation Steps</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Screening for eligibility and completeness</li>
                <li>Evaluation Board review using structured scoring and deliberation</li>
                <li>Interview (required for C-Suite roles)</li>
                <li>Evaluation Board recommendation (Approve / Defer / Decline)</li>
                <li>Founders Council final decision (Approve / Defer / Decline)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.4 Documentation</h3>
              <p className="text-muted-foreground mb-4">The entire selection process must be documented, including nominations, scoring, and final decisions, to demonstrate transparency, independence, and selectivity.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.5 Outcomes</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li><strong>Approve:</strong> Distinguished Membership and leadership appointment granted</li>
                <li><strong>Defer:</strong> Reconsideration after 60–180 days</li>
                <li><strong>Decline:</strong> Reconsideration after 12 months (optional)</li>
              </ul>

              {/* Section 7 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">7) Conflict of Interest and Confidentiality</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Conflict of Interest (COI)</h3>
              <p className="text-muted-foreground mb-4">Any evaluator must recuse themselves where impartiality could reasonably be questioned, including:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Close personal relationships</li>
                <li>Direct reporting lines or financial dependence</li>
                <li>Recent close collaboration (e.g., cofounder/coauthor within 24 months)</li>
                <li>Competitive or adversarial conflicts</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Confidentiality</h3>
              <p className="text-muted-foreground mb-4">Candidate materials, discussions, and evaluation outcomes are confidential except for publicly announced appointments.</p>

              {/* Section 8 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">8) Terms, Performance, and Removal</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Terms</h3>
              <p className="text-muted-foreground mb-4"><strong>Director roles:</strong> 1–2 years.<br /><strong>C-Suite roles:</strong> 1–2 years.<br />Renewal is subject to Founders Council review.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Performance Expectations</h3>
              <p className="text-muted-foreground mb-4">Distinguished Members must:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Uphold mission, values, and responsible AI principles</li>
                <li>Execute responsibilities with accountability and professionalism</li>
                <li>Avoid conflicts that compromise integrity or trust</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Removal</h3>
              <p className="text-muted-foreground mb-4">A Distinguished Member may be removed for:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Misconduct or Code of Conduct violations</li>
                <li>Breach of duty, misuse of authority, or reputational harm</li>
                <li>Repeated non-performance</li>
              </ul>
              <p className="text-muted-foreground mb-4"><strong>Process:</strong> Written notice, opportunity to respond, and Founders Council vote.</p>

              {/* Section 9 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">9) Code of Conduct and Member Discipline</h2>
              <p className="text-muted-foreground mb-4">MIT Gen AI Global maintains a community Code of Conduct applicable to all Members.</p>
              <p className="text-muted-foreground mb-4">Possible actions include:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Warning</li>
                <li>Temporary suspension</li>
                <li>Removal from the community</li>
                <li>Revocation of Distinguished Member status (if applicable)</li>
              </ul>
              <p className="text-muted-foreground mb-4">A fair process will be followed with notice and an opportunity to respond.</p>

              {/* Section 10 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">10) Amendments</h2>
              <p className="text-muted-foreground mb-4">These Bylaws may be amended by a vote of the Founders Council. Amendments take effect immediately unless otherwise stated.</p>

              {/* Section 11 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">11) Effective Date</h2>
              <p className="text-muted-foreground mb-4">These Bylaws are effective as of April 01, 2025.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bylaws;
