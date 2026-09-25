import { ArrowRight, Clock3, Instagram, MapPin, MessageCircle, Sparkles } from "lucide-react";
import type { MenuPage } from "../../data/menu";
import { FoodImage } from "./FoodImage";

export function PageHeading({ eyebrow, title }: { eyebrow?: string | undefined; title: string }) {
  return (
    <header className="page-heading">
      {eyebrow && <p>{eyebrow}</p>}
      <h2>{title}</h2>
      <span aria-hidden="true">◆</span>
    </header>
  );
}

export function PageFolio({ number }: { number: number }) {
  return <span className="page-folio">{String(number).padStart(2, "0")}</span>;
}

export function MenuItemRow({
  name,
  description,
  price,
}: {
  name: string;
  description: string;
  price: string;
}) {
  return (
    <div className="menu-item">
      <div>
        <h3>{name}</h3>
        <p>{description}</p>
      </div>
      <span>{price}</span>
    </div>
  );
}

export function MenuPageContent({
  page,
  pageNumber,
  onOpen,
}: {
  page: MenuPage;
  pageNumber: number;
  onOpen?: (() => void) | undefined;
}) {
  if (page.kind === "cover") {
    return (
      <div className="cover-content">
        <FoodImage sources={page.images} alt={page.imageAlt ?? ""} className="cover-photo" />
        <div className="cover-scrim" aria-hidden="true" />
        <div className="cover-border">
          <div className="cover-emblem">S</div>
          <p>{page.subtitle}</p>
          <h1>{page.title}</h1>
          <div className="cover-rule">
            <span>Our Menu</span>
          </div>
          <button type="button" className="open-menu" onClick={onOpen}>
            Tap to open <ArrowRight />
          </button>
        </div>
      </div>
    );
  }

  if (page.kind === "welcome") {
    return (
      <div className="page-inner welcome-page">
        <PageHeading eyebrow={page.eyebrow} title={page.title} />
        <p className="welcome-copy">{page.subtitle}</p>
        <div className="chef-note">
          <span>"</span>
          <p>We bake not to impress, but to make your day taste a little warmer.</p>
          <strong>— The Slivasa Kitchen</strong>
        </div>
        <div className="botanical" aria-hidden="true">
          ✦
        </div>
        <PageFolio number={pageNumber} />
      </div>
    );
  }

  if (page.kind === "offers") {
    return (
      <div className="page-inner offers-page">
        <PageHeading eyebrow={page.eyebrow} title={page.title} />
        <div className="offer-seal">
          <Sparkles />
          <strong>10% off</strong>
          <span>Brownie &amp; beverage pairing</span>
        </div>
        <p className="offer-copy">{page.subtitle}</p>
        <div className="contact-list">
          <span>
            <MapPin /> Address available at the counter
          </span>
          <span>
            <Clock3 /> Opening hours to be added
          </span>
          <span>
            <MessageCircle /> WhatsApp number to be added
          </span>
          <span>
            <Instagram /> Instagram handle to be added
          </span>
        </div>
        <div className="thank-you">
          <span>Thank you</span>
          <small>for sharing a sweet moment with us</small>
        </div>
        <PageFolio number={pageNumber} />
      </div>
    );
  }

  // kind === "menu"
  return (
    <div className="page-inner menu-list-page">
      <PageHeading eyebrow={page.eyebrow} title={page.title} />
      {page.images && page.images.length > 0 && (
        <div className="image-container menu-photo">
          <FoodImage sources={page.images} alt={page.imageAlt ?? ""} width={1200} height={912} />
        </div>
      )}
      <div className="menu-items">
        {page.items?.map((item) => (
          <MenuItemRow key={item.name} {...item} />
        ))}
      </div>
      <PageFolio number={pageNumber} />
    </div>
  );
}
