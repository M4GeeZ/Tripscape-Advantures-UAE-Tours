import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import WhatsAppFloat from '../../components/WhatsAppFloat/WhatsAppFloat'
import CallFloat from '../../components/CallFloat/CallFloat'
import './PrivacyPolicy.css'

const toc = [
  ['introduction', '1. Introduction'],
  ['information-we-collect', '2. Information We Collect'],
  ['how-we-collect', '3. How We Collect Your Information'],
  ['how-we-use', '4. How We Use Your Information'],
  ['legal-basis', '5. Legal Basis for Processing'],
  ['how-we-share', '6. How We Share Your Information'],
  ['cookies', '7. Cookies & Tracking Technologies'],
  ['retention', '8. Data Retention'],
  ['rights', '9. Your Rights as a Data Subject'],
  ['security', '10. Data Security'],
  ['third-party', '11. Third-Party Links & Services'],
  ['children', "12. Children's Privacy"],
  ['transfers', '13. International Data Transfers'],
  ['changes', '14. Changes to This Privacy Policy'],
  ['contact', '15. Contact Us & Complaints'],
]

const companyDetails = [
  ['Company Name', 'Tripscape Adventure Tourism LLC'],
  ['Trade License', 'DTCM Licensed -- Dubai Department of Tourism & Commerce Marketing'],
  ['Registered Address', 'Office 1204, Business Bay, Dubai, United Arab Emirates'],
  ['Website', 'https://tripscapetourism.com'],
  ['Phone', '+971 54 993 0684  |  +971 55 659 5007'],
  ['Email', 'info@tripscapetourism.com'],
  ['Instagram', '@tripscapeadventures'],
  ['Jurisdiction', 'Dubai, UAE -- Governed by UAE Federal Law No. 45 of 2021 (PDPL)'],
]

const directInformation = [
  ['Identity & Contact', 'Full name, nationality, passport/Emirates ID number', 'At booking or tour check-in'],
  ['Booking Details', 'Tour type, number of participants, date/time, pickup location', 'When making a reservation'],
  ['Payment Information', 'Credit/debit card details, billing address, transaction reference', 'At checkout (processed via secure payment gateway)'],
  ['Communication Data', 'Emails, WhatsApp messages, phone call records, enquiry forms', 'When you contact us'],
  ['Feedback & Reviews', 'Tour ratings, written reviews, photos shared with consent', 'After your tour'],
  ['Special Requests', 'Dietary requirements, medical conditions, mobility needs', 'If disclosed voluntarily at booking'],
  ['Account Data', 'Username, password, saved preferences (if you create an account)', 'During account registration'],
]

const automaticInformation = [
  ['Device & Browser', 'IP address, browser type, OS, device model', 'Server logs, Google Analytics'],
  ['Usage Data', 'Pages visited, time on site, clicks, scroll depth', 'Google Analytics (GA4), GTM'],
  ['Location Data', 'Approximate location (city/country level)', 'IP geolocation'],
  ['Cookies', 'Session cookies, preference cookies, marketing cookies', 'Cookie consent tool (see Section 7)'],
  ['Booking Source', 'Which platform referred you (Viator, GYG, direct)', 'UTM parameters, referral tracking'],
]

const useInformation = [
  ['Process and confirm your booking', 'Name, contact, payment, tour details', 'Contract performance'],
  ['Arrange hotel pickup and tour logistics', 'Name, pickup address, phone number', 'Contract performance'],
  ['Process payments securely', 'Payment card details, billing address', 'Contract performance'],
  ['Send booking confirmations and reminders', 'Email address, phone/WhatsApp number', 'Contract performance'],
  ['Provide customer support before/during/after tour', 'All communication data', 'Contract performance'],
  ['Send post-tour review requests', 'Email, WhatsApp number', 'Legitimate interest'],
  ['Improve our website and services', 'Usage data, analytics', 'Legitimate interest'],
  ['Send promotional offers (with your consent)', 'Email, WhatsApp, social media', 'Consent'],
  ['Comply with DTCM licensing requirements', 'Identity, booking records', 'Legal obligation'],
  ['Comply with UAE tax and financial regulations', 'Payment records, invoices', 'Legal obligation'],
  ['Ensure safety during tours', 'Medical/health disclosures', 'Vital interests / consent'],
  ['Respond to legal claims or disputes', 'All relevant data', 'Legal obligation'],
]

