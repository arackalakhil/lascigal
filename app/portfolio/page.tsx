import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarqueeCarousel from '@/components/MarqueeCarousel';
import prisma from '@/lib/prisma';

export const revalidate = 60;

export default async function PortfolioPage() {
  const [settingsList, categories, allEvents] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.eventCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        events: {
          orderBy: { order: 'asc' },
        },
      },
    }),
    prisma.eventService.findMany({ orderBy: { order: 'asc' } }),
  ]);

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';

  // Fallback split if categories aren't assigned
  const celebrations =
    categories.find((c) => c.slug === 'lifes-celebrations')?.events ||
    allEvents.filter((e) => e.categoryName === "Life's Celebrations" || e.order <= 5);

  const conventions =
    categories.find((c) => c.slug === 'conferences-conventions')?.events ||
    allEvents.filter((e) => e.categoryName === 'Conferences & Conventions' || e.order > 5);

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
              Our Portfolio
            </h1>
            <div className="breadcrumbs" style={{ color: '#bbb', fontSize: '14px' }}>
              <Link href="/" className="breadcrumbs_item home" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Home
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <span className="breadcrumbs_item current">Portfolio</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '60px 0' }}>
        {/* Category 1: Life's Celebrations */}
        <div style={{ marginBottom: '60px' }}>
          <h2
            className="sc_section_title sc_item_title sc_item_title_without_descr"
            style={{ textAlign: 'center', fontSize: '2.3rem', marginBottom: '10px' }}
          >
            Life&apos;s Celebrations
          </h2>
          <p style={{ textAlign: 'center', color: '#777', maxWidth: '600px', margin: '0 auto 25px' }}>
            Weddings, engagements, betrothals, and joyous family celebrations crafted with grandeur.
          </p>
          <MarqueeCarousel items={celebrations} />
        </div>

        {/* Category 2: Conferences & Conventions */}
        <div>
          <h2
            className="sc_section_title sc_item_title sc_item_title_without_descr"
            style={{ textAlign: 'center', fontSize: '2.3rem', marginBottom: '10px' }}
          >
            Conferences & Conventions
          </h2>
          <p style={{ textAlign: 'center', color: '#777', maxWidth: '600px', margin: '0 auto 25px' }}>
            State-of-the-art infrastructure for global corporate summits, exhibitions, and award galas.
          </p>
          <MarqueeCarousel items={conventions} />
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
