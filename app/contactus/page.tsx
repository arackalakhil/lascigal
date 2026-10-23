import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import CouponGenerator from '@/components/CouponGenerator';
import prisma from '@/lib/prisma';

export const revalidate = 60;

export default async function ContactUsPage() {
  const settingsList = await prisma.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const phone1 = settings['phone_primary'] || '7306107515';
  const phone2 = settings['phone_secondary'] || '9745897834';
  const whatsapp = settings['whatsapp_number'] || '917306107515';
  const mapsUrl = settings['google_maps_url'] || 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8';

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
              Contact Us
            </h1>
            <div className="breadcrumbs" style={{ color: '#bbb', fontSize: '14px' }}>
              <Link href="/" className="breadcrumbs_item home" style={{ color: '#c5a880', textDecoration: 'none' }}>
                Home
              </Link>
              <span className="breadcrumbs_delimiter" style={{ margin: '0 8px' }}>
                /
              </span>
              <span className="breadcrumbs_item current">Contact Us</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coupon Generator Section */}
      <section className="no-col-padding" style={{ backgroundColor: '#202020', padding: '40px 20px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>
            Book now! Click below to claim your coupon code:
          </h3>
          <p style={{ color: '#aaa', fontSize: '14.5px', marginBottom: '20px' }}>
            Apply your generated discount code in the reservation form below.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CouponGenerator />
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="no-col-padding" style={{ padding: '60px 20px', backgroundColor: '#f9f9f9' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div className="sc_form sc_form_style_form_1 aligncenter">
            <h3 className="sc_form_title sc_item_title sc_item_title_without_descr" style={{ fontSize: '2.2rem', marginBottom: '6px' }}>
              Book Now
            </h3>
            <h6 className="sc_form_subtitle sc_item_subtitle" style={{ color: '#888', marginBottom: '35px' }}>
              Fill in your event details and our coordinator will connect with you
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