const serviceProviders = [
  ['Payment Gateway Providers', 'Secure payment processing', 'Card details, billing info'],
  ['Google (Analytics, GTM, Maps)', 'Website analytics, mapping', 'Usage data, IP address'],
  ['WhatsApp Business', 'Customer communication', 'Messages, phone number'],
  ['Email Service Providers', 'Booking confirmations, support', 'Name, email, booking ref'],
  ['Viator / GetYourGuide / Klook', 'Tour bookings via OTA platforms', 'Booking details, contact info'],
  ['TripAdvisor / Trustpilot', 'Review management', 'Name, booking ref, review text'],
  ['IT & Hosting Providers', 'Website hosting and security', 'Website usage data'],
]

const cookieTypes = [
  ['Essential', 'Website function, session management', 'Session cookies, CSRF tokens', 'No -- required for site to work'],
  ['Analytics', 'Understand visitor behaviour, page performance', 'Google Analytics (_ga, _gid)', 'Yes -- decline in cookie banner'],
  ['Marketing', 'Track ad performance, remarketing', 'Google Ads, Meta Pixel', 'Yes -- decline in cookie banner'],
  ['Preference', 'Remember language, location, settings', 'Preference cookies', 'Yes -- decline in cookie banner'],
]

const retentionData = [
  ['Booking records & invoices', '5 years from tour date', 'UAE VAT/tax law requirement'],
  ['Payment records', '5 years', 'UAE Federal Tax Authority (FTA) compliance'],
  ['Customer communication (email/WhatsApp)', '2 years from last contact', 'Dispute resolution, customer service'],
  ['Website analytics data', '26 months', 'Google Analytics default (industry standard)'],
  ['Marketing consent records', 'Until consent withdrawn + 1 year', 'Proof of consent'],
  ['Review / feedback data', 'Indefinitely (anonymised after 3 years)', 'Business improvement'],
  ['CCTV footage (at office/camp)', '30 days', 'Security purposes'],
  ['Medical/health disclosures', 'Deleted within 30 days of tour completion', 'Safety only -- no ongoing purpose'],
]

const dataRights = [
  ['Right to Access', 'Request a copy of all personal data we hold about you', 'Email info@tripscapetourism.com'],
  ['Right to Rectification', 'Correct inaccurate or incomplete personal data', 'Email or WhatsApp us'],
  ['Right to Erasure', 'Request deletion of your data (subject to legal retention obligations)', 'Email info@tripscapetourism.com'],
  ['Right to Restrict Processing', 'Ask us to limit how we use your data in certain circumstances', 'Email info@tripscapetourism.com'],
  ['Right to Data Portability', 'Receive your data in a structured, machine-readable format', 'Email request with identity verification'],
  ['Right to Object', 'Object to processing based on legitimate interests or for marketing', 'Email or unsubscribe link'],
  ['Right to Withdraw Consent', 'Withdraw any consent you previously gave at any time', 'Email or unsubscribe link in messages'],
  ['Right to Lodge a Complaint', 'File a complaint with the UAE Data Office', 'dataoffice.gov.ae'],
]

const transfers = [
  ['Google (Analytics, GTM, Maps)', 'USA / Global', 'Google Data Processing Terms & Standard Contractual Clauses'],
  ['Viator', 'USA', 'TripAdvisor Group Data Processing Agreement'],
  ['GetYourGuide', 'Germany', 'GDPR-compliant EU data processors'],
  ['Meta (WhatsApp, Instagram)', 'USA / Global', 'Meta Data Transfer Terms'],
  ['Email Service Provider', 'Varies', 'Standard Contractual Clauses or Adequacy Decision'],
]

