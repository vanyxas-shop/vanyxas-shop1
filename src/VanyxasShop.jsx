import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, Instagram, Package, Bike, Search, Shirt, Glasses, Mail, Phone } from "lucide-react";

// --- Data pulled from the user's provided Vinted links (prices/sizes as listed there) ---
// Image URLs point to the public CDN versions of the listing photos.
// Fulfilment: London only (local delivery or pickup). Contact via Instagram, Gmail, or Phone.

const CONTACT = {
  instagram: "https://instagram.com/ivan_sokoliuk_",
  gmail: "vanyxas10@gmail.com",
  phoneRaw: "+447436998428",
  phoneDisplay: "+44 7436 998428"
};

const PRODUCTS = [
  {
    id: "6978644170",
    title: "Nike P-6000 Earth 'Light Bone' (Women)",
    price: 90.0,
    currency: "GBP",
    size: "UK 10 (Women)",
    condition: "Brand New",
    colours: ["White", "Grey", "Brown"],
    category: "Footwear",
    image: "https://images1.vinted.net/t/03_00d74_7ftRvytWmTjABGKSEDLRC8et/f800/1756589808.webp?s=2771bb446e563022a0a93a13cdaf7adfb30b1005",
    source: "https://www.vinted.co.uk/items/6978644170-nike-p-6000-earth-light-bone",
  },
  {
    id: "6978631295",
    title: "Real Madrid Dragon Special Edition (Black 23/24)",
    price: 27.99,
    currency: "GBP",
    size: "L",
    condition: "New with tags",
    colours: ["Black", "Gold"],
    category: "Football Shirts",
    image: "https://images1.vinted.net/t/02_0211a_RCGWzXZdapfskzaGnoFvX8Gr/f800/1756589547.webp?s=5e4887d544ddea42342df09f3377348eeb6fc9e6",
    source: "https://www.vinted.co.uk/items/6978631295-real-madrid-dragon-special-edition-black-23-24",
  },
  {
    id: "6978613505",
    title: "Adidas Pink Dragon Graphic Polo Shirt",
    price: 21.99,
    currency: "GBP",
    size: "L",
    condition: "New with tags",
    colours: ["Pink", "Rose"],
    category: "Football Shirts",
    image: "https://images1.vinted.net/t/04_001e6_VuD6X5QK499HiTTiRm6ucpqB/f800/1756589199.webp?s=e22deade764631a0d6324d7c0463397af7b92101",
    source: "https://www.vinted.co.uk/items/6978613505-adidas-pink-dragon-graphic-polo-shirt",
  },
  {
    id: "6976604420",
    title: "AC Milan Kaka Jersey 2007 UCL Final — Authentic Player Version",
    price: 34.00,
    currency: "GBP",
    size: "XL",
    condition: "New with tags",
    colours: ["White"],
    category: "Football Shirts",
    image: "https://images1.vinted.net/t/02_00250_LgnjHnd6onJNVeR1kdR5ARh7/f800/1756570455.webp?s=0ea0d0d1f1138d7595ed2020e449f685ed38c6f9",
    source: "https://www.vinted.co.uk/items/6976604420-ac-milan-kaka-jersey-2007-champions-league-final-authentic-player-version",
  },
  {
    id: "6976563696",
    title: "Authentic Nike Player Version Jersey — Size L (Brand New)",
    price: 39.99,
    currency: "GBP",
    size: "L",
    condition: "Brand New",
    colours: ["Blue", "Pink"],
    category: "Football Shirts",
    image: "https://images1.vinted.net/t/01_00882_oWgDCWnvdHxhm3vVG9kgBMY6/f800/1756570205.webp?s=7f54a25dabe940a18310086861a905dfeff8c196",
    source: "https://www.vinted.co.uk/items/6976563696-authentic-nike-player-version-jersey-size-l-brand-new",
  },
  {
    id: "6976347117",
    title: "Japan Dragon Samurai Graphic Football Shirt",
    price: 19.99,
    currency: "GBP",
    size: "L",
    condition: "New with tags",
    colours: ["Multi", "Black"],
    category: "Football Shirts",
    image: "https://images1.vinted.net/t/04_01704_kcqMSXYfDav1uThE7TidnSv6/f800/1756589255.webp?s=09620ae2ef65556dc7024459432e87527f09daea",
    source: "https://www.vinted.co.uk/items/6976347117-japan-dragon-samurai-graphic-football-shirt",
  },
  {
    id: "6856983623",
    title: "Authentic CHANEL Gold Round Sunglasses",
    price: 300.0,
    currency: "GBP",
    size: "—",
    condition: "New with tags",
    colours: ["Gold"],
    category: "Accessories",
    image: "https://images1.vinted.net/t/01_00b8c_95D1mc8egAMBQ4jw54uiAhmp/f800/1755001399.webp?s=dfebf12f38956e15af1faafd5bae1ba9fbba1957",
    source: "https://www.vinted.co.uk/items/6856983623-authentic-chanel-gold-round-sunglasses-luxury-statement-piece",
  },
];

const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Football Shirts", value: "Football Shirts" },
  { label: "Footwear", value: "Footwear" },
  { label: "Accessories", value: "Accessories" },
];

const formatGBP = (n) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

const Badge = ({ children }) => (
  <span className="inline-flex items-center rounded-2xl border px-3 py-1 text-xs font-medium shadow-sm">
    {children}
  </span>
);

