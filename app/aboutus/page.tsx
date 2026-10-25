import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

export const revalidate = 60;

export default async function AboutUsPage() {
  const settingsList = await prisma.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';
  const directorTitle = settings['director_title'] || 'Lascigal – Creating Spaces That Tell Your Story';
  const directorMessage =
    settings['director_message'] ||
    'At Lascigal Convention Center, we believe every event is more than just a gathering—it\u2019s a memory in the making. Our vision has always been to create a space where elegance meets excellence, and where your special moments are celebrated with the care, warmth, and sophistication they truly deserve.\n\nFrom weddings and corporate events to grand celebrations, we provide world-class facilities, seamless service, and an atmosphere that inspires joy. As the Director, it is my honor to ensure that each guest experiences not only the grandeur of our venue but also the personal touch that makes every occasion unforgettable.';
  const videoUrl = settings['director_video_url'] || 'https://www.youtube.com/embed/dANtb6anAWI?start=21&end=305';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">Our Vision &amp; Heritage</span>
          <h1 className="las_page_title">About Lascigal</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">About Us</span>
          </nav>
        </div>
      </section>

      {/* ─── DIRECTOR'S MESSAGE SECTION ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff' }}>
        <div className="las_container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: '50px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Message */}
            <div>
              <span className="las_eyebrow">Director&apos;s Word</span>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(24px, 3.5vw, 36px)',
                  lineHeight: 1.3,
                  color: '#0f172a',
                  margin: '10px 0 24px',
                }}
              >
                {directorTitle}
              </h2>

              <div style={{ color: '#475569', lineHeight: 1.8, fontSize: '15.5px' }}>
                {directorMessage.split('\n\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '18px' }}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Social Channels */}
              <div style={{ marginTop: '28px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <a
                  href="#"
                  aria-label="Facebook"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-facebook-f" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-instagram" />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-youtube" />
                </a>
                <a
                  href={`https://wa.me/${whatsapp}?text=Hello%20Lascigal`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fab fa-whatsapp" />
                </a>
              </div>
            </div>

            {/* Right Column: Video Embed */}
            <div>
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  backgroundColor: '#0c0e12',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={videoUrl}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Lascigal Showcase Video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer
        phone1={phone1}
        phone2={phone2}
        email={settings['email_address']}
        addressLine1={settings['address_line1']}
        addressPincode={settings['address_pincode']}
        mapsUrl={mapsUrl}
        mapsEmbed={settings['google_maps_embed']}
        logo={logo}
      />
    </>
  );
}
