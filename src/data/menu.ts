import coverImage from "../assets/slivasa-cover.jpg";
import browniesImage from "../assets/brownies.jpg";
import cakesImage from "../assets/cakes.jpg";
import confectionsImage from "../assets/confections.jpg";

export type MenuItem = { name: string; description: string; price: string };

export type MenuPage = {
  kind: "cover" | "welcome" | "menu" | "offers";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Ordered list of candidate images. The first one that loads is used;
   * later ones are a fallback chain if an earlier image fails to load. */
  images?: string[];
  imageAlt?: string;
  items?: MenuItem[];
};

export const pages: [MenuPage, ...MenuPage[]] = [
  {
    kind: "cover",
    title: "Slivasa",
    subtitle: "Restaurant & Café",
    images: [coverImage],
    imageAlt: "Chocolate cake with coffee on a dark wooden table",
  },
  {
    kind: "welcome",
    eyebrow: "A note from our kitchen",
    title: "Made for slow moments",
    subtitle:
      "At Slivasa, familiar recipes meet patient craft. Every brownie, cake and confection is baked in small batches, with honest ingredients and a generous hand.",
  },
  {
    kind: "menu",
    eyebrow: "From the oven",
    title: "Brownies",
    images: [browniesImage],
    imageAlt: "Stack of rich walnut fudge brownies",
    items: [
      { name: "Fudge Brownie", description: "Dense, soft and deeply chocolatey", price: "₹120" },
      { name: "Chocolate Chip", description: "Dark cocoa crumb, molten chips", price: "₹135" },
      { name: "Nuts Brownie", description: "Toasted walnut and chocolate", price: "₹145" },
      { name: "Double Chocolate", description: "Cocoa ganache, chocolate chunks", price: "₹155" },
      { name: "Triple Chocolate", description: "Dark, milk and white chocolate", price: "₹175" },
    ],
  },
  {
    kind: "menu",
    eyebrow: "Tea-time favourites",
    title: "Tea Cakes",
    images: [cakesImage],
    imageAlt: "Sliced vanilla and marble tea cake on a plate",
    items: [
      { name: "Vanilla Tea Cake", description: "Madagascan vanilla, tender crumb", price: "₹320" },
      {
        name: "Strawberry Tea Cake",
        description: "Berry preserve and vanilla glaze",
        price: "₹360",
      },
      { name: "Marble Tea Cake", description: "Vanilla and cocoa swirls", price: "₹350" },
      { name: "Chocolate Tea Cake", description: "Dark cocoa with a satin glaze", price: "₹380" },
    ],
  },
  {
    kind: "menu",
    eyebrow: "For every celebration",
    title: "Cakes",
    images: [cakesImage],
    imageAlt: "Elegant celebration cake with chocolate curls and strawberries",
    items: [
      { name: "White Forest", description: "Vanilla sponge, cherries and cream", price: "₹720" },
      { name: "Black Forest", description: "Chocolate sponge and cherry compote", price: "₹760" },
      { name: "Chocolate Truffle", description: "Silky ganache and cocoa sponge", price: "₹820" },
      { name: "Strawberry", description: "Fresh cream and berry preserve", price: "₹780" },
      { name: "Classic Vanilla", description: "Vanilla bean and cloud-soft cream", price: "₹680" },
    ],
  },
  {
    kind: "menu",
    eyebrow: "Baked until golden",
    title: "Cookies",
    images: [confectionsImage],
    imageAlt: "Artisan butter cookies arranged on a tray",
    items: [
      { name: "Butter Swirls", description: "Delicate, crisp and buttery", price: "₹180" },
      { name: "Choco Chunk", description: "Soft centre, dark chocolate chunks", price: "₹220" },
      { name: "Oat & Almond", description: "Toasted oats and almond flakes", price: "₹210" },
      { name: "Jam Thumbprints", description: "Shortbread with berry preserve", price: "₹200" },
    ],
  },
  {
    kind: "menu",
    eyebrow: "Hand-finished",
    title: "Chocolates",
    images: [confectionsImage, browniesImage],
    imageAlt: "Handmade dark chocolates and pralines",
    items: [
      { name: "Classic Truffles", description: "Dark chocolate ganache", price: "₹240" },
      { name: "Roasted Almond", description: "Whole almonds in milk chocolate", price: "₹260" },
      { name: "Coffee Pralines", description: "Espresso caramel centre", price: "₹280" },
      { name: "Celebration Box", description: "A handpicked assortment of twelve", price: "₹640" },
    ],
  },
  {
    kind: "offers",
    eyebrow: "A little more to share",
    title: "Slivasa Specials",
    subtitle:
      "Pair any two brownies with two café beverages and enjoy 10% off. Celebration cake pre-orders include a complimentary message plaque.",
  },
];

export const getPage = (index: number): MenuPage => pages[index] ?? pages[0];
