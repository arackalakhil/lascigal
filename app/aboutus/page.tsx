import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';

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
  const directorTitle = settings['director_title'] || 'Lascigal – Creating Spaces That Tell Your Story';
  const directorMessage =
    settings['director_message'] ||
    'At Lascigal Convention Center, we believe every event is more than just a gathering—it’s a memory in the making. Our vision has always been to create a space where elegance meets excellence, and where your special moments are celebrated with the care, warmth, and sophistication they truly deserve.\n\nFrom weddings and corporate events to grand celebrations, we provide world-class facilities, seamless service, and an atmosphere that inspires joy. As the Director, it is my honor to ensure that each guest experiences not only the grandeur of our venue but also the personal touch that makes every occasion unforgettable.';
  const videoUrl = settings['director_video_url'] || 'https://www.youtube.com/embed/dANtb6anAWI?start=21&end=305';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} />

      {/* Top Banner Breadcrumbs */}
      <div className="top_panel_title title_present">
        <div
          className="top_panel_title_inner title_present"
          style={{
            backgroundColor: '#262626',
            padding: '50px 0',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <div className="content_wrap">
            <h1 className="page_title" style={{ color: '#fff', margin: '0 0 10px', fontSize: '2.5rem' }}>
              About Us
            </h1>
            <div className="breadcrumbs" style={{ color: '#bbb', fontSize: '14px' }}>
              <Link href="/" className="breadcrumbs_item home" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Home
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <span className="breadcrumbs_item current">About us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="page_content_wrap page_paddings_no" style={{ padding: '60px 0' }}>
        <div className="content">
          <article className="post_item post_item_single page type-page">
            <div className="post_content">
              <section className="no-col-padding">
                <div className="container-fluid">
                  <div className="content_container" style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="columns_wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', alignItems: 'center' }}>
                      {/* Left: Message */}
                      <div style={{ flex: '1 1 500px' }}>
                        <h6
                          className="sc_title sc_title_regular"
                          style={{ color: '#c5a880', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 10px' }}
                        >
                          director&apos;s word
                        </h6>
                        <h2 className="sc_title" style={{ fontSize: '2.3rem', lineHeight: 1.3, marginBottom: '25px' }}>
                          <strong style={{ color: '#c5a880' }}>L</strong>ascigal – Creating Spaces That Tell Your Story
                        </h2>
                        <div style={{ color: '#555', lineHeight: 1.8, fontSize: '16px' }}>
                          {directorMessage.split('\n\n').map((para, i) => (
                            <p key={i} style={{ marginBottom: '16px' }}>
                              {para}
                            </p>
                          ))}
                        </div>

                        <div
                          className="sc_socials sc_socials_type_icons sc_socials_shape_round sc_socials_size_tiny"
                          style={{ marginTop: '25px', display: 'flex', gap: '10px' }}
                        >
                          <div className="sc_socials_item">
                            <a href="#" className="social_icons" aria-label="Facebook">
                              <span className="fa-brands fa-facebook"></span>
                            </a>
                          </div>
                          <div className="sc_socials_item">
                            <a href="#" className="social_icons social_twitter" aria-label="Twitter">
                              <span className="fa-brands fa-x-twitter"></span>
                            </a>
                          </div>
                          <div className="sc_socials_item">
                            <a href="#" className="social_icons social_instagramm" aria-label="Instagram">
                              <span className="fa-brands fa-instagram"></span>
                            </a>
                          </div>
                          <div className="sc_socials_item">
                            <a href="#" className="social_icons social_gplus" aria-label="YouTube">
                              <span className="fa-brands fa-youtube"></span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Right: Video */}
                      <div style={{ flex: '1 1 450px' }}>
                        <div
                          style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                            position: 'relative',
                            paddingTop: '56.25%',
                          }}
                        >
                          <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                            src={videoUrl}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            title="Lascigal Showcase Video"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </article>
        </div>
      </div>

      <Footer
        phone1={phone1}
        phone2={phone2}
        email={settings['email_address']}
        addressLine1={settings['address_line1']}
        addressPincode={settings['address_pincode']}
        mapsUrl={mapsUrl}
        mapsEmbed={settings['google_maps_embed']}
      />
    </>
  );
}
