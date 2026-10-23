import Link from 'next/link';

interface FooterProps {
  phone1?: string;
  phone2?: string;
  email?: string;
  addressLine1?: string;
  addressPincode?: string;
  mapsUrl?: string;
  mapsEmbed?: string;
}

export default function Footer({
  phone1 = '7306107515',
  phone2 = '9745897834',
  email = 'lascigal@gmail.com',
  addressLine1 = 'Las Cigal Convention Center, Kalampoor, Muvattupuzha',
  addressPincode = '686673',
  mapsUrl = 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8',
  mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14223.02209307127!2d76.6284003!3d9.9972091!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e79536923b0b%3A0x1d30fe64d311d295!2sLas%20Cigal%20Convention%20Centre%2C%20Kalampoor!5e1!3m2!1sen!2sin!4v1758356626772!5m2!1sen!2sin',
}: FooterProps) {
  return (
    <>
      {/* Contact Cards Section */}
      <footer className="contacts_wrap scheme_original">
        <div className="contacts_wrap_inner">
          <div className="content_wrap">
            <div className="contacts_address">
              <address className="address_right address_block">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  <span className="sc_icon fa-solid fa-location-dot"></span>
                </a>
                <p className="address_title">Address</p>
                <p>
                  {addressLine1} <br />
                  {addressPincode}
                  <br />
                </p>
              </address>

              <address className="address_center phone_block">
                <span className="sc_icon fas fa-phone"></span>
                <p className="address_title">Phone</p>
                <p>
                  <a href={`tel:${phone1}`}>{phone1}</a>
                </p>
                <p>
                  <a href={`tel:${phone2}`}>{phone2}</a>
                </p>
              </address>

              <address className="address_left email_block">
                <span className="sc_icon fas fa-envelope"></span>
                <p className="address_title">Email address</p>
                <p>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
              </address>
            </div>
          </div>
        </div>
      </footer>

      {/* Google Maps Embed */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
        <iframe
          src={mapsEmbed}
          width="100%"
          height="450"
          style={{ border: 0, maxWidth: '1200px' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lascigal Convention Centre Location Map"
        ></iframe>
      </div>

      {/* Socials & Logo */}
      <footer className="footer_wrap widget_area scheme_original">
        <div className="footer_wrap_inner widget_area_inner">
          <div className="content_wrap">
            <aside id="lovestory_widget_socials-2" className="widget_number_1 widget widget_socials">
              <div className="widget_inner">
                <div className="logo" style={{ marginBottom: '20px' }}>
                  <Link href="/">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/laslogo1.png"
                      className="logo_main"
                      alt="Lascigal Logo"
                      style={{ height: '70px', width: 'auto' }}
                    />
                  </Link>
                </div>
                <div className="sc_socials sc_socials_type_icons sc_socials_shape_round sc_socials_size_tiny">
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
            </aside>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="copyright_wrap copyright_style_text scheme_original">
        <div className="copyright_wrap_inner">
          <div className="content_wrap">
            <div className="copyright_text">
              <p>
                lascigal &copy; {new Date().getFullYear()} All Rights Reserved.{' '}
                <Link href="/admin" style={{ opacity: 0.2, fontSize: '11px', textDecoration: 'none' }}>
                  Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
