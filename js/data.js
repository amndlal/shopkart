/* ============================================================
   data.js — default seed data (used only on first run / reset)
   Images are inline SVG data-URIs so the app works fully offline
   with zero external dependencies. Replace via the Admin panel.
   ============================================================ */

// Tiny helper that builds a colored SVG "product photo" placeholder.
function ph(label, color) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
    <rect width='300' height='300' fill='${color}'/>
    <text x='150' y='160' font-size='28' font-family='Arial' fill='white'
      text-anchor='middle' font-weight='bold'>${label}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const DEFAULT_DATA = {
  settings: {
    storeName: 'Aura Shopping',
    tagline: 'Shop smart. Shop Aura.',
    bannerText: 'Up to 80% OFF — Premium deals across every category.',
    themeColor: '#1a1a2e',
    currency: '₹',
    footer: 'Aura Shopping — premium picks, best prices.',
  },
  slides: [
    { img: ph('Big Savings Days', '#2874f0'), heading: 'Big Savings Days', text: 'Up to 80% OFF across every category', link: '' },
    { img: ph('Latest Mobiles', '#388e3c'), heading: 'Latest 5G Mobiles', text: 'Top brands starting ₹18,999', link: 'Mobiles' },
    { img: ph('Fashion Sale', '#ff9f00'), heading: 'Fashion Fiesta', text: 'Flat 50% off on trending styles', link: 'Fashion' },
  ],
  categories: ['Electronics', 'Fashion', 'Home', 'Mobiles', 'Appliances', 'Toys'],
  products: [
    // Electronics
    { id: 'p1', title: 'Wireless Bluetooth Headphones', brand: 'BoomAudio', category: 'Electronics',
      price: 1299, mrp: 2999, rating: 4.3, img: ph('Headphones', '#2874f0'),
      desc: 'Over-ear wireless headphones with 30-hour battery, deep bass and active noise cancellation. Foldable design with premium cushioned ear cups.' },
    { id: 'p2', title: 'Laptop Backpack Water-Resistant', brand: 'CarryOn', category: 'Electronics',
      price: 899, mrp: 1999, rating: 4.3, img: ph('Backpack', '#3949ab'),
      desc: 'Fits 15.6" laptops, USB charging port, anti-theft pocket, rain cover included. Multiple compartments for organized storage.' },
    { id: 'p3', title: '10000mAh Power Bank Fast Charge', brand: 'VoltMax', category: 'Electronics',
      price: 799, mrp: 1499, rating: 4.4, img: ph('Power Bank', '#1565c0'),
      desc: 'Dual USB output, 18W fast charging, LED indicator. Slim aluminium body charges two devices simultaneously.' },
    { id: 'p4', title: 'Wireless Gaming Mouse RGB', brand: 'ClickPro', category: 'Electronics',
      price: 1599, mrp: 3499, rating: 4.5, img: ph('Mouse', '#283593'),
      desc: '16000 DPI optical sensor, 7 programmable buttons, RGB lighting with 16.8M colors. Ultra-low latency wireless connection.' },

    // Mobiles
    { id: 'p5', title: 'Smartphone Pro Max 5G (128GB)', brand: 'Nexa', category: 'Mobiles',
      price: 18999, mrp: 24999, rating: 4.5, img: ph('Smartphone', '#388e3c'),
      desc: '6.7" AMOLED display, 5000mAh battery, 64MP triple camera, 5G connectivity and 8GB RAM for seamless multitasking.' },
    { id: 'p6', title: 'Budget Smartphone 4G (64GB)', brand: 'CellLite', category: 'Mobiles',
      price: 7999, mrp: 10999, rating: 4.0, img: ph('Phone', '#2e7d32'),
      desc: '6.5" HD+ display, 5000mAh battery, 13MP dual camera, expandable storage up to 512GB. Perfect daily driver.' },
    { id: 'p7', title: 'Foldable Phone 5G (256GB)', brand: 'Nexa', category: 'Mobiles',
      price: 54999, mrp: 74999, rating: 4.7, img: ph('Foldable', '#1b5e20'),
      desc: '7.6" foldable AMOLED, Snapdragon 8 Gen 2, 50MP camera, IPX8 water resistance. The future of smartphones.' },
    { id: 'p8', title: 'Rugged Outdoor Phone', brand: 'ToughCall', category: 'Mobiles',
      price: 12499, mrp: 17999, rating: 4.2, img: ph('Rugged', '#4caf50'),
      desc: 'IP69 rated, MIL-STD-810H, 10000mAh battery, thermal camera. Built for extreme environments.' },

    // Fashion
    { id: 'p9', title: "Men's Cotton Casual Shirt", brand: 'UrbanFit', category: 'Fashion',
      price: 699, mrp: 1499, rating: 4.1, img: ph('Shirt', '#ff9f00'),
      desc: 'Slim-fit 100% cotton shirt, breathable fabric, available in 8 colors. Perfect for daily wear and casual outings.' },
    { id: 'p10', title: 'Running Shoes Lightweight', brand: 'StridePro', category: 'Fashion',
      price: 1199, mrp: 2499, rating: 4.0, img: ph('Shoes', '#e53935'),
      desc: 'Breathable mesh upper with cushioned EVA sole for all-day comfort. Ideal for running, gym, and everyday use.' },
    { id: 'p11', title: "Women's Kurti Set (3-piece)", brand: 'EthnicAura', category: 'Fashion',
      price: 899, mrp: 1999, rating: 4.4, img: ph('Kurti', '#f57c00'),
      desc: 'Cotton blend kurta, palazzo pants, and dupatta. Beautiful hand-block print, machine washable.' },
    { id: 'p12', title: 'Analog Watch Classic', brand: 'TimeCraft', category: 'Fashion',
      price: 2499, mrp: 5999, rating: 4.6, img: ph('Watch', '#e65100'),
      desc: 'Stainless steel case, genuine leather strap, Japanese quartz movement. Water resistant to 50m. 2-year warranty.' },

    // Home
    { id: 'p13', title: 'Stainless Steel Water Bottle 1L', brand: 'HydroLife', category: 'Home',
      price: 449, mrp: 999, rating: 4.4, img: ph('Bottle', '#00897b'),
      desc: 'Vacuum insulated, keeps drinks hot for 12h and cold for 24h. Leak-proof lid, BPA-free, eco-friendly.' },
    { id: 'p14', title: 'Bedside Table Lamp LED', brand: 'LumiGlow', category: 'Home',
      price: 649, mrp: 1299, rating: 4.2, img: ph('Lamp', '#00695c'),
      desc: 'Touch-dimmable, 3 color temperatures, USB charging port. Modern minimalist design in matte white.' },
    { id: 'p15', title: 'Non-Stick Cookware Set (5 pcs)', brand: 'KitchenPro', category: 'Home',
      price: 1899, mrp: 3999, rating: 4.5, img: ph('Cookware', '#004d40'),
      desc: 'Includes frying pan, saucepan, kadhai, tawa, and dosa tawa. PFOA-free coating, induction compatible.' },
    { id: 'p16', title: 'Memory Foam Pillow (Pack of 2)', brand: 'DreamRest', category: 'Home',
      price: 999, mrp: 2499, rating: 4.3, img: ph('Pillow', '#26a69a'),
      desc: 'Cervical contour design for neck support. Hypoallergenic, breathable bamboo cover, machine washable.' },

    // Appliances
    { id: 'p17', title: 'Smart LED TV 43" Full HD', brand: 'VuTech', category: 'Appliances',
      price: 21499, mrp: 32999, rating: 4.2, img: ph('Smart TV', '#5e35b1'),
      desc: 'Full HD smart TV with built-in streaming apps, voice remote, 20W speakers, and 3 HDMI ports.' },
    { id: 'p18', title: 'Mixer Grinder 750W (3 Jars)', brand: 'BlendKing', category: 'Appliances',
      price: 2299, mrp: 4499, rating: 4.3, img: ph('Mixer', '#4527a0'),
      desc: '750W motor, 3 stainless steel jars, overload protection. Grinds, blends, and makes chutneys effortlessly.' },
    { id: 'p19', title: 'Inverter Split AC 1.5 Ton', brand: 'CoolBreeze', category: 'Appliances',
      price: 34999, mrp: 48999, rating: 4.6, img: ph('AC', '#7b1fa2'),
      desc: '5-star energy rating, copper condenser, PM 2.5 filter, WiFi enabled. Cools rooms up to 180 sq ft.' },
    { id: 'p20', title: 'Automatic Washing Machine 7kg', brand: 'WashEasy', category: 'Appliances',
      price: 16999, mrp: 22999, rating: 4.1, img: ph('Washer', '#6a1b9a'),
      desc: 'Front-load, 1200 RPM, 15 wash programs, steam wash, inverter motor with 10-year warranty.' },

    // Toys
    { id: 'p21', title: 'Wooden Building Blocks Set', brand: 'PlayJoy', category: 'Toys',
      price: 599, mrp: 1199, rating: 4.6, img: ph('Blocks', '#fb8c00'),
      desc: '100-piece non-toxic wooden blocks in vibrant colors. Develops motor skills and creativity in kids aged 3+.' },
    { id: 'p22', title: 'Remote Control Racing Car', brand: 'SpeedDash', category: 'Toys',
      price: 1299, mrp: 2499, rating: 4.2, img: ph('RC Car', '#ef6c00'),
      desc: '2.4GHz remote, 20km/h top speed, rechargeable battery, working LED lights. Ages 6+.' },
    { id: 'p23', title: 'Science Experiment Kit (60+)', brand: 'CuriousMinds', category: 'Toys',
      price: 899, mrp: 1599, rating: 4.5, img: ph('Science Kit', '#ff8f00'),
      desc: '60+ experiments covering chemistry, physics, and biology. Includes instruction booklet with explanations. Ages 8+.' },
    { id: 'p24', title: 'Dollhouse Furniture Set', brand: 'TinyWorld', category: 'Toys',
      price: 749, mrp: 1499, rating: 4.3, img: ph('Dollhouse', '#f9a825'),
      desc: '34-piece wooden furniture set for dollhouses. Includes bedroom, kitchen, living room, and bathroom sets. Ages 3+.' },
  ],
  cart: [],
  wishlist: [],
  orders: [],
};