const Pill = ({ children }) => (
  <span className="rounded-full bg-black/5 px-3 py-1 text-xs">{children}</span>
);

const ProductCard = ({ item, onSelect }) => (
  <motion.div layout className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow">
    <div className="aspect-square w-full overflow-hidden bg-gray-50">
      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <div className="space-y-2 p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold">{item.title}</h3>
        <span className="shrink-0 text-sm font-bold">{formatGBP(item.price)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{item.category}</Badge>
        {item.size && <Pill>Size: {item.size}</Pill>}
        <Pill>{item.condition}</Pill>
      </div>
      <button onClick={() => onSelect(item)} className="mt-2 w-full rounded-xl bg-black px-4 py-2 text-white hover:bg-black/90">View details</button>
    </div>
  </motion.div>
);

const DetailSheet = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
        <button onClick={onClose} className="absolute right-3 top-3 rounded-full border px-3 py-1 text-sm">Close</button>
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold">{formatGBP(item.price)}</span>
              <Badge>{item.condition}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              {item.size && <Pill>Size: {item.size}</Pill>}
              {item.colours?.map((c) => (
                <Pill key={c}>{c}</Pill>
              ))}
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>London only. Local delivery and pickup available.</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> London, United Kingdom</p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-white hover:bg-black/90">
                <Instagram className="h-4 w-4" /> DM on Instagram
              </a>
              <a href={`mailto:${CONTACT.gmail}`} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50">
                <Mail className="h-4 w-4" /> Email
              </a>
              <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50">
                <Phone className="h-4 w-4" /> Call
              </a>
              <a href={item.source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border px-4 py-2 hover:bg-gray-50">
                View original listing
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function VanyxasShop() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) =>
      (cat === "all" || p.category === cat) &&
      (p.title.toLowerCase().includes(query.toLowerCase()) || (p.size ?? "").toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, cat]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-sm"><ShoppingBag className="h-5 w-5" /></div>
            <div>
              <h1 className="text-lg font-extrabold leading-tight">VANYXAS • London</h1>
              <p className="text-xs text-gray-500">Curated streetwear & luxury — local only</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-3">
            <div className="hidden items-center gap-2 rounded-2xl border px-3 py-2 md:flex">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or sizes" className="w-64 bg-transparent text-sm outline-none" />
            </div>
            <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-white hover:bg-black/90"><Instagram className="h-4 w-4"/>DM on Instagram</a>
            <a href={`mailto:${CONTACT.gmail}`} className="hidden md:inline-flex items-center gap-2 rounded-2xl border px-3 py-2 hover:bg-gray-50"><Mail className="h-4 w-4"/>{CONTACT.gmail}</a>
            <a href={`tel:${CONTACT.phoneRaw}`} className="hidden md:inline-flex items-center gap-2 rounded-2xl border px-3 py-2 hover:bg-gray-50"><Phone className="h-4 w-4"/>{CONTACT.phoneDisplay}</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-2 pt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="order-2 space-y-4 rounded-3xl border bg-white p-6 shadow-sm md:order-1 md:col-span-3">
            <h2 className="text-2xl font-extrabold">London-only sales • Pickup & Local Delivery</h2>
            <p className="text-sm text-gray-600">We operate only within London. Choose <strong>pickup</strong> (Central/Zone 1–2). Payments handled via Instagram DM coordination or contact via Gmail / Phone.</p>
            <div className="flex flex-wrap gap-2 text-sm">
              <Pill className=""><Package className="mr-1 inline h-3 w-3"/>Pickup</Pill>
              <Pill><Bike className="mr-1 inline h-3 w-3"/>Local courier</Pill>
              <Pill><MapPin className="mr-1 inline h-3 w-3"/>London only</Pill>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="order-1 rounded-3xl border bg-white p-6 shadow-sm md:order-2 md:col-span-2">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
              <Shirt className="h-4 w-4"/> <span>Footy shirts & streetwear</span>
              <Glasses className="ml-3 h-4 w-4"/> <span>Luxury accessories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.value} onClick={() => setCat(c.value)} className={`rounded-full border px-3 py-1 text-sm ${cat === c.value ? "bg-black text-white" : "hover:bg-gray-50"}`}>{c.label}</button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-2xl border px-3 py-2 md:hidden">
              <Search className="h-4 w-4" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products or sizes" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <ProductCard key={item.id} item={item} onSelect={setSelected} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <h4 className="text-sm font-bold">About</h4>
            <p className="mt-2 text-sm text-gray-600">Independent London seller curating football shirts, sneakers, and luxury accessories. Message on Instagram, email, or phone to buy. No nationwide shipping.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold">Delivery</h4>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• <strong>London only</strong> (Zones 1–4)</li>
              <li>• Pickup r</li>
              <li>• </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold">Contact</h4>
            <div className="mt-2 flex flex-col gap-2">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2 text-white hover:bg-black/90">
                <Instagram className="h-4 w-4"/> @ivan_sokoliuk_
              </a>
              <a href={`mailto:${CONTACT.gmail}`} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 hover:bg-gray-50">
                <Mail className="h-4 w-4" /> {CONTACT.gmail}
              </a>
              <a href={`tel:${CONTACT.phoneRaw}`} className="inline-flex items-center gap-2 rounded-2xl border px-3 py-2 hover:bg-gray-50">
                <Phone className="h-4 w-4" /> {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} VANYXAS London. All photos and product names belong to their respective owners. Prices subject to change.</div>
      </footer>

      <DetailSheet item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
