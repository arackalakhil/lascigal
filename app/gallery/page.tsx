import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryLightbox from '@/components/GalleryLightbox';
import prisma from '@/lib/prisma';

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
              Gallery Cobbles
            </h1>
            <div className="breadcrumbs" style={{ color: '#bbb', fontSize: '14px' }}>
              <Link href="/" className="breadcrumbs_item home" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Home
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <span className="breadcrumbs_item current">Gallery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Gallery Section */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h6 style={{ color: '#c5a880', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
            portfolio & captures
          </h6>
          <h2 style={{ fontSize: '2.3rem', margin: '8px 0 20px' }}>Our Latest Projects</h2>
          <p style={{ color: '#666', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 }}>
            Browse through moments captured at Lascigal Convention Centre — showcasing our auditoriums, stage styling, banquet feasts, and evening illuminations.
          </p>
        </div>

        <GalleryLightbox items={galleryItems} />
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
