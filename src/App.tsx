import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Instagram
} from 'lucide-react';
import Mailcheck from 'mailcheck';
import { Analytics } from '@vercel/analytics/react';

const DISPOSABLE_EMAIL_DOMAINS = [
  'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'tempmail.com',
  'throwaway.email', 'yopmail.com', 'getnada.com', 'temp-mail.org',
  'maildrop.cc', 'fakeinbox.com', 'trashmail.com', 'sharklasers.com',
  'guerrillamailblock.com', 'pokemail.net', 'spam4.me', 'tempinbox.com',
  'dispostable.com', 'mintemail.com', 'mytrashmail.com', 'mailnesia.com'
];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const Logo = () => (
  <span className="flex items-center gap-2.5 text-ink">
    <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-sans font-bold text-[13px] tracking-tight leading-none pb-px" aria-hidden="true">
      ssg
    </span>
    <span className="font-sans font-bold text-[22px] tracking-tight leading-none pb-0.5 whitespace-nowrap">solid state goods</span>
  </span>
);

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
          <Link to="/" aria-label="Solid State Goods home">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/about" className="type-small font-medium hover:text-muted transition-colors">About</Link>
          <button onClick={handleProductsClick} className="type-small font-medium hover:text-muted transition-colors">Products</button>
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
            <Link to="/about" className="type-h3" onClick={() => setIsOpen(false)}>About</Link>
            <button onClick={handleProductsClick} className="type-h3 text-left">Products</button>
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
          className="type-body-lg text-muted max-w-2xl lg:max-w-none mx-auto mb-12"
        >
          <span className="lg:whitespace-nowrap">Welcome to Solid State Goods. We over-engineer everyday products</span>{' '}
          <br className="hidden lg:block" />
          <span className="lg:whitespace-nowrap">that last a lifetime. Buy it once and use it forever.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#batch"
            className="w-full sm:w-auto bg-ink text-paper border border-ink px-8 py-4 rounded-lg type-small font-medium hover:bg-transparent hover:text-ink transition-colors flex items-center justify-center gap-2"
          >
            Preorder The Knuckle <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

interface Finish {
  title: string;
  desc: string;
  price: string;
  pricePrefix?: string;
  image: string;
  swatch: string;
  badge?: string;
  comingSoon?: boolean;
}

const FINISHES: Finish[] = [
  {
    title: "Silver Satin",
    desc: "Bead-blasted satin finish. Muted, refined, and fits right into any setup.",
    price: "$70",
    image: "/silver_satin.jpg",
    swatch: "#A9ACB0"
  },
  {
    title: "Black Standard",
    desc: "Hard anodized matte black. Stealthy and scratch-resistant.",
    price: "$80",
    image: "/anodized_black.jpg",
    swatch: "#1C1C1C"
  },
  {
    title: "Black Custom",
    badge: "Most Popular For Team Sets",
    desc: 'Laser-engrave your name, team logo, or anything you want. Image dimensions 2.625" W x 2.625" L',
    price: "$90",
    pricePrefix: "Starting at",
    image: "/anodized_black_x.jpg",
    swatch: "#1C1C1C"
  }
];

// Lets the finish picker pre-select a variant in the preorder form.
const SELECT_VARIANT_EVENT = 'ssg:select-variant';

