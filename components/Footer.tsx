import Link from 'next/link';
import { mediaUrl } from '@/lib/media';

interface FooterProps {
  phone1?: string;
  phone2?: string;
  email?: string;
  addressLine1?: string;
  addressPincode?: string;
  mapsUrl?: string;
  mapsEmbed?: string;
  logo?: string;
}

export default function Footer({
  phone1 = '7306107515',
  phone2 = '9745897834',
  email = 'lascigal@gmail.com',
  addressLine1 = 'Las Cigal Convention Center, Kalampoor, Muvattupuzha',
  addressPincode = '686673',
  mapsUrl = 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8',
  mapsEmbed = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14223.02209307127!2d76.6284003!3d9.9972091!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07e79536923b0b%3A0x1d30fe64d311d295!2sLas%20Cigal%20Convention%20Centre%2C%20Kalampoor!5e1!3m2!1sen!2sin!4v1758356626772!5m2!1sen!2sin',
  logo = 'images/laslogo1.png',
}: FooterProps) {
  return (
    <footer className="las_main_footer">
      {/* 1. INTERACTIVE GOOGLE MAPS SECTION */}
      {mapsEmbed && (
        <div className="las_footer_map_section">
          <div className="las_footer_map_container">
            <div className="las_footer_map_header">
              <div>
                <span className="las_map_badge">VISIT US</span>
                <h3 className="las_map_title">Prime Location in Kalampoor, Muvattupuzha</h3>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="las_map_directions_btn"
              >
                <i className="fa-solid fa-location-dot"></i>
                <span>Get Directions on Google Maps</span>
              </a>
            </div>

            <div className="las_footer_iframe_wrap">
              <iframe
                src={mapsEmbed}
                width="100%"
                height="380"
                style={{ border: 0, display: 'block' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lascigal Convention Centre Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* 2. FOOTER CONTENT GRID */}
      <div className="las_footer_grid_wrap">
        <div className="las_footer_container">
          <div className="las_footer_columns">
            {/* Column 1: Brand Info */}
            <div className="las_footer_col las_footer_brand_col">
              <Link href="/" className="las_footer_logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(logo)}
                  alt="Lascigal Convention Centre Logo"
                  style={{ height: '75px', width: 'auto', objectFit: 'contain' }}
                />
              </Link>
              <p className="las_footer_about">
                Lascigal Convention Centre provides world-class air-conditioned event halls,
                luxury banquet dining, and generous parking for weddings, conferences, and celebrations.
              </p>
              <div className="las_footer_socials">
                <a href="#" aria-label="Facebook" className="las_social_btn">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" aria-label="Instagram" className="las_social_btn">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" aria-label="YouTube" className="las_social_btn">
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  href={`https://wa.me/91${phone1}?text=Hello%20Lascigal`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="las_social_btn las_social_wa"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="las_footer_col">
              <h4 className="las_footer_heading">Explore</h4>
              <ul className="las_footer_links">
                <li><Link href="/">Home Page</Link></li>
                <li><Link href="/aboutus">About Our Venue</Link></li>
                <li><Link href="/#facilities">Venue Facilities</Link></li>
                <li><Link href="/portfolio">Events & Portfolios</Link></li>
                <li><Link href="/gallery">Photo Gallery</Link></li>
                <li><Link href="/contactus">Contact & Reservations</Link></li>
              </ul>
            </div>

            {/* Column 3: Event Types */}
            <div className="las_footer_col">
              <h4 className="las_footer_heading">Celebrations</h4>
              <ul className="las_footer_links">
                <li><Link href="/events/weddings-receptions">Grand Weddings</Link></li>
                <li><Link href="/events/engagement-betrothal">Engagements & Betrothals</Link></li>
                <li><Link href="/events/corporate-conferences">Corporate Conferences</Link></li>
                <li><Link href="/events/birthdays-anniversaries">Birthdays & Anniversaries</Link></li>
                <li><Link href="/events/exhibitions-trade-fairs">Trade Expos & Exhibitions</Link></li>
                <li><Link href="/events/award-ceremonies-galas">Award Shows & Galas</Link></li>
              </ul>
            </div>

            {/* Column 4: Direct Contact */}
            <div className="las_footer_col">
              <h4 className="las_footer_heading">Contact & Booking</h4>
              <div className="las_footer_contact_list">
                <div className="las_footer_contact_item">
                  <i className="fa-solid fa-location-dot" style={{ color: '#c5a880' }}></i>
                  <div>
                    <span>{addressLine1}</span>
                    <br />
                    <span>PIN: {addressPincode}</span>
                  </div>
                </div>

                <div className="las_footer_contact_item">
                  <i className="fas fa-phone" style={{ color: '#c5a880' }}></i>
                  <div>
                    <a href={`tel:${phone1}`}>{phone1}</a>
                    <span style={{ margin: '0 6px', color: '#666' }}>/</span>
                    <a href={`tel:${phone2}`}>{phone2}</a>
                  </div>
                </div>

                <div className="las_footer_contact_item">
                  <i className="fas fa-envelope" style={{ color: '#c5a880' }}></i>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>

                <div className="las_footer_contact_item">
                  <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
                  <a
                    href={`https://wa.me/91${phone1}?text=Hello%20Lascigal%20Convention%20Centre`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#25D366', fontWeight: 600 }}
                  >
                    Direct WhatsApp Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COPYRIGHT BAR */}
      <div className="las_footer_bottom">
        <div className="las_footer_container las_footer_bottom_inner">
          <p className="las_copyright_text">
            &copy; {new Date().getFullYear()} Lascigal Convention Centre. All rights reserved.
          </p>
          <div className="las_footer_bottom_links">
            <Link href="/admin" className="las_admin_link">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
