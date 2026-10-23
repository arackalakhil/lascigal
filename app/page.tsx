import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import CouponGenerator from '@/components/CouponGenerator';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';

// Revalidate page data every 60 seconds
export const revalidate = 60;

export default async function HomePage() {
  const [settingsList, facilities, featuredEvents] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.venueFacility.findMany({ orderBy: { order: 'asc' } }),
    prisma.eventService.findMany({ orderBy: { order: 'asc' }, take: 8 }),
  ]);

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';

  const heroHeading = settings['hero_heading'] || 'Creating Unforgettable Moments for Every Occasion';
  const heroSubheading = settings['hero_subheading'] || 'Welcome to Lascigal';
  const heroImage = settings['hero_image'] || 'images/gallery/DSC01156.jpg.webp';
  const offerBannerText =
    settings['offer_banner_text'] ||
    '“Exclusive Deal: Reserve your spot today & save big with our limited-time discount!”';
  const aboutHeading = settings['about_heading'] || 'Transforming Events Into Experiences Celebrating Life';
  const aboutText =
    settings['about_text'] ||
    'At Lascigal Convention Center, we believe every event is more than just a gathering—it’s a memory in the making. Our vision has always been to create a space where elegance meets excellence, and where your special moments are celebrated with the care, warmth, and sophistication they truly deserve.';
  const aboutImage = settings['about_image'] || 'images/gallery/FRONT_VIEW.jpeg';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} />

      {/* Hero Banner Section */}
      <section className="hero_banner_section" style={{ position: 'relative', width: '100%', minHeight: '550px', background: '#1c1c1c' }}>
        <div style={{ position: 'relative', width: '100%', height: '550px', overflow: 'hidden' }}>
          <Image
            src={mediaUrl(heroImage)}
            alt="Lascigal Convention Center Grand Hall"
            fill
            priority
            style={{ objectFit: 'cover', opacity: 0.8 }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 20px',
            }}
          >
            <h6
              style={{
                color: '#c5a880',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontSize: '15px',
                fontWeight: 600,
                marginBottom: '10px',
              }}
            >
              {heroSubheading}
            </h6>
            <h1
              style={{
                color: '#ffffff',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontFamily: 'PT Serif, serif',
                maxWidth: '900px',
                margin: '0 auto 24px',
                lineHeight: 1.25,
              }}
            >
              {heroHeading}
            </h1>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                href="/contactus"
                className="sc_button sc_button_square sc_button_style_filled sc_button_size_large"
                style={{
                  backgroundColor: '#c5a880',
                  color: '#fff',
                  padding: '14px 34px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Book Now
              </Link>
              <Link
                href="/gallery"
                className="sc_button sc_button_square sc_button_style_hovered sc_button_size_large"
                style={{
                  border: '2px solid #fff',
                  color: '#fff',
                  padding: '12px 30px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Explore Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="no-col-padding" style={{ backgroundColor: '#c5a880', padding: '24px 15px', textAlign: 'center' }}>
        <div className="content_wrap">
          <h2 style={{ color: '#fff', margin: 0, fontSize: 'clamp(17px, 2.5vw, 24px)', fontWeight: 500 }}>
            {offerBannerText}
          </h2>
        </div>
      </section>

      {/* 6 Core Facilities / Services Section */}
      <section className="no-col-padding" style={{ padding: '60px 0 30px' }}>
        <div className="content_container">
          <div className="sc_services_wrap">
            <div className="sc_services sc_services_style_services-1 sc_services_type_images margin_bottom_medium sc_home-param-type-a">
              <h6 className="sc_services_subtitle sc_item_subtitle" style={{ textAlign: 'center' }}>
                welcome
              </h6>
              <h2
                className="sc_services_title sc_item_title sc_item_title_without_descr"
                style={{ textAlign: 'center', marginBottom: '40px' }}
              >
                Premier Convention & Event Facilities
              </h2>

              <div
                className="columns_wrap"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '30px',
                  padding: '0 20px',
                }}
              >
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className="sc_services_item"
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl(fac.image)}
                        alt={fac.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                    <div className="sc_services_item_content" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        {fac.icon && <i className={fac.icon} style={{ color: '#c5a880', fontSize: '20px' }}></i>}
                        <h4 className="sc_services_item_title" style={{ margin: 0, fontSize: '1.25rem' }}>
                          {fac.title}
                        </h4>
                      </div>
                      <p style={{ color: '#666', lineHeight: 1.6, fontSize: '14.5px', margin: 0 }}>
                        {fac.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Teaser */}
      <section className="no-col-padding" style={{ padding: '50px 0', backgroundColor: '#f9f9f9' }}>
        <div className="content_container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
          <div className="columns_wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '40px' }}>
            <div style={{ flex: '1 1 450px' }}>
              <h6 className="sc_title sc_title_regular margin_top_null" style={{ color: '#c5a880', textTransform: 'uppercase' }}>
                about us
              </h6>
              <h2 className="sc_title" style={{ fontSize: '2.1rem', lineHeight: 1.3, marginBottom: '20px' }}>
                {aboutHeading}
              </h2>
              <p style={{ color: '#555', lineHeight: 1.8, fontSize: '16px', marginBottom: '24px' }}>
                {aboutText}
              </p>
              <Link
                href="/aboutus"
                className="sc_button sc_button_square sc_button_style_filled sc_button_size_medium"
                style={{
                  backgroundColor: '#c5a880',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Read Director&apos;s Message
              </Link>
            </div>
            <div style={{ flex: '1 1 450px', position: 'relative', minHeight: '340px' }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(aboutImage)}
                  alt="Lascigal Convention Center Architecture"
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Event Portfolio Teaser */}
      <section className="no-col-padding" style={{ padding: '60px 0' }}>
        <div className="content_container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h6 style={{ textAlign: 'center', color: '#c5a880', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            our events & portfolio
          </h6>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', margin: '10px 0 40px' }}>
            Elegance, Space, and Facilities Perfectly Crafted for Every Event
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
              marginBottom: '35px',
            }}
          >
            {featuredEvents.map((evt) => (
              <Link
                key={evt.id}
                href={`/events/${evt.slug}`}
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.07)',
                  transition: 'transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaUrl(evt.heroImage)}
                    alt={evt.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#c5a880', fontWeight: 600, textTransform: 'uppercase' }}>
                    {evt.categoryName}
                  </span>
                  <h4 style={{ margin: '6px 0 8px', fontSize: '1.1rem' }}>{evt.title}</h4>
                  <p style={{ fontSize: '13.5px', color: '#777', margin: 0, lineHeight: 1.5 }}>
                    {evt.summary ? evt.summary.slice(0, 85) + '...' : 'Explore features and hall layouts.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link
              href="/portfolio"
              style={{
                backgroundColor: '#2c2c2c',
                color: '#fff',
                padding: '12px 32px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'inline-block',
              }}
            >
              View All Event Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Coupon Generator Banner */}
      <section className="no-col-padding" style={{ backgroundColor: '#222', padding: '50px 20px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', color: '#fff', marginBottom: '10px' }}>
            Book now! Click below to claim your discount coupon:
          </h3>
          <p style={{ color: '#aaa', marginBottom: '25px', fontSize: '15px' }}>
            Generate your exclusive promo code and apply it in your reservation form below to receive special pricing on venue bookings.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CouponGenerator />
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="no-col-padding" style={{ padding: '60px 20px', backgroundColor: '#fcfcfc' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="sc_form sc_form_style_form_1 aligncenter">
            <h3 className="sc_form_title sc_item_title sc_item_title_without_descr" style={{ fontSize: '2.2rem', marginBottom: '8px' }}>
              Book Now
            </h3>
            <h6 className="sc_form_subtitle sc_item_subtitle" style={{ color: '#888', marginBottom: '35px' }}>
              Fill out the form below to reserve your date
            </h6>
            <BookingForm />
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
      />
    </>
  );
}