const FinishPicker = () => {
  const [selected, setSelected] = React.useState(0);
  const finish = FINISHES[selected];

  const reserve = () => {
    window.dispatchEvent(new CustomEvent(SELECT_VARIANT_EVENT, { detail: finish.title }));
    document.getElementById('batch')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="group max-w-5xl mx-auto bg-white rounded-2xl overflow-hidden border border-ink/5 shadow-sm grid grid-cols-1 md:grid-cols-[1.15fr_1fr] mb-16">
      <div className="aspect-square relative overflow-hidden bg-paper/50">
        {FINISHES.map((f, i) => (
          <img
            key={f.title}
            src={f.image}
            alt={f.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === selected ? 'opacity-100' : 'opacity-0'}`}
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      <div className="p-8 md:p-10 flex flex-col">
        <span className="technical-label">Finish</span>
        <div className="grid grid-cols-1 gap-2 mb-8" role="radiogroup" aria-label="Finish">
          {FINISHES.map((f, i) => (
            <button
              key={f.title}
              type="button"
              role="radio"
              aria-checked={i === selected}
              onClick={() => setSelected(i)}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg border text-left transition-colors ${i === selected ? 'border-ink ring-1 ring-ink' : 'border-ink/10 hover:border-ink/30'}`}
            >
              <span className="w-4 h-4 rounded-full shrink-0 border border-ink/10" style={{ backgroundColor: f.swatch }} />
              <span className="flex flex-1 items-center justify-between gap-2">
                <span className="type-small text-ink">{f.title}</span>
                {f.comingSoon && <span className="type-micro text-muted">Coming soon</span>}
              </span>
            </button>
          ))}
        </div>

        {(finish.badge || finish.comingSoon) && (
          <span className="self-start bg-ink/[0.06] text-ink/70 type-micro px-3 py-1 rounded-full mb-3">
            {finish.badge ?? 'Coming Soon'}
          </span>
        )}
        <h3 className="type-h3 mb-3">{finish.title}</h3>
        <p className="type-body text-muted mb-6 flex-grow">{finish.desc}</p>

        <div className="pt-6 border-t border-ink/5 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            {finish.pricePrefix && (
              <span className="technical-label !mb-0 opacity-50">{finish.pricePrefix}</span>
            )}
            <span className="type-h3">{finish.price}</span>
          </div>
          <button
            type="button"
            onClick={reserve}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg type-small font-medium transition-colors ${finish.comingSoon ? 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper' : 'bg-ink text-paper border border-ink hover:bg-transparent hover:text-ink'}`}
          >
            {finish.comingSoon ? 'Notify me' : `Reserve ${finish.title}`}
            <ArrowRight size={16} className="shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Variants = () => {
  const specs = [
    { label: 'DIMENSIONS', content: '• Width: 3"\n• Length: 3.75"\n• Height: .75"' },
    { label: 'CAPACITY', content: 'Designed for dual-cue storage, ensuring a precise fit for all standard pool and break cues.' },
    { label: 'CHASSIS', content: 'CNC-machined from a single, solid block of 6061-T6 Billet Aluminum.' },
    { label: 'STABILITY', content: 'Features a high-friction, non-marring grip pad that is safe for use on any surface.' },
    { label: 'ENGINEERING', content: 'Utilizes solid-state architecture, meaning there are zero moving parts and zero points of failure.' },
    { label: 'FINISHES', content: '• Bead-Blasted (Silver Satin)\n• Anodized (Black Standard and Black Custom)' },
    { label: 'PORTABILITY', content: 'Enhanced by its pocket-sized footprint, which is ideal for league play and tournament travel.' },
    { label: 'MAINTENANCE', content: 'Corrosion-resistant, impervious to moisture, and built to withstand high-impact drops.' },
  ];

  return (
    <section id="products" className="pt-10 pb-32 px-6 bg-paper scroll-mt-20">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <h2 className="type-h1 mb-6">The Knuckle</h2>
        <p className="type-body max-w-2xl mx-auto text-muted">
          Most cue holders are cheap, generic, and fail. We built The Knuckle because we wanted something better. It's a solid, precision-machined block of aluminum designed to be the last cue holder you'll ever need to buy.
        </p>
      </div>

      <FinishPicker />

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center">
          <p className="type-small text-muted">
            Orders with 5+ qualify for our <span className="text-[#5C6068] font-medium">Team Tier</span> discount rates.
          </p>
        </div>

        <div className="w-full">
          <div className="flex items-center gap-6 mb-8">
            <div className="flex-1 h-px bg-ink/10" />
            <h3 className="type-h3 text-ink">Product Details</h3>
            <div className="flex-1 h-px bg-ink/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-l border-t border-ink/10 bg-white">
            {specs.map((item, index) => (
              <div key={index} className="p-10 border-r border-b border-ink/10 flex flex-col min-h-[200px]">
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
      </div>
    </section>
  );
};

const Philosophy = () => (
  <section id="philosophy" className="py-32 px-6 border-y border-ink/5 relative overflow-hidden bg-white/50">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Copy block */}
        <div className="lg:col-span-8 lg:col-start-3">
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
            <p className="type-body-lg">
              Our journey began in a dusty workshop where a visionary designer and a cynical master machinist shared a single goal: to build products that never need to be replaced.
            </p>
            <p className="type-body-lg">
              Every product we produce is the result of that initial friction. We don't just design objects; we document the battle between aesthetic form and physical reality, ensuring that the final result is indestructible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const MAX_QUANTITY_LABEL = 'More than 5';
const QUANTITY_OPTIONS = ['1', '2', '3', '4', '5', MAX_QUANTITY_LABEL];

const BatchSection = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [variant, setVariant] = React.useState('Silver Satin');
  const [quantity, setQuantity] = React.useState('1');
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);

  useEffect(() => {
    const onSelect = (e: Event) => setVariant((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_VARIANT_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_VARIANT_EVENT, onSelect);
  }, []);

  const validateEmail = (value: string) => {
    if (!value || !value.includes('@')) return;
    const domain = value.split('@')[1]?.toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError('Please use a permanent email address.');
      setEmailSuggestion(null);
      return;
    }
    setEmailError(null);
    Mailcheck.run({
      email: value,
      suggested: (suggestion: { full: string }) => setEmailSuggestion(suggestion.full),
      empty: () => setEmailSuggestion(null),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateEmail(email);
    if (emailError) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b6bcc288-7a5f-4312-8ab3-ebae1c352727',
          subject: 'New Knuckle Preorder Inquiry',
          from_name: 'Solid State Goods Website',
          name,
          email,
          phone: phone.trim() || '(not provided)',
          variant,
          quantity,
          message: message || '(none)',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        window.gtag?.('event', 'generate_lead', { variant, quantity });
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Unable to send your inquiry. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setVariant('Silver Satin');
    setQuantity('1');
    setMessage('');
    setError(null);
    setEmailError(null);
    setEmailSuggestion(null);
  };

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
          {submitted ? (
            <div className="text-center py-8">
              <h3 className="type-h3 mb-4">You're on the list.</h3>
              <p className="type-body text-muted mb-8">
                We received your inquiry and will be in touch soon to confirm the details.
              </p>
              <button
                onClick={resetForm}
                className="type-small text-muted underline underline-offset-4 hover:text-ink transition-colors"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="checkbox"
                name="botcheck"
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3">
                  <label className="type-small text-muted">Full name *</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors type-small"
                  />
                </div>
                <div className="space-y-3">
                  <label className="type-small text-muted">Email address *</label>
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onBlur={e => validateEmail(e.target.value)}
                    className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors type-small"
                  />
                  {emailError && (
                    <p className="type-small text-red-600 mt-2">{emailError}</p>
                  )}
                  {!emailError && emailSuggestion && (
                    <p className="type-small text-muted mt-2">
                      Did you mean{' '}
                      <button
                        type="button"
                        onClick={() => { setEmail(emailSuggestion); setEmailSuggestion(null); }}
                        className="font-medium text-ink underline underline-offset-2 hover:text-muted transition-colors"
                      >
                        {emailSuggestion}
                      </button>
                      ?
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <label className="type-small text-muted">
                  Phone number<span className="text-muted"> (optional)</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors type-small"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-3 relative">
                  <label className="type-small text-muted">Variant interest</label>
                  <div className="relative">
                    <select
                      value={variant}
                      onChange={e => setVariant(e.target.value)}
                      className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors appearance-none pr-10 type-small cursor-pointer"
                    >
                      <option>Silver Satin</option>
                      <option>Black Standard</option>
                      <option>Black Custom</option>
                      <option>Multiple variants</option>
                      <option>Something else</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30" size={16} />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="type-small text-muted">Quantity</label>
                  <div className="relative">
                    <select
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors appearance-none pr-10 type-small cursor-pointer"
                    >
                      {QUANTITY_OPTIONS.map(q => <option key={q}>{q}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/30" size={16} />
                  </div>
                  {quantity === MAX_QUANTITY_LABEL && (
                    <p className="type-small text-muted">Tell us the quantity you need in the message below.</p>
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-10">
                <label className="type-small text-muted">Optional message</label>
                <textarea
                  rows={4}
                  placeholder="Example: I'm interested in a bulk order for my team, or I'd like my name engraved in a serif font."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full bg-paper/30 border border-ink/10 px-4 py-4 rounded-lg focus:outline-none focus:border-ink/30 transition-colors type-small resize-none"
                />
                <p className="type-small text-muted">Have a product idea of your own? We can help design, machine, and build it. Share the details above.</p>
              </div>

              <div className="flex flex-col items-center gap-6 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-ink text-paper border border-ink px-10 py-5 rounded-lg type-small font-medium hover:bg-transparent hover:text-ink transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink disabled:hover:text-paper"
                >
                  {submitting ? 'Submitting…' : 'Join the batch'} <ArrowRight size={18} />
                </button>
                {error && (
                  <p className="type-small text-red-600">{error}</p>
                )}
                <p className="type-small text-muted max-w-sm">
                  No deposit required at this time. We'll verify your order details and lead time before we cut any metal.
                </p>
                <p className="type-small text-muted max-w-sm">
                  By submitting, you agree to our <Link to="/privacy" className="text-ink underline underline-offset-4 hover:text-muted transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </form>
          )}
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
          <Link to="/" aria-label="Solid State Goods home" className="mb-4">
            <Logo />
          </Link>
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
        <Link to="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link>
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
        className="inline-flex items-center gap-2 bg-ink text-paper border border-ink px-8 py-4 rounded-lg type-small font-medium hover:bg-transparent hover:text-ink transition-colors"
      >
        See The Knuckle <ArrowRight size={18} />
      </Link>
    </div>
  </section>
);

const HomePage = () => {
  useEffect(() => {
    document.title = 'Solid State Goods — Precision products for serious humans.';
  }, []);

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

const AboutPage = () => {
  useEffect(() => {
    document.title = 'About — Solid State Goods';
  }, []);

  return (
    <div className="min-h-screen selection:bg-ink selection:text-paper bg-paper">
      <Navbar />
      <main>
        <Philosophy />
        <ProductsCTA />
      </main>
      <Footer />
    </div>
  );
};

const PRIVACY_SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'What we collect',
    body: (
      <>
        <p>When you submit the preorder form, we collect what you enter: your name, email address, phone number (optional), the finish and quantity you're interested in, and any message you include.</p>
        <p>When you browse the site, we collect anonymous usage data such as the pages you visit, how you arrived (for example, from Instagram or a search), your general location (country or city), and your device and browser type.</p>
      </>
    ),
  },
  {
    title: 'How we use it',
    body: (
      <>
        <p>We use your form details only to respond to your inquiry, confirm your order and lead time, and contact you about your order.</p>
        <p>We use usage data to understand how people find and use the site so we can improve it.</p>
        <p>We don't sell, rent, or trade your personal information, and we don't send marketing email unless you ask us to.</p>
        <p>We currently sell and ship within the United States.</p>
      </>
    ),
  },
  {
    title: 'Services we use',
    body: (
      <>
        <p><span className="text-ink">Web3Forms</span> delivers preorder form submissions to our email inbox.</p>
        <p><span className="text-ink">Google Analytics</span> measures site traffic. It uses cookies to recognize returning visitors. You can opt out with Google's <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4 hover:text-muted transition-colors">browser add-on</a> or by blocking cookies in your browser.</p>
        <p><span className="text-ink">Vercel</span> hosts the site and provides privacy-friendly analytics that do not use cookies.</p>
        <p>Each service handles data under its own privacy policy.</p>
      </>
    ),
  },
  {
    title: 'How long we keep it',
    body: (
      <p>We keep preorder emails for as long as needed to fulfill and support your order. Analytics data is kept for up to 14 months.</p>
    ),
  },
  {
    title: 'Your choices',
    body: (
      <p>You can ask us to show you, correct, or delete the information you've sent us at any time. Email <a href="mailto:solidstategoods@gmail.com" className="text-ink underline underline-offset-4 hover:text-muted transition-colors">solidstategoods@gmail.com</a> and we'll take care of it.</p>
    ),
  },
  {
    title: 'Changes',
    body: (
      <p>If we change this policy, we'll update it on this page and change the date below.</p>
    ),
  },
];

const PrivacyPage = () => {
  useEffect(() => {
    document.title = 'Privacy Policy — Solid State Goods';
  }, []);

  return (
    <div className="min-h-screen selection:bg-ink selection:text-paper bg-paper">
      <Navbar />
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="technical-label">Legal</span>
          <h1 className="type-h1 mb-6 text-ink">Privacy Policy</h1>
          <p className="type-body-lg text-muted mb-16">
            We collect as little as we need to answer your inquiry and run the site. Here's exactly what that means.
          </p>
          <div className="space-y-12">
            {PRIVACY_SECTIONS.map(section => (
              <section key={section.title} className="pt-8 border-t border-ink/10">
                <h2 className="type-h3 mb-4 text-ink">{section.title}</h2>
                <div className="type-body text-muted space-y-4">{section.body}</div>
              </section>
            ))}
          </div>
          <p className="type-micro text-muted mt-16">Last updated October 18, 2026</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Start every page at the top, including repeat clicks on the current page.
// Links to a section (e.g. /#products) are scrolled by the page itself.
const ScrollToTop = () => {
  const { key, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [key, hash]);
  return null;
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}
