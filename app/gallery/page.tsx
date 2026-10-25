import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryLightbox from '@/components/GalleryLightbox';
import prisma from '@/lib/prisma';
import '@/app/homepage.css';

export const revalidate = 60;

export default async function GalleryPage() {
  const [settingsList, galleryItems] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.galleryItem.findMany({ orderBy: { order: 'asc' } }),
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

  return (
    <>
      <Header phone1={phone1} phone2={phone2} whatsapp={whatsapp} mapsUrl={mapsUrl} logo={logo} />

      {/* ─── LUXURY HERO BANNER ─── */}
      <section className="las_page_hero">
        <div className="las_page_hero_inner">
          <span className="las_page_badge">Visual Journey</span>
          <h1 className="las_page_title">Photo &amp; Media Gallery</h1>
          <nav className="las_breadcrumbs" aria-label="Breadcrumbs">
            <Link href="/">Home</Link>
            <span className="las_breadcrumbs_sep">/</span>
            <span className="las_breadcrumbs_current">Gallery</span>
          </nav>
        </div>
      </section>

      {/* ─── MAIN GALLERY SECTION ─── */}
      <section className="las_section" style={{ backgroundColor: '#ffffff', padding: '70px 0' }}>
        <div className="las_container">
          <div className="las_section_header">
            <span className="las_eyebrow">Portfolio &amp; Captures</span>
            <h2 className="las_section_title">Moments of Grandeur</h2>
            <p className="las_section_subtitle">
              Browse through memorable moments captured at Lascigal Convention Centre — showcasing our grand halls, stage decor, banquet feasts, and evening celebrations.
            </p>
          </div>

          <GalleryLightbox items={galleryItems} />
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
