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
    storeName: 'ShopKart',
    tagline: 'Big Savings Days are here!',
    bannerText: 'Up to 80% OFF — Shop the latest deals across every category.',
    themeColor: '#2874f0',
    currency: '₹',
    footer: 'ShopKart — built with ❤️. Free & open source.',
  },
  slides: [
    { img: ph('Big Savings Days', '#2874f0'), heading: 'Big Savings Days', text: 'Up to 80% OFF across every category', link: '' },
    { img: ph('Latest Mobiles', '#388e3c'), heading: 'Latest 5G Mobiles', text: 'Top brands starting ₹18,999', link: 'Mobiles' },
    { img: ph('Fashion Sale', '#ff9f00'), heading: 'Fashion Fiesta', text: 'Flat 50% off on trending styles', link: 'Fashion' },
  ],
  categories: ['Electronics', 'Fashion', 'Home', 'Mobiles', 'Appliances', 'Toys'],
  products: [
    { id: 'p1', title: 'Wireless Bluetooth Headphones', brand: 'BoomAudio', category: 'Electronics',
      price: 1299, mrp: 2999, rating: 4.3, img: ph('Headphones', '#2874f0'),
      desc: 'Over-ear wireless headphones with 30-hour battery, deep bass and noise isolation.' },
    { id: 'p2', title: 'Smartphone Pro Max 5G (128GB)', brand: 'Nexa', category: 'Mobiles',
      price: 18999, mrp: 24999, rating: 4.5, img: ph('Smartphone', '#388e3c'),
      desc: '6.7" AMOLED display, 5000mAh battery, 64MP triple camera and 5G connectivity.' },
    { id: 'p3', title: 'Men\'s Cotton Casual Shirt', brand: 'UrbanFit', category: 'Fashion',
      price: 699, mrp: 1499, rating: 4.1, img: ph('Shirt', '#ff9f00'),
      desc: 'Slim-fit 100% cotton shirt, breathable and perfect for daily wear.' },
    { id: 'p4', title: 'Stainless Steel Water Bottle 1L', brand: 'HydroLife', category: 'Home',
      price: 449, mrp: 999, rating: 4.4, img: ph('Bottle', '#00897b'),
      desc: 'Vacuum insulated, keeps drinks hot for 12h and cold for 24h. Leak-proof.' },
    { id: 'p5', title: 'Smart LED TV 43" Full HD', brand: 'VuTech', category: 'Appliances',
      price: 21499, mrp: 32999, rating: 4.2, img: ph('Smart TV', '#5e35b1'),
      desc: 'Full HD smart TV with built-in apps, voice remote and 20W speakers.' },
    { id: 'p6', title: 'Running Shoes Lightweight', brand: 'StridePro', category: 'Fashion',
      price: 1199, mrp: 2499, rating: 4.0, img: ph('Shoes', '#e53935'),
      desc: 'Breathable mesh running shoes with cushioned sole for all-day comfort.' },
    { id: 'p7', title: 'Wooden Building Blocks Set', brand: 'PlayJoy', category: 'Toys',
      price: 599, mrp: 1199, rating: 4.6, img: ph('Toy Blocks', '#fb8c00'),
      desc: '100-piece non-toxic wooden blocks set to spark creativity in kids.' },
    { id: 'p8', title: 'Laptop Backpack Water-Resistant', brand: 'CarryOn', category: 'Electronics',
      price: 899, mrp: 1999, rating: 4.3, img: ph('Backpack', '#3949ab'),
      desc: 'Fits 15.6" laptops, USB charging port, anti-theft pocket and rain cover.' },
  ],
  cart: [],
  wishlist: [],
  orders: [],
};