const contactDetails = [
  ['Company', 'Tripscape Adventure Tourism LLC'],
  ['Address', 'Office 1204, Business Bay, Dubai, United Arab Emirates'],
  ['Email', 'info@tripscapetourism.com (Subject: "Privacy Policy Enquiry")'],
  ['Phone', '+971 54 993 0684'],
  ['WhatsApp', '+971 54 993 0684'],
  ['Website', 'https://tripscapetourism.com'],
  ['Hours', 'Monday – Sunday, 8:00 AM – 10:00 PM UAE Time'],
]

function BulletList({ items }) {
  return (
    <ul className="privacy-bullets">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function DataTable({ columns, rows }) {
  return (
    <div className="privacy-table-wrap">
      <table className="privacy-table">
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PolicySection({ id, number, title, children }) {
  return (
    <section className="privacy-section" id={id}>
      <div className="privacy-section-heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

export default function PrivacyPolicy({ menuOpen, setMenuOpen }) {
  const [activeSection, setActiveSection] = useState(toc[0][0])

  useEffect(() => {
    let frameId = null

    const updateActiveSection = () => {
      if (frameId) return

      frameId = window.requestAnimationFrame(() => {
        frameId = null
        const activationLine = Math.min(220, Math.max(120, window.innerHeight * 0.28))
        let current = toc[0][0]

        toc.forEach(([id]) => {
          const section = document.getElementById(id)
          if (section && section.getBoundingClientRect().top <= activationLine) {
            current = id
          }
        })

        setActiveSection((previous) => previous === current ? previous : current)
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
      if (frameId) window.cancelAnimationFrame(frameId)
    }
  }, [])

  const handleTocClick = (event, id) => {
    event.preventDefault()
    const section = document.getElementById(id)
    if (!section) return

    setActiveSection(id)
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="privacy-page">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} variant="light" showTopBar />

      <header className="privacy-hero">
        <div className="privacy-hero-glow" />
        <div className="privacy-shell">
          <span className="privacy-eyebrow">Tripscape Adventure Tourism LLC</span>
          <h1>Privacy Policy</h1>
          <p>How We Collect, Use &amp; Protect Your Personal Information</p>
          <div className="privacy-effective">Effective Date: 1 October 2026 <span>|</span> Last Updated: 29 September 2026</div>
        </div>
      </header>

      <main className="privacy-main">
        <div className="privacy-shell privacy-layout">
          <aside className="privacy-sidebar" aria-label="Privacy Policy contents">
            <div className="privacy-sidebar-card">
              <span className="privacy-sidebar-label">Contents</span>
              <nav>
                {toc.map(([id, label]) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={activeSection === id ? 'is-active' : ''}
                    aria-current={activeSection === id ? 'location' : undefined}
                    onClick={(event) => handleTocClick(event, id)}
                  >
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="privacy-content">
            <div className="privacy-info-card">
              {companyDetails.map(([label, value]) => (
                <div className="privacy-info-row" key={label}>
                  <strong>{label}</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>

            <div className="privacy-callout privacy-callout-green">
              <strong>OVERVIEW:</strong> This Privacy Policy explains how Tripscape Adventure Tourism LLC collects, uses, shares, and protects your personal data when you visit our website, make a booking, or communicate with us. By using our services, you agree to the practices described in this policy.
            </div>

            <PolicySection id="introduction" number="1" title="Introduction">
              <p>Tripscape Adventure Tourism LLC ("Tripscape," "we," "our," or "us") is a DTCM-licensed tour operator registered in Dubai, United Arab Emirates. We operate the website tripscapetourism.com and provide desert safari tours, city tours, water sports, adventure activities, and related travel services across Dubai and the UAE.</p>
              <p>We are committed to protecting your personal data and respecting your privacy. This Privacy Policy applies to all personal information we collect through:</p>
              <BulletList items={[
                'Our website: tripscapetourism.com',
                'Online booking forms and reservation systems',
                'WhatsApp communications (+971 54 993 0684)',
                'Email correspondence (info@tripscapetourism.com)',
                'Phone calls and in-person interactions',
                'Social media pages (@tripscapeadventures)',
                'Third-party booking platforms (Viator, GetYourGuide, Klook, TripAdvisor)',
              ]} />
              <div className="privacy-callout privacy-callout-green"><strong>LEGAL COMPLIANCE:</strong> This policy complies with UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection (PDPL) and applicable Dubai Department of Tourism &amp; Commerce Marketing (DTCM) regulations.</div>
            </PolicySection>

            <PolicySection id="information-we-collect" number="2" title="Information We Collect">
              <p>We collect two categories of information: information you provide directly, and information collected automatically.</p>
              <h3>2.1 Information You Provide Directly</h3>
              <DataTable columns={['Category', 'Specific Data', 'When Collected']} rows={directInformation} />
              <h3>2.2 Information Collected Automatically</h3>
              <DataTable columns={['Category', 'Specific Data', 'Technology Used']} rows={automaticInformation} />
              <h3>2.3 Sensitive Information</h3>
              <div className="privacy-callout privacy-callout-gold"><strong>NOTE:</strong> We do not actively collect sensitive personal data (health, religion, biometrics). If you voluntarily disclose a medical condition relevant to tour safety (e.g., pregnancy, back problems, motion sickness), this is stored solely to ensure your safety during the tour and is deleted after the tour completion.</div>
            </PolicySection>

            <PolicySection id="how-we-collect" number="3" title="How We Collect Your Information">
              <h3>3.1 Direct Collection Channels</h3>
              <BulletList items={[
                'Website booking forms on tripscapetourism.com',
                'WhatsApp conversations (+971 54 993 0684 / +971 55 659 5007)',
                'Email correspondence to info@tripscapetourism.com',
                'Phone calls and voice messages',
                'In-person at our office: Office 1204, Business Bay, Dubai',
                'During tour check-in with our guides',
              ]} />
              <h3>3.2 Third-Party Booking Platforms</h3>
              <p>When you book through third-party platforms, we receive your booking information from:</p>
              <BulletList items={[
                'Viator (supplier.viator.com)',
                'GetYourGuide (getyourguide.com)',
                'Klook (klook.com)',
                'TripAdvisor (tripadvisor.com)',
                'Airbnb Experiences',
              ]} />
              <p>Each of these platforms has its own Privacy Policy. We only receive data necessary to fulfil your booking -- name, contact details, tour preferences, and any special requirements.</p>
              <h3>3.3 Social Media</h3>
              <p>If you interact with our Instagram (@tripscapeadventures), Facebook (TripscapeAdventure), or other social media pages, we may receive your public profile information in accordance with the respective platform's privacy settings.</p>
            </PolicySection>

            <PolicySection id="how-we-use" number="4" title="How We Use Your Information">
              <DataTable columns={['Purpose', 'Data Used', 'Legal Basis (UAE PDPL)']} rows={useInformation} />
              <div className="privacy-callout privacy-callout-green"><strong>NOTE:</strong> We do not use your personal data for automated decision-making or profiling that produces legal or similarly significant effects on you.</div>
            </PolicySection>

            <PolicySection id="legal-basis" number="5" title="Legal Basis for Processing (UAE PDPL)">
              <p>Under UAE Federal Decree-Law No. 45 of 2021 (Personal Data Protection Law -- PDPL), we process your personal data under one or more of the following legal bases:</p>
              <div className="privacy-subsection">
                <h3>5.1 Contract Performance</h3>
                <p>Processing necessary to fulfil your booking and deliver the tour service you have paid for. This includes confirming reservations, arranging pickups, processing payments, and providing guides.</p>
              </div>
              <div className="privacy-subsection">
                <h3>5.2 Legitimate Interests</h3>
                <p>Processing for purposes that are in our legitimate business interests, provided these do not override your privacy rights. This includes website analytics, fraud prevention, service improvement, and sending post-tour review requests.</p>
              </div>
              <div className="privacy-subsection">
                <h3>5.3 Legal Obligation</h3>
                <p>Processing required to comply with UAE law, including DTCM licensing requirements, UAE Federal Tax Authority (VAT) regulations, and anti-money laundering obligations.</p>
              </div>
              <div className="privacy-subsection">
                <h3>5.4 Consent</h3>
                <p>Where we rely on consent (e.g., sending marketing emails, using non-essential cookies), you have the right to withdraw consent at any time by contacting us at info@tripscapetourism.com or using the unsubscribe link in marketing messages.</p>
              </div>
            </PolicySection>

            <PolicySection id="how-we-share" number="6" title="How We Share Your Information">
              <p>We do not sell your personal data. We may share it in limited circumstances as described below.</p>
              <h3>6.1 Service Providers (Data Processors)</h3>
              <DataTable columns={['Recipient', 'Purpose', 'Data Shared']} rows={serviceProviders} />
              <h3>6.2 Legal Requirements</h3>
              <p>We may disclose your data when required by UAE law, regulation, court order, or at the request of government authorities including DTCM, Dubai Police, or UAE Federal Tax Authority.</p>
              <h3>6.3 Business Transfers</h3>
              <p>In the event of a merger, acquisition, or sale of Tripscape Adventure Tourism LLC, your personal data may be transferred to the new entity. We will notify you of such changes.</p>
              <h3>6.4 With Your Consent</h3>
              <p>We share your photos or testimonials on our social media or website only with your explicit prior consent (e.g., if you tag us on Instagram or provide written permission).</p>
            </PolicySection>

            <PolicySection id="cookies" number="7" title="Cookies & Tracking Technologies">
              <p>Our website uses cookies and similar technologies. When you first visit tripscapetourism.com, you will see a cookie consent notice.</p>
              <DataTable columns={['Cookie Type', 'Purpose', 'Examples', 'Can You Opt Out?']} rows={cookieTypes} />
              <p>We currently use:</p>
              <BulletList items={[
                'Google Tag Manager (GTM-KHWTLQ96) -- manages all tracking tags',
                'Google Analytics 4 -- website traffic analysis',
                'Google Ads Conversion Tracking -- measures booking conversions',
              ]} />
              <p>You can manage cookies through your browser settings or by using our cookie consent tool on the website. Withdrawing consent for non-essential cookies will not affect your ability to use the website.</p>
            </PolicySection>

            <PolicySection id="retention" number="8" title="Data Retention">
              <p>We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by UAE law.</p>
              <DataTable columns={['Data Category', 'Retention Period', 'Reason']} rows={retentionData} />
              <p>After the retention period expires, we securely delete or anonymise your data. You may request earlier deletion subject to the exceptions in Section 9.</p>
            </PolicySection>

            <PolicySection id="rights" number="9" title="Your Rights as a Data Subject">
              <p>Under the UAE Personal Data Protection Law (PDPL) and applicable international standards, you have the following rights regarding your personal data:</p>
              <DataTable columns={['Right', 'What It Means', 'How to Exercise']} rows={dataRights} />
              <div className="privacy-callout privacy-callout-blue"><strong>HOW TO EXERCISE YOUR RIGHTS:</strong> To exercise any of these rights, contact us at info@tripscapetourism.com with the subject line "Data Privacy Request." We will respond within 30 days. We may request identity verification before processing your request.</div>
            </PolicySection>

            <PolicySection id="security" number="10" title="Data Security">
              <p>Tripscape implements appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, alteration, or disclosure. Our security measures include:</p>
              <h3>10.1 Technical Measures</h3>
              <BulletList items={[
                'SSL/TLS encryption on tripscapetourism.com (HTTPS)',
                'Secure payment processing via PCI-DSS compliant payment gateways',
                'Access controls -- only authorised staff can access customer data',
                'Regular security updates and vulnerability patching',
                'Google Analytics data anonymisation where applicable',
              ]} />
              <h3>10.2 Organisational Measures</h3>
              <BulletList items={[
                'Staff trained on data privacy and handling procedures',
                'Limited data sharing -- only what is necessary for service delivery',
                'Secure disposal of physical documents containing personal data',
                'Incident response procedure for data breaches',
              ]} />
              <h3>10.3 Payment Security</h3>
              <p>We do not store full payment card details on our systems. All card payments are processed by our third-party payment gateway which is PCI-DSS (Payment Card Industry Data Security Standard) compliant. We only retain the last four digits of your card number for reference.</p>
              <h3>10.4 Data Breach Notification</h3>
              <p>In the unlikely event of a data breach that poses a risk to your rights and freedoms, we will notify the UAE Data Office and affected individuals as required by UAE PDPL Article 31, within the timeframe specified by law.</p>
            </PolicySection>

            <PolicySection id="third-party" number="11" title="Third-Party Links & Services">
              <p>Our website and booking process may include links to third-party websites and services. This includes:</p>
              <BulletList items={[
                'Viator, GetYourGuide, Klook, and TripAdvisor (OTA booking platforms)',
                'Google Maps (location and route information)',
                'Instagram and Facebook (social media pages)',
                'WhatsApp Business (communication platform)',
                'Payment gateway provider websites',
              ]} />
              <div className="privacy-callout privacy-callout-gold"><strong>IMPORTANT:</strong> Tripscape is not responsible for the privacy practices of third-party websites or services. We encourage you to read the privacy policies of any third-party sites you visit. Clicking on external links from our website is at your own discretion.</div>
            </PolicySection>

            <PolicySection id="children" number="12" title="Children's Privacy">
              <p>Our services are marketed to adults. However, we frequently serve families with children on our desert safari and tour packages. In this context:</p>
              <BulletList items={[
                'We do not knowingly collect personal data directly from children under the age of 18.',
                "Children's booking information (e.g., number of child participants, ages for activity suitability) is collected from the adult/guardian making the booking.",
                "We do not use children's images on our website or social media without explicit parental consent.",
                'If you believe we have inadvertently collected personal data from a child without parental consent, please contact us immediately at info@tripscapetourism.com.',
              ]} />
              <div className="privacy-callout privacy-callout-green"><strong>NOTE:</strong> For family safari bookings, only the adult lead traveller's personal data is held. Children are included as part of the group booking under the adult's record.</div>
            </PolicySection>

            <PolicySection id="transfers" number="13" title="International Data Transfers">
              <p>Tripscape Adventure Tourism LLC is based in Dubai, UAE. Some of our service providers and third-party platforms are located outside the UAE. When we transfer your personal data internationally, we ensure appropriate safeguards are in place:</p>
              <DataTable columns={['Service Provider', 'Country', 'Transfer Safeguard']} rows={transfers} />
              <p>We will only transfer your data to countries that provide an adequate level of protection or where appropriate safeguards (such as standard contractual clauses) are in place, in accordance with UAE PDPL requirements.</p>
            </PolicySection>

            <PolicySection id="changes" number="14" title="Changes to This Privacy Policy">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or business operations. When we make changes:</p>
              <BulletList items={[
                'We will update the "Last Updated" date at the top of this policy.',
                'For material changes that significantly affect your rights, we will notify you by email or a prominent notice on our website.',
                'Minor updates (e.g., formatting, clarifications) may be made without notice.',
                'Continued use of our services after the updated policy is posted constitutes your acceptance of the revised terms.',
              ]} />
              <p>We recommend reviewing this policy periodically. The current version will always be available at: tripscapetourism.com/privacy-policy/</p>
            </PolicySection>

            <PolicySection id="contact" number="15" title="Contact Us & Complaints">
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your personal data, please contact us:</p>
              <DataTable columns={['Contact', 'Details']} rows={contactDetails} />
              <h3>Regulatory Authority</h3>
              <p>If you are not satisfied with how we handle your privacy complaint, you have the right to lodge a complaint with the UAE Data Office:</p>
              <DataTable columns={['Authority', 'Details']} rows={[
                ['Authority', 'UAE Data Office (UAEDAO)'],
                ['Website', 'www.dataoffice.gov.ae'],
                ['Role', 'The supervisory authority for UAE Federal Decree-Law No. 45 of 2021 (PDPL)'],
              ]} />
            </PolicySection>

            <div className="privacy-document-footer">
              Tripscape Adventure Tourism LLC &nbsp;|&nbsp; tripscapetourism.com &nbsp;|&nbsp; Privacy Policy &nbsp;|&nbsp; Effective: 1 October 2026
            </div>
          </article>
        </div>
      </main>

      <Footer />
      <CallFloat />
      <WhatsAppFloat />
    </div>
  )
}
