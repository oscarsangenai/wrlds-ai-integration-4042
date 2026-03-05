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
        description="MIT Gen AI Global Bylaws v4.0 covering membership, distinguished leadership appointments, and governance. Effective April 01, 2025, amended February 2026."
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
              <p className="text-muted-foreground mb-1"><strong>Version:</strong> v4.0</p>
              <p className="text-muted-foreground mb-1"><strong>Effective Date:</strong> April 01, 2025 | <strong>Amended:</strong> February 2026</p>
              <p className="text-muted-foreground mb-8"><strong>Adopted By:</strong> Founders Council of MIT Gen AI Global</p>

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
              <p className="text-muted-foreground mb-4">Membership does not grant governance authority or leadership appointment. Open Membership and Distinguished Membership are entirely distinct categories. Distinguished Membership is not a progression from Open Membership and cannot be earned through participation, tenure, duration of service, payment, or volunteer contribution to the Organization.</p>

              {/* Section 3 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">3) Distinguished Members (Elite Membership Category)</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Definition</h3>
              <p className="text-muted-foreground mb-4">A Distinguished Member is an individual admitted to an elite membership category of the Organization based on sustained and nationally or internationally recognized achievements in artificial intelligence, technology leadership, education, or closely related fields. Distinguished Members are selected for accomplishments that place them among a small percentage of top professionals in their field nationally or internationally.</p>
              <p className="text-muted-foreground mb-4">Distinguished Member status is not honorary or automatic and is granted only through a formal selection process with clearly defined evaluation criteria. It is not available through open application, payment, volunteer service, or tenure within the Organization. Nomination does not guarantee appointment.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Scope of Distinguished Membership</h3>
              <p className="text-muted-foreground mb-4">Distinguished Membership is exclusively conferred upon C-Suite Officers of the Organization. Director-level roles are leadership positions within the Organization but do not confer Distinguished Member status.</p>
              <p className="text-muted-foreground mb-4">Eligible C-Suite positions include:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>CEO / President</li>
                <li>Chief Operating Officer (COO)</li>
                <li>Chief Technology Officer (CTO)</li>
                <li>Chief Financial Officer (CFO)</li>
                <li>Chief Community Officer</li>
                <li>Chief Ethics Officer</li>
              </ul>
              <p className="text-muted-foreground mb-4">Appointment to any C-Suite position confers Distinguished Member status, provided the candidate has completed the full Evaluation Board review and approval process under Section 6. Distinguished Member status may also be granted independently of a specific role if approved by the Founders Council, provided the candidate still completes the full Evaluation Board review process under Section 6.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Selection, Exclusivity, and Selectivity</h3>
              <p className="text-muted-foreground mb-4">Distinguished Membership is limited in number and highly selective. The following constraints apply:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>No more than ten (10) Distinguished Members may be appointed in any calendar year, absent extraordinary circumstances documented by the Founders Council.</li>
                <li>Distinguished Membership is granted to a small fraction of nominees. The Evaluation Board shall maintain records demonstrating that the majority of nominations result in deferral or decline.</li>
                <li>All candidates must undergo structured evaluation by the Evaluation Board using clear, documented criteria (Section 5). The Evaluation Board recommends candidates to the Founders Council, which makes the final approval.</li>
                <li>The process must be transparent, documented, and consistent, with a record of all nominations, scoring, deliberations, and final decisions.</li>
              </ul>
              <p className="text-muted-foreground mb-4">Evaluation criteria include:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Sustained and recognized achievements in AI or related fields, demonstrating national or international standing</li>
                <li>Demonstrated leadership and strategic impact</li>
                <li>Operational and programmatic execution</li>
                <li>Technical or intellectual contributions</li>
                <li>Ethics, integrity, and adherence to responsible AI principles</li>
              </ul>

              {/* Section 4 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">4) Governance Bodies</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Founders Council</h3>
              <p className="text-muted-foreground mb-4">The Founders Council is the Organization's highest governing authority and is responsible for:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Approving and amending these Bylaws</li>
                <li>Appointing and overseeing the Evaluation Board</li>
                <li>Making final decisions on Distinguished Member (C-Suite) appointments and removals</li>
                <li>Resolving escalations related to ethics, conduct, and governance matters</li>
              </ul>
              <p className="text-muted-foreground mb-4"><strong>Voting:</strong> Simple majority unless otherwise specified.<br /><strong>Quorum:</strong> Majority of Founders Council members.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Evaluation Board</h3>
              <p className="text-muted-foreground mb-4">The Evaluation Board is responsible for evaluating candidates for Distinguished Membership and leadership roles and making recommendations to the Founders Council. The Evaluation Board is the primary safeguard ensuring that Distinguished Membership reflects genuine excellence.</p>
              <p className="text-muted-foreground mb-4"><strong>Composition:</strong> The Evaluation Board shall consist of no fewer than three (3) individuals who hold national or international recognition in their respective fields, demonstrated by one or more of the following:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Published research, patents, or peer-reviewed contributions in artificial intelligence, technology, or related disciplines</li>
                <li>Senior or Fellow-level membership in a recognized professional body (e.g., IEEE, ACM, NAE)</li>
                <li>Executive leadership or governance roles at nationally or internationally recognized academic institutions, research centers, or technology organizations</li>
                <li>Awards, honors, or recognitions at a national or international level in their field</li>
              </ul>
              <p className="text-muted-foreground mb-4">The Founders Council shall document the credentials of each Evaluation Board member at the time of appointment and make this record available as part of the selection process documentation.</p>
              <p className="text-muted-foreground mb-4"><strong>Quorum:</strong> Majority of voting members.<br /><strong>Term:</strong> 1 year, renewable.<br /><strong>Independence:</strong> Members must adhere to conflict-of-interest rules (Section 7). No Evaluation Board member may evaluate a candidate with whom they have a disqualifying conflict of interest.</p>

              {/* Section 5 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">5) Distinguished Member Evaluation Criteria</h2>
              <p className="text-muted-foreground mb-4">Candidates for Distinguished Membership (C-Suite Officers) must present evidence of outstanding achievement across the following categories. Candidates must demonstrate that their achievements place them in the top tier of professionals nationally or internationally in their field.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Sustained Excellence and Recognition</h3>
              <p className="text-muted-foreground mb-4">Documented accomplishments demonstrating national or international recognition in artificial intelligence, technology leadership, education, or related fields. Evidence may include awards, honors, publications, patents, media coverage, speaking engagements at recognized conferences, or endorsements from credentialed peers.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Leadership and Strategic Impact</h3>
              <p className="text-muted-foreground mb-4">Demonstrated ability to shape direction, strategy, and large-scale outcomes for organizations, communities, or initiatives of significance at a regional, national, or international level.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Operational and Programmatic Execution</h3>
              <p className="text-muted-foreground mb-4">Proven record of building, scaling, or governing impactful programs, platforms, or institutions with measurable results and demonstrated accountability.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.4 Technical or Intellectual Contributions</h3>
              <p className="text-muted-foreground mb-4">Evidence of original contributions, frameworks, systems, research, products, or deployments that have influenced practice, education, or adoption of AI or related technologies beyond the candidate's immediate organization.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">5.5 Ethics, Integrity, and Responsible AI</h3>
              <p className="text-muted-foreground mb-4">Demonstrated commitment to ethical conduct, responsible AI principles, transparency, fairness, and public trust. No record of professional misconduct, regulatory violations, or actions contrary to the Organization's values.</p>

              {/* Section 6 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">6) Distinguished Member Appointment Process</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Pathways</h3>
              <p className="text-muted-foreground mb-4">Candidates may be considered through the following pathways. All pathways, without exception, require completion of the full Evaluation Board review and scoring process described in Section 6.3 before any appointment may be made:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Nomination by the Founders Council</li>
                <li>Nomination by the Evaluation Board</li>
                <li>Nomination by existing Distinguished Members (if enabled by the Founders Council)</li>
                <li>Direct invitation by the Founders Council — Note: A direct invitation initiates candidacy only. The invited candidate must still complete the full Evaluation Board review and scoring process. No appointment may be made solely on the basis of a Founders Council invitation without Evaluation Board review.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Candidate Submission Package</h3>
              <p className="text-muted-foreground mb-4">A candidate must provide:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Professional biography and leadership profile</li>
                <li>Description of proposed role and intended impact</li>
                <li>Evidence aligned with Section 5 criteria, including documentation of national or international recognition</li>
                <li>References from credentialed peers (required for all C-Suite roles)</li>
                <li>Conflict-of-interest disclosures</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Evaluation Steps</h3>
              <p className="text-muted-foreground mb-4">The following steps are mandatory for all candidates regardless of nomination pathway:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li><strong>Step 1:</strong> Screening for eligibility and completeness of submission package</li>
                <li><strong>Step 2:</strong> Evaluation Board review using structured scoring rubric aligned to Section 5 criteria</li>
                <li><strong>Step 3:</strong> Scored deliberation and documented recommendation by Evaluation Board</li>
                <li><strong>Step 4:</strong> Interview (required for all C-Suite roles)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.4 Documentation</h3>
              <p className="text-muted-foreground mb-4">The entire selection process must be documented in writing, including nominations received, scoring sheets, deliberation notes, and final decisions. This record serves as evidence of the Organization's transparency, independence, and selectivity and shall be retained for a minimum of five (5) years.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">6.5 Outcomes</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li><strong>Approve:</strong> Distinguished Membership and leadership appointment granted</li>
                <li><strong>Defer:</strong> Reconsideration after 60–180 days with specific written guidance</li>
                <li><strong>Decline:</strong> Reconsideration after 12 months (optional); written reason to be provided to candidate upon request</li>
              </ul>

              {/* Section 7 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">7) Conflict of Interest and Confidentiality</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Conflict of Interest (COI)</h3>
              <p className="text-muted-foreground mb-4">Any Evaluation Board member or Founders Council member must recuse themselves from evaluating any candidate where impartiality could reasonably be questioned, including:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Close personal or family relationships</li>
                <li>Direct reporting lines or financial dependence</li>
                <li>Recent close collaboration (e.g., cofounder or coauthor within 24 months)</li>
                <li>Competitive or adversarial conflicts</li>
                <li>Any other relationship that would compromise independent judgment</li>
              </ul>
              <p className="text-muted-foreground mb-4">Recusals must be documented in the selection record. A recused member may not participate in scoring, deliberation, or voting for the affected candidate.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Confidentiality</h3>
              <p className="text-muted-foreground mb-4">Candidate materials, discussions, and evaluation outcomes are confidential except for publicly announced appointments. Evaluation Board members and Founders Council members must not disclose candidate information to unauthorized parties.</p>

              {/* Section 8 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">8) Terms, Performance, and Removal</h2>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Terms</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li><strong>C-Suite roles:</strong> 1–2 years, renewable subject to Founders Council review.</li>
                <li><strong>Director roles:</strong> 1–2 years, renewable subject to Founders Council review. Note: Director roles do not confer Distinguished Member status.</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Performance Expectations</h3>
              <p className="text-muted-foreground mb-4">Distinguished Members must:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Uphold the Organization's mission, values, and responsible AI principles</li>
                <li>Execute responsibilities with accountability, diligence, and professionalism</li>
                <li>Avoid conflicts that compromise integrity, independence, or public trust</li>
                <li>Maintain the standards of national or international recognition upon which their appointment was based</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">8.3 Removal</h3>
              <p className="text-muted-foreground mb-4">A Distinguished Member may be removed for:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Misconduct or Code of Conduct violations</li>
                <li>Breach of duty, misuse of authority, or reputational harm to the Organization</li>
                <li>Repeated non-performance of role responsibilities</li>
                <li>Material misrepresentation in the appointment process</li>
              </ul>
              <p className="text-muted-foreground mb-4"><strong>Process:</strong> Written notice to the member, opportunity to respond within fourteen (14) days, and a Founders Council vote. Simple majority required for removal.</p>

              {/* Section 9 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">9) Code of Conduct and Member Discipline</h2>
              <p className="text-muted-foreground mb-4">MIT Gen AI Global maintains a community Code of Conduct applicable to all Members and Distinguished Members. Possible disciplinary actions include:</p>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li>Written warning</li>
                <li>Temporary suspension from activities</li>
                <li>Removal from the community</li>
                <li>Revocation of Distinguished Member status (if applicable)</li>
              </ul>
              <p className="text-muted-foreground mb-4">A fair process will be followed in all cases, including written notice and an opportunity for the member to respond before any final determination.</p>

              {/* Section 10 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">10) Amendments</h2>
              <p className="text-muted-foreground mb-4">These Bylaws may be amended by a vote of the Founders Council. Proposed amendments must be circulated to all Founders Council members at least seven (7) days before the vote. Amendments take effect immediately upon adoption unless otherwise stated. All amendments must be documented in writing with the date of adoption and version number.</p>

              {/* Section 11 */}
              <h2 className="text-2xl font-semibold mt-8 mb-4">11) Effective Date and Version History</h2>
              <p className="text-muted-foreground mb-4">These Bylaws are effective as of April 01, 2025. This version (v4.0) was amended in February 2026 to strengthen provisions governing Distinguished Member selection, Evaluation Board.</p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Version History</h3>
              <ul className="list-disc pl-6 mb-4 text-muted-foreground">
                <li><strong>v1.0 – v3.0:</strong> Prior versions adopted by Founders Council (April 2025)</li>
                <li><strong>v4.0:</strong> Amended February 2026 — strengthened Evaluation Board credential requirements (Section 4.2), eliminated unconditional direct-invitation pathway (Section 6.1), added numerical cap on annual appointments (Section 3.3), added selectivity/rejection rate documentation requirement (Section 3.3), added independence disclaimer (Section 1.1), clarified separation of Open and Distinguished Membership (Section 2.2), added mandatory documentation retention requirement (Section 6.4)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bylaws;
