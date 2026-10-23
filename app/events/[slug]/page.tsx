import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import prisma from '@/lib/prisma';
import { mediaUrl } from '@/lib/media';

interface EventDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const events = await prisma.eventService.findMany({ select: { slug: true } });
  return events.map((e) => ({ slug: e.slug }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const [event, settingsList] = await Promise.all([
    prisma.eventService.findUnique({
      where: { slug: params.slug },
      include: { highlights: { orderBy: { order: 'asc' } } },
    }),
    prisma.siteSetting.findMany(),
  ]);

  if (!event) {
    notFound();
  }

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';
  const logo = settings['site_logo'] || 'images/laslogo1.png';

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

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
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'rgba(197, 168, 128, 0.2)',
                color: '#c5a880',
                padding: '4px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              {event.categoryName}
            </span>
            <h1 className="page_title" style={{ color: '#fff', margin: '0 0 10px', fontSize: '2.5rem' }}>
              {event.title}
            </h1>
            <div className="breadcrumbs" style={{ color: '#bbb', fontSize: '14px' }}>
              <Link href="/" className="breadcrumbs_item home" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Home
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <Link href="/portfolio" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Portfolio
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <span className="breadcrumbs_item current">{event.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 20px' }}>
        {/* Hero Image */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '480px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 35px rgba(0,0,0,0.12)',
            marginBottom: '40px',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(event.heroImage)}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px' }}>
          {/* Left Column: Description & Gallery */}
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>About {event.title}</h2>
            {event.summary && (
              <p style={{ fontSize: '18px', color: '#c5a880', fontWeight: 500, lineHeight: 1.6, marginBottom: '20px' }}>
                {event.summary}
              </p>
            )}
            <div style={{ color: '#555', lineHeight: 1.8, fontSize: '16px', marginBottom: '35px' }}>
              {event.description ||
                'Experience world-class event execution with personalized attention to detail, bespoke decor setups, and exceptional hospitality.'}
            </div>

            {/* Gallery Images */}
            {event.galleryImages && event.galleryImages.length > 0 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Event Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
                  {event.galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        height: '140px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl(img)}
                        alt={`${event.title} gallery ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Features & Quick Booking Card */}
          <div>
            <div
              style={{
                backgroundColor: '#fcfcfc',
                border: '1px solid #ebebeb',
                borderRadius: '12px',
                padding: '30px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                marginBottom: '30px',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Key Venue Highlights</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {event.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: idx !== event.features.length - 1 ? '1px solid #eee' : 'none',
                      color: '#444',
                      fontSize: '15px',
                    }}
                  >
                    <i className="fas fa-circle-check" style={{ color: '#c5a880', fontSize: '16px' }}></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div
              style={{
                backgroundColor: '#262626',
                color: '#fff',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ color: '#fff', fontSize: '1.4rem', margin: '0 0 10px' }}>Ready to Book {event.title}?</h3>
              <p style={{ color: '#bbb', fontSize: '14px', marginBottom: '20px' }}>
                Contact our events coordinator to reserve your date and receive customized catering and decor packages.
              </p>
              <Link
                href="/contactus"
                style={{
                  backgroundColor: '#c5a880',
                  color: '#fff',
                  padding: '12px 28px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                Inquire & Book Now
              </Link>
            </div>
          </div>
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
        logo={logo}
      />
    </>
  );
}
