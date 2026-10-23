import Link from 'next/link';
import MobileNav from './MobileNav';

interface HeaderProps {
  phone1?: string;
  phone2?: string;
  whatsapp?: string;
  mapsUrl?: string;
}

export default function Header({
  phone1 = '7306107515',
  phone2 = '9745897834',
  whatsapp = '917306107515',
  mapsUrl = 'https://maps.app.goo.gl/X1bke7LUrKtm5tHe8',
}: HeaderProps) {
  return (
    <>
      <div className="top_panel_fixed_wrap"></div>
      <header className="top_panel_wrap top_panel_style_2 scheme_original">
        <div className="top_panel_wrap_inner top_panel_inner_style_2 top_panel_position_above">
          <div className="top_panel_middle">
            <div className="content_wrap">
              <div className="columns_wrap columns_fluid">
                {/* Left: Contact Numbers */}
                <div
                  className="column-1_5 contact_field contact_phone"
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="contact_icon fas fa-phone" style={{ fontSize: '13px' }}></span>
                    <a href={`tel:${phone1}`} style={{ fontSize: '20px', textDecoration: 'none' }}>
                      {phone1}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="contact_icon fas fa-phone" style={{ fontSize: '13px' }}></span>
                    <a href={`tel:${phone2}`} style={{ fontSize: '20px', textDecoration: 'none' }}>
                      {phone2}
                    </a>
                  </div>
                </div>

                {/* Center: Main Logo */}
                <div className="column-3_5 contact_logo">
                  <div className="logo" style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link href="/">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/laslogo1.png"
                        className="logo_main"
                        alt="Lascigal Logo"
                        style={{ width: 'auto', height: '110px' }}
                      />
                    </Link>
                  </div>
                </div>

                {/* Right: WhatsApp & Map link */}
                <div className="column-1_5 contact_field contact_cart">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span className="contact_icon fab fa-whatsapp" style={{ fontSize: '13px', color: '#25D366' }}></span>
                    <span className="contact_label">
                      <a
                        className="cart_summa"
                        href={`https://wa.me/${whatsapp}?text=We%20are%20looking%20for%20convention%20center`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '20px', textDecoration: 'none' }}
                      >
                        {phone1}
                      </a>
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className="contact_icon fa-solid fa-location-dot"
                      style={{ fontSize: '13px', color: '#c5a880' }}
                    ></span>
                    <span className="contact_label">
                      <a
                        className="cart_summa"
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '20px', textDecoration: 'none' }}
                      >
                        Tap to locate
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="top_panel_bottom">
            <div className="content_wrap clearfix">
              <nav className="menu_main_nav_area menu_hover_fade">
                <ul id="menu_main" className="menu_main_nav">
                  <li className="menu-item">
                    <Link href="/">
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/aboutus">
                      <span>About</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/gallery">
                      <span>Gallery</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/portfolio">
                      <span>Portfolio</span>
                    </Link>
                  </li>
                  <li className="menu-item">
                    <Link href="/contactus">
                      <span>Contact Us</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header Drawer */}
      <MobileNav phone1={phone1} phone2={phone2} whatsapp={whatsapp} />
    </>
  );
}
