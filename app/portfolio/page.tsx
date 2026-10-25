import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MarqueeCarousel from '@/components/MarqueeCarousel';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

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
  const logo = settings['site_logo'] || 'images/laslogo1.png';

  // Fallback split if categories aren't assigned
  const celebrations =
    categories.find((c) => c.slug === 'lifes-celebrations')?.events ||
    allEvents.filter((e) => e.categoryName === "Life's Celebrations" || e.order <= 5);

  const conventions =
    categories.find((c) => c.slug === 'conferences-conventions')?.events ||
    allEvents.filter((e) => e.categoryName === 'Conferences & Conventions' || e.order > 5);

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">Event Categories</span>
          <h1 className="las_page_title">Our Event Portfolio</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">Portfolio</span>
          </nav>
        </div>
      </section>

      {/* ─── CATEGORIES SHOWCASE ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff', padding: '70px 0' }}>
        <div className="las_container">
          {/* Category 1: Life's Celebrations */}
          <div style={{ marginBottom: '70px' }}>
            <div className="las_section_header" style={{ marginBottom: '35px' }}>
              <span className="las_eyebrow">Personal Milestones</span>
              <h2 className="las_section_title">Life&apos;s Celebrations</h2>
              <p className="las_section_subtitle">
                Weddings, engagements, betrothals, and joyous family celebrations crafted with traditional grandeur and modern luxury.
              </p>
            </div>
            <MarqueeCarousel items={celebrations} />
          </div>

          {/* Category 2: Conferences & Conventions */}
          <div>
            <div className="las_section_header" style={{ marginBottom: '35px' }}>
              <span className="las_eyebrow">Corporate &amp; Commercial</span>
              <h2 className="las_section_title">Conferences &amp; Conventions</h2>
              <p className="las_section_subtitle">
                State-of-the-art infrastructure for global corporate summits, product launches, trade exhibitions, and award ceremonies.
              </p>
            </div>
            <MarqueeCarousel items={conventions} />
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
