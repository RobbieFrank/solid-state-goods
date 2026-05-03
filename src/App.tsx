import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Instagram
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleProductsClick = () => {
    if (window.location.pathname === '/') {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#products');
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-paper/80 backdrop-blur-md border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <Link to="/">
            <span className="font-sans font-bold text-lg tracking-tighter uppercase leading-none">Solid State Goods</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="text-sm font-medium hover:text-muted transition-colors">About</Link>
          <button onClick={handleProductsClick} className="text-sm font-medium hover:text-muted transition-colors">Products</button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full bg-paper border-b border-ink/5 p-6 flex flex-col gap-4 md:hidden"
          >
            <Link to="/about" className="text-lg font-medium" onClick={() => setIsOpen(false)}>About</Link>
            <button onClick={handleProductsClick} className="text-lg font-medium text-left">Products</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-28 pb-14 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/hero.png"
          alt="Machined aluminum surface"
          className="w-full h-full object-cover grayscale opacity-15 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-paper/20" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="type-display mb-8"
        >
          Precision products for serious humans.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="type-body-lg text-muted max-w-2xl mx-auto mb-12"
        >
          Welcome to Solid State Goods. We over-engineer everyday products to last a lifetime. Buy it once and use it forever. We guarantee that you'll never need another one, unless you want two or three, or…
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#batch"
            className="w-full sm:w-auto bg-ink text-paper px-8 py-4 rounded-lg font-bold hover:bg-muted hover:text-ink hover:scale-[1.02] transition-all flex items-center justify-center gap-2 tracking-widest text-sm"
          >
            Preorder The Knuckle <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface VariantCardProps {
  label: string;
  title: string;
  desc: string;
  price: string;
  image: string;
  badge?: string;
}

const VariantCard: React.FC<VariantCardProps> = ({
  label,
  title,
  desc,
  price,
  image,
  badge
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group bg-white rounded-2xl overflow-hidden border border-ink/5 shadow-sm hover:shadow-xl transition-all h-full flex flex-col"
  >
    <div className="aspect-square relative overflow-hidden bg-paper/50">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      {badge && (
        <span className="absolute top-4 right-4 bg-ink text-paper type-micro px-3 py-1 rounded-full">
          {badge}
        </span>
      )}
    </div>
    <div className="p-8 flex-grow flex flex-col">
      <span className="technical-label">{label}</span>
      <h3 className="type-h3 mb-3">{title}</h3>
      <p className="type-body text-muted mb-6 flex-grow">{desc}</p>
      <div className="pt-6 border-t border-ink/5 flex items-end justify-between">
        <div className="flex flex-col">
          <span className="technical-label !mb-0 opacity-50">Retail</span>
          <span className="text-2xl font-mono tracking-tighter">{price}</span>
        </div>
        <a
          href="#batch"
          className="inline-flex items-center gap-0 group-hover:gap-2 p-3 group-hover:px-4 bg-ink/5 rounded-lg hover:bg-ink hover:text-paper transition-all duration-300 group-hover:bg-ink group-hover:text-paper"
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-300 text-xs font-bold tracking-tight">
            Reserve
          </span>
          <ArrowRight size={20} className="shrink-0" />
        </a>
      </div>
    </div>
  </motion.div>
);

const Variants = () => {
  const [isSpecsOpen, setIsSpecsOpen] = React.useState(false);
  const variants: VariantCardProps[] = [
    {
      label: "Now Available",
      title: "Silver Standard",
      desc: "Fresh-out-of-the-oven raw billet finish. Clean, industrial, and pairs perfectly with any high-end setup.",
      price: "$60",
      image: "/silver_standard.png"
    },
    {
      label: "Coming Soon",
      title: "Silver Satin",
      desc: "Smooth powder coat finish. All the weight, none of the shine. Ideal for low-glare environments.",
      price: "$70",
      image: "/silver_satin.png"
    },
    {
      label: "Now Available",
      title: "Black Standard",
      desc: "Hard anodized matte black. Built for the player who means business. Stealthy and scratch-resistant.",
      price: "$80",
      image: "/anodized_black.png"
    },
    {
      label: "Now Available",
      title: "Black Custom",
      badge: "Most Popular For Team Sets",
      desc: "Laser-engrave your name, team logo, or anything you want. Precision marked forever.",
      price: "From $90",
      image: "/anodized_black_x.png"
    }
  ];

  const specs = [
    { label: 'DIMENSIONS', content: '• Width: 3"\n• Length: 3.5"\n• Height: .75"' },
    { label: 'CAPACITY', content: 'Designed for dual-cue storage, ensuring a precise fit for all standard pool and break cues.' },
    { label: 'CHASSIS', content: 'CNC-machined from a single, solid block of 6061-T6 Billet Aluminum.' },
    { label: 'STABILITY', content: 'Features a high-friction, non-marring grip pad that is safe for use on any surface.' },
    { label: 'ENGINEERING', content: 'Utilizes solid-state architecture, meaning there are zero moving parts and zero points of failure.' },
    { label: 'FINISHES', content: '• Machine-finished (Silver Standard)\n• Bead-Blasted (Silver Satin)\n• Anodized (Black Standard and Black Custom)' },
    { label: 'PORTABILITY', content: 'Enhanced by its pocket-sized footprint, which is ideal for league play and tournament travel.' },
    { label: 'MAINTENANCE', content: 'Corrosion-resistant, impervious to moisture, and built to withstand high-impact drops.' },
  ];

  return (
    <section id="products" className="py-32 px-6 bg-paper">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <h2 className="type-h1 mb-6">The Knuckle</h2>
        <p className="type-body max-w-2xl mx-auto text-muted">
          Most cue holders are cheap, generic, and built to fail. We built The Knuckle because we wanted something better. It's a solid, precision-machined block of aluminum designed to stay exactly where you put it. It's the last cue holder you'll ever need to buy.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {variants.map((v, i) => (
          <VariantCard
            key={i}
            label={v.label}
            title={v.title}
            desc={v.desc}
            price={v.price}
            image={v.image}
            badge={v.badge}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center">
          <p className="type-small text-muted">
            Orders with 5+ qualify for our <span className="text-[#5C6068] font-medium">Team Tier</span> discount rates.
          </p>
        </div>

        <div className="w-full">
          <button
            onClick={() => setIsSpecsOpen(!isSpecsOpen)}
            className="flex items-center gap-4 group mx-auto mb-8"
          >
            <div className="w-20 h-[1px] bg-ink/10 group-hover:w-28 transition-all duration-500" />
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-ink/10 rounded-full shadow-sm hover:shadow-md hover:border-ink/20 transition-all">
              <span className="type-small text-ink/80">Product Details</span>
              <motion.div
                animate={{ rotate: isSpecsOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <ChevronDown size={14} className="text-ink/40" />
              </motion.div>
            </div>
            <div className="w-20 h-[1px] bg-ink/10 group-hover:w-28 transition-all duration-500" />
          </button>

          <AnimatePresence>
            {isSpecsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-8 pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-ink/10 bg-white">
                    {specs.map((item, index) => (
                      <div key={index} className="p-10 border-r border-b border-ink/10 flex flex-col min-h-[220px]">
                        <span className="type-micro text-ink/30 block mb-6">
                          {item.label}
                        </span>
                        <p className="type-small text-ink/70 whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Philosophy = () => (
  <section id="philosophy" className="py-32 px-6 border-y border-ink/5 relative overflow-hidden bg-white/50">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Logo treated as a manufacturer's mark / stamp */}
        <div className="lg:col-span-5">
          <div className="relative">
            {/* Frame with corner ticks */}
            <div className="relative aspect-square bg-ink p-10 md:p-14 rounded-sm shadow-2xl">
              {/* Corner ticks for a technical-drawing feel */}
              <span className="absolute top-3 left-3 w-4 h-px bg-paper/30" />
              <span className="absolute top-3 left-3 w-px h-4 bg-paper/30" />
              <span className="absolute top-3 right-3 w-4 h-px bg-paper/30" />
              <span className="absolute top-3 right-3 w-px h-4 bg-paper/30" />
              <span className="absolute bottom-3 left-3 w-4 h-px bg-paper/30" />
              <span className="absolute bottom-3 left-3 w-px h-4 bg-paper/30" />
              <span className="absolute bottom-3 right-3 w-4 h-px bg-paper/30" />
              <span className="absolute bottom-3 right-3 w-px h-4 bg-paper/30" />

              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Solid State Goods"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Inscribed plate beneath the logo */}
            <div className="mt-4 flex items-center justify-between type-micro text-ink/40">
              <span>Est. MMXXVI</span>
              <span className="hidden sm:inline">Solid · State · Goods</span>
              <span>Made in USA</span>
            </div>
          </div>
        </div>

        {/* Copy block */}
        <div className="lg:col-span-7 lg:pl-8">
          <div className="inline-flex items-center mb-8">
            <span className="technical-label !mb-0">About Solid State Goods</span>
          </div>
          <h2 className="type-h2 mb-8 text-ink">
            Our objective is total structural permanence.
          </h2>
          <div className="space-y-6 text-muted max-w-xl">
            <p className="type-body-lg">
              We reject the modern cycle of obsolescence, favoring materials that gain character through use while maintaining their core functional integrity for generations.
            </p>
            <p className="type-body">
              Our journey began in a dusty workshop where a visionary designer and a cynical master machinist shared a single goal: to build products that never need to be replaced.
            </p>
            <p className="type-body">
              Every product we produce is the result of that initial friction. We don't just design objects; we document the battle between aesthetic form and physical reality, ensuring that the final result is indestructible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BatchSection = () => {
  return (
    <section id="batch" className="py-32 px-6 bg-paper border-t border-ink/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="type-h1 mb-4 text-ink">Ready for yours? Join the current batch.</h2>
          <p className="type-body-lg text-muted max-w-lg mx-auto">
            We build in small batches. Register your interest below, and we'll reach out to confirm the details.
          </p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl border border-ink/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="type-small text-ink/40">Full name *</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors text-sm"
              />
            </div>
            <div className="space-y-3">
              <label className="type-small text-ink/40">Email address *</label>
              <input
                type="email"
                placeholder="you@domain.com"
                className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3 relative">
              <label className="type-small text-ink/40">Variant interest</label>
              <div className="relative">
                <select className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors appearance-none pr-10 text-sm cursor-pointer">
                  <option>Silver Standard</option>
                  <option>Silver Satin</option>
                  <option>Black Standard</option>
                  <option>Black Custom</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30" size={16} />
              </div>
            </div>
            <div className="space-y-3">
              <label className="type-small text-ink/40">Quantity</label>
              <input
                type="number"
                defaultValue={1}
                className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="space-y-3 mb-10">
            <label className="type-small text-ink/40">Optional message</label>
            <textarea
              rows={4}
              placeholder="Example: I'm interested in a bulk order for my team, or I'd like my name engraved in a serif font."
              className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors text-sm resize-none"
            />
          </div>

          <div className="flex flex-col items-center gap-6 text-center">
            <button className="w-full bg-ink text-paper px-10 py-5 rounded-lg font-bold hover:bg-muted hover:text-ink hover:scale-[1.02] transition-all flex items-center justify-center gap-3 tracking-widest text-sm">
              Join the batch <ArrowRight size={18} />
            </button>
            <p className="type-small text-muted max-w-sm">
              No deposit required at this time. We'll verify your order details and lead time before we cut any metal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-ink/5 bg-paper/50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div className="flex flex-col">
          <span className="font-sans font-bold text-2xl tracking-tighter uppercase leading-none mb-4">Solid State Goods</span>
          <span className="type-small text-muted opacity-60 block">Buy it once. Use it forever.</span>
        </div>

        <div className="flex flex-col items-start md:items-end gap-6">
          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="type-small text-ink/40">For general inquiries or custom orders</span>
            <a href="mailto:solidstategoods@gmail.com" className="type-h3 hover:text-muted transition-colors border-b border-ink/20 pb-1">
              Contact Us
            </a>
          </div>
          <a
            href="https://www.instagram.com/solidstategoods/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-ink/60 hover:text-ink transition-colors group"
          >
            <Instagram size={18} className="group-hover:scale-110 transition-transform" />
            <span className="type-small">@solidstategoods</span>
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-ink/5 flex flex-col md:flex-row justify-between type-micro text-muted">
        <span>© 2026 Solid State Goods. Machined in the USA.</span>
      </div>
    </footer>
  );
};

const ProductsCTA = () => (
  <section className="py-32 px-6 bg-paper border-t border-ink/5">
    <div className="max-w-7xl mx-auto text-center">
      <h2 className="type-h2 mb-6">Ready to see what we make?</h2>
      <p className="type-body-lg text-muted max-w-2xl mx-auto mb-12">
        Browse The Knuckle and our finishes — built to outlast everything else in your bag.
      </p>
      <Link
        to="/#products"
        className="inline-flex items-center gap-2 bg-ink text-paper px-8 py-4 rounded-lg font-bold hover:bg-muted hover:text-ink hover:scale-[1.02] transition-all tracking-widest text-sm"
      >
        See The Knuckle <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

const HomePage = () => {
  useEffect(() => {
    if (window.location.hash === '#products') {
      const el = document.getElementById('products');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-ink selection:text-paper bg-paper">
      <Navbar />
      <main>
        <Hero />
        <Variants />
        <BatchSection />
      </main>
      <Footer />
    </div>
  );
};

const AboutPage = () => (
  <div className="min-h-screen selection:bg-ink selection:text-paper bg-paper">
    <Navbar />
    <main>
      <Philosophy />
      <ProductsCTA />
    </main>
    <Footer />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
