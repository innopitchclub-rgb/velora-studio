import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'

type Product = {
  id: string
  name: string
  brand: string
  category: string
  price: number
  originalPrice?: number
  image: string
  hoverImage?: string
  colors: string[]
  sizes: string[]
  badge?: string
  description: string
  fabric: string
  fit: string
  rating: number
  reviews: number
  stock: string
  frontImage?: string
  backImage?: string
  leftSideImage?: string
  rightSideImage?: string
  angle45Image?: string
  backAngleImage?: string
  detailImages?: string[]
  galleryImages?: string[]
  videoPreview?: string
  sizeGuide?: string
  deliveryInfo?: string
  returnPolicy?: string
  '360Frames'?: string[]
}

type CartItem = {
  id: string
  productId: string
  size: string
  color: string
  quantity: number
}

type IconProps = { size?: number; strokeWidth?: number; fill?: string }
const icon = (symbol: string, label: string) =>
  function Icon({ size = 16 }: IconProps) {
    return (
      <span className="inline-icon" aria-label={label} style={{ fontSize: `${size}px` }}>
        {symbol}
      </span>
    )
  }

const ArrowRight = icon('→', 'arrow right')
const ArrowUpRight = icon('↗', 'arrow up right')
const Bag = icon('👜', 'bag')
const Check = icon('✓', 'check')
const Instagram = icon('◎', 'Instagram')
const MapPin = icon('●', 'location')
const Menu = icon('☰', 'menu')
const Minus = icon('−', 'minus')
const Search = icon('⌕', 'search')
const X = icon('×', 'close')
const Heart = icon('♥', 'wishlist')
const User = icon('◉', 'account')
const Star = icon('★', 'rating')

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})
const formatPrice = (value: number) => currency.format(value)

const images = {
  hero: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=90',
  intro: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1100&q=85',
  shirts: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=85',
  bottoms: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
  layers: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=85',
  banner: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=2200&q=90',
  story: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1300&q=85',
  oxford: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=85',
  trouser: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&q=85',
  overshirt: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
  knit: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=900&q=85',
  tee: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
  denim: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85',
  linen: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85',
  look1: 'https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=1100&q=85',
  look2: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85',
  look3: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1100&q=85',
  look4: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1100&q=85',
  look5: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',
  look6: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85',
  chain: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
  watch: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=85',
  cap: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
  shoe: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
  shirtClassic: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
  shirtTeal: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
  denimClassic: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
  linenClassic: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85',
  teeClassic: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=85',
  denimOversized: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1200&q=85',
  trouserClassic: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85',
  overshirtClassic: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85',
}

const heroSlides = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2200&q=90',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2200&q=90',
]

const buildGallery = (...items: Array<string | undefined>) => {
  const unique = items.filter((item, index, list) => item && list.indexOf(item) === index)
  return unique as string[]
}

const products: Product[] = [
  {
    id: 'yellow-oxford-shirt',
    name: 'Yellow Solid Oxford Semi Slim Fit Shirt',
    brand: 'VELORA',
    category: 'Shirts',
    price: 799,
    originalPrice: 999,
    image: images.shirtClassic,
    hoverImage: undefined,
    colors: ['Sunflower', 'Navy', 'Sand'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'SALE',
    description: 'A refined Oxford shirt cut for a sharp silhouette with a soft premium hand-feel.',
    fabric: 'Oxford Cotton',
    fit: 'Semi Slim Fit',
    rating: 4.8,
    reviews: 124,
    stock: 'In stock',
    frontImage: images.shirtClassic,
    backImage: images.shirtTeal,
    leftSideImage: images.shirtClassic,
    rightSideImage: images.shirtClassic,
    angle45Image: images.shirtClassic,
    backAngleImage: images.shirtTeal,
    detailImages: [images.shirtClassic, images.shirts],
    galleryImages: buildGallery(images.shirtClassic, images.shirtTeal, images.shirtClassic, images.shirtClassic, images.shirtClassic, images.shirtTeal, images.shirts, images.shirtClassic),
    '360Frames': buildGallery(images.shirtClassic, images.shirtTeal, images.shirtClassic, images.shirtClassic, images.shirtClassic, images.shirtTeal, images.shirts, images.shirtClassic),
    videoPreview: '',
    sizeGuide: 'Overshirt fit is relaxed; refer to size chart.',
    deliveryInfo: 'Free shipping over ₹999 and easy returns within 7 days.',
    returnPolicy: 'Returns accepted within 7 days for unused products in original packaging.',
  },
  {
    id: 'teal-oxford-shirt',
    name: 'Teal Solid Oxford Shirt',
    brand: 'VELORA',
    category: 'Shirts',
    price: 799,
    originalPrice: 1099,
    image: images.shirtTeal,
    hoverImage: undefined,
    colors: ['Teal', 'Black', 'Stone'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'NEW',
    description: 'A polished essential in rich colour with clean structure and everyday ease.',
    fabric: 'Premium Oxford',
    fit: 'Regular Fit',
    rating: 4.7,
    reviews: 89,
    stock: 'In stock',
    frontImage: images.shirtTeal,
    backImage: images.shirtClassic,
    leftSideImage: images.shirtTeal,
    rightSideImage: images.shirtTeal,
    angle45Image: images.shirtTeal,
    backAngleImage: images.shirtClassic,
    detailImages: [images.shirtTeal, images.shirts],
    galleryImages: buildGallery(images.shirtTeal, images.shirtClassic, images.shirtTeal, images.shirtTeal, images.shirtTeal, images.shirtClassic, images.shirts, images.shirtTeal),
    '360Frames': buildGallery(images.shirtTeal, images.shirtClassic, images.shirtTeal, images.shirtTeal, images.shirtTeal, images.shirtClassic, images.shirts, images.shirtTeal),
    videoPreview: '',
    sizeGuide: 'Regular fit; relaxed and easy through the shoulder.',
    deliveryInfo: 'Ships in 2-4 business days across India.',
    returnPolicy: 'Exchanges accepted for fit issues if unworn.',
  },
  {
    id: 'light-blue-denim-shirt',
    name: 'Light Blue Denim Shirt',
    brand: 'VELORA',
    category: 'Denim',
    price: 999,
    originalPrice: 1299,
    image: images.denimClassic,
    hoverImage: undefined,
    colors: ['Washed Blue', 'Stone', 'Charcoal'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'BESTSELLER',
    description: 'Soft denim structure with a relaxed edge designed for all-day wear.',
    fabric: 'Premium Denim',
    fit: 'Relaxed Fit',
    rating: 4.9,
    reviews: 210,
    stock: 'In stock',
    frontImage: images.denimClassic,
    backImage: images.denimOversized,
    leftSideImage: images.denimClassic,
    rightSideImage: images.denimClassic,
    angle45Image: images.denimClassic,
    backAngleImage: images.denimOversized,
    detailImages: [images.denimClassic, images.denim],
    galleryImages: buildGallery(images.denimClassic, images.denimOversized, images.denimClassic, images.denimClassic, images.denimClassic, images.denimOversized, images.denim, images.denimClassic),
    '360Frames': buildGallery(images.denimClassic, images.denimOversized, images.denimClassic, images.denimClassic, images.denimClassic, images.denimOversized, images.denim, images.denimClassic),
    videoPreview: '',
    sizeGuide: 'Relaxed fit with a slightly dropped shoulder.',
    deliveryInfo: 'Estimated delivery within 4-6 business days.',
    returnPolicy: 'Returnable within 7 days if unworn and undamaged.',
  },
  {
    id: 'white-linen-shirt',
    name: 'White Linen Casual Shirt',
    brand: 'VELORA',
    category: 'Shirts',
    price: 1199,
    originalPrice: 1499,
    image: images.linenClassic,
    hoverImage: undefined,
    colors: ['Ivory', 'Cream', 'White'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'NEW',
    description: 'Breathable linen for softer movement, elevated with sharp tailoring.',
    fabric: 'Linen Blend',
    fit: 'Relaxed Fit',
    rating: 4.6,
    reviews: 74,
    stock: 'Low stock',
    frontImage: images.linenClassic,
    backImage: images.shirtClassic,
    leftSideImage: images.linenClassic,
    rightSideImage: images.linenClassic,
    angle45Image: images.linenClassic,
    backAngleImage: images.shirtClassic,
    detailImages: [images.linenClassic, images.shirts],
    galleryImages: buildGallery(images.linenClassic, images.shirtClassic, images.linenClassic, images.linenClassic, images.linenClassic, images.shirtClassic, images.shirts, images.linenClassic),
    '360Frames': buildGallery(images.linenClassic, images.shirtClassic, images.linenClassic, images.linenClassic, images.linenClassic, images.shirtClassic, images.shirts, images.linenClassic),
    videoPreview: '',
    sizeGuide: 'Relaxed fit for an easy, breathable drape.',
    deliveryInfo: 'Ships within 3-5 working days.',
    returnPolicy: 'Returns accepted when unused and in original condition.',
  },
  {
    id: 'coffee-drop-tee',
    name: 'Coffee Brown Drop Shoulder T-Shirt',
    brand: 'VELORA',
    category: 'T-Shirts',
    price: 699,
    originalPrice: 899,
    image: images.teeClassic,
    hoverImage: undefined,
    colors: ['Coffee', 'Black', 'Stone'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    badge: 'SALE',
    description: 'An oversized staple with subtle structure and a clean premium finish.',
    fabric: 'Cotton Jersey',
    fit: 'Oversized',
    rating: 4.8,
    reviews: 152,
    stock: 'In stock',
    frontImage: images.teeClassic,
    backImage: images.shirtClassic,
    leftSideImage: images.teeClassic,
    rightSideImage: images.teeClassic,
    angle45Image: images.teeClassic,
    backAngleImage: images.shirtClassic,
    detailImages: [images.teeClassic, images.shirts],
    galleryImages: buildGallery(images.teeClassic, images.shirtClassic, images.teeClassic, images.teeClassic, images.teeClassic, images.shirtClassic, images.shirts, images.teeClassic),
    '360Frames': buildGallery(images.teeClassic, images.shirtClassic, images.teeClassic, images.teeClassic, images.teeClassic, images.shirtClassic, images.shirts, images.teeClassic),
    videoPreview: '',
    sizeGuide: 'Drop shoulder, roomy cut designed for layered styling.',
    deliveryInfo: 'Fast dispatch on all orders.',
    returnPolicy: 'Easy returns within 7 days for eligible products.',
  },
  {
    id: 'oversized-denim-shirt',
    name: 'Light Wash Oversized Denim Shirt',
    brand: 'VELORA',
    category: 'Denim',
    price: 1099,
    originalPrice: 1399,
    image: images.denimOversized,
    hoverImage: undefined,
    colors: ['Light Wash', 'Deep Indigo', 'Charcoal'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    badge: 'BESTSELLER',
    description: 'A modern oversized denim shirt built with a soft drape and utility silhouette.',
    fabric: 'Stretch Denim',
    fit: 'Oversized',
    rating: 4.9,
    reviews: 186,
    stock: 'In stock',
    frontImage: images.denimOversized,
    backImage: images.denimClassic,
    leftSideImage: images.denimOversized,
    rightSideImage: images.denimOversized,
    angle45Image: images.denimOversized,
    backAngleImage: images.denimClassic,
    detailImages: [images.denimOversized, images.denim],
    galleryImages: buildGallery(images.denimOversized, images.denimClassic, images.denimOversized, images.denimOversized, images.denimOversized, images.denimClassic, images.denim, images.denimOversized),
    '360Frames': buildGallery(images.denimOversized, images.denimClassic, images.denimOversized, images.denimOversized, images.denimOversized, images.denimClassic, images.denim, images.denimOversized),
    videoPreview: '',
    sizeGuide: 'Oversized proportion for a sharper but effortless fit.',
    deliveryInfo: 'Free shipping above ₹999',
    returnPolicy: 'Return or exchange within 7 days on unworn items.',
  },
  {
    id: 'navy-trouser',
    name: 'Navy Structured Trouser',
    brand: 'VELORA',
    category: 'Trousers',
    price: 1499,
    originalPrice: 1899,
    image: images.trouserClassic,
    hoverImage: undefined,
    colors: ['Navy', 'Olive', 'Stone'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'NEW',
    description: 'Clean tailoring with breathable movement and a sharpened everyday fit.',
    fabric: 'Cotton Twill',
    fit: 'Tailored',
    rating: 4.7,
    reviews: 96,
    stock: 'In stock',
    frontImage: images.trouserClassic,
    backImage: images.bottoms,
    leftSideImage: images.trouserClassic,
    rightSideImage: images.trouserClassic,
    angle45Image: images.trouserClassic,
    backAngleImage: images.bottoms,
    detailImages: [images.trouserClassic, images.bottoms],
    galleryImages: buildGallery(images.trouserClassic, images.bottoms, images.trouserClassic, images.trouserClassic, images.trouserClassic, images.bottoms, images.bottoms, images.trouserClassic),
    '360Frames': buildGallery(images.trouserClassic, images.bottoms, images.trouserClassic, images.trouserClassic, images.trouserClassic, images.bottoms, images.bottoms, images.trouserClassic),
    videoPreview: '',
    sizeGuide: 'Tailored drape with a clean modern rise.',
    deliveryInfo: 'Premium delivery in 4-6 business days.',
    returnPolicy: 'Unworn items can be returned for size exchange or refund.',
  },
  {
    id: 'stone-overshirt',
    name: 'Stone Utility Overshirt',
    brand: 'VELORA',
    category: 'Accessories',
    price: 1599,
    originalPrice: 1999,
    image: images.overshirtClassic,
    hoverImage: undefined,
    colors: ['Stone', 'Olive', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    badge: 'LIMITED',
    description: 'Lightweight layer with practical utility detailing and premium textured finish.',
    fabric: 'Cotton Canvas',
    fit: 'Relaxed',
    rating: 4.8,
    reviews: 130,
    stock: 'In stock',
    frontImage: images.overshirtClassic,
    backImage: images.layers,
    leftSideImage: images.overshirtClassic,
    rightSideImage: images.overshirtClassic,
    angle45Image: images.overshirtClassic,
    backAngleImage: images.layers,
    detailImages: [images.overshirtClassic, images.layers],
    galleryImages: buildGallery(images.overshirtClassic, images.layers, images.overshirtClassic, images.overshirtClassic, images.overshirtClassic, images.layers, images.layers, images.overshirtClassic),
    '360Frames': buildGallery(images.overshirtClassic, images.layers, images.overshirtClassic, images.overshirtClassic, images.overshirtClassic, images.layers, images.layers, images.overshirtClassic),
    videoPreview: '',
    sizeGuide: 'Roomy layering fit with utility pocket placement.',
    deliveryInfo: 'Ships in 3-5 business days.',
    returnPolicy: 'Easy returns for unworn, unused items.',
  },
  {
    id: 'velora-chain',
    name: 'Antique Gold Chain',
    brand: 'VELORA',
    category: 'Accessories',
    price: 1499,
    originalPrice: 1899,
    image: images.chain,
    hoverImage: undefined,
    colors: ['Gold', 'Silver'],
    sizes: ['18 inch', '20 inch', '22 inch'],
    badge: 'NEW',
    description: 'A statement chain with an elevated finish designed to layer effortlessly with everyday looks.',
    fabric: 'Gold Plated Brass',
    fit: 'Standard Length',
    rating: 4.8,
    reviews: 81,
    stock: 'In stock',
    frontImage: images.chain,
    backImage: images.chain,
    leftSideImage: images.chain,
    rightSideImage: images.chain,
    angle45Image: images.chain,
    backAngleImage: images.chain,
    detailImages: [images.chain],
    galleryImages: buildGallery(images.chain, images.chain, images.chain, images.chain, images.chain, images.chain, images.chain, images.chain),
    '360Frames': buildGallery(images.chain, images.chain, images.chain, images.chain, images.chain, images.chain, images.chain, images.chain),
    videoPreview: '',
    sizeGuide: 'Neck length guide for layering styling.',
    deliveryInfo: 'Ships in 2-3 business days.',
    returnPolicy: 'Returns accepted for defective or damaged items.',
  },
  {
    id: 'heritage-watch',
    name: 'Heritage Leather Watch',
    brand: 'VELORA',
    category: 'Accessories',
    price: 2499,
    originalPrice: 3299,
    image: images.watch,
    hoverImage: undefined,
    colors: ['Black', 'Tan', 'Camel'],
    sizes: ['38mm', '40mm', '42mm'],
    badge: 'BESTSELLER',
    description: 'Minimal, structured watch with premium leather strap and refined everyday presence.',
    fabric: 'Italian Leather',
    fit: 'Regular Fit',
    rating: 4.9,
    reviews: 93,
    stock: 'In stock',
    frontImage: images.watch,
    backImage: images.watch,
    leftSideImage: images.watch,
    rightSideImage: images.watch,
    angle45Image: images.watch,
    backAngleImage: images.watch,
    detailImages: [images.watch],
    galleryImages: buildGallery(images.watch, images.watch, images.watch, images.watch, images.watch, images.watch, images.watch, images.watch),
    '360Frames': buildGallery(images.watch, images.watch, images.watch, images.watch, images.watch, images.watch, images.watch, images.watch),
    videoPreview: '',
    sizeGuide: 'Fits standard wrist sizes with adjustable strap.',
    deliveryInfo: 'Ships in 2-3 business days.',
    returnPolicy: 'Defective items eligible for replacement or refund.',
  },
  {
    id: 'studio-cap',
    name: 'Studio Monogram Cap',
    brand: 'VELORA',
    category: 'Headwear',
    price: 899,
    originalPrice: 1199,
    image: images.cap,
    hoverImage: undefined,
    colors: ['Black', 'Sand', 'Olive'],
    sizes: ['S', 'M', 'L'],
    badge: 'NEW',
    description: 'A clean cap with structured profile, soft interior, and understated signature detailing.',
    fabric: 'Cotton Twill',
    fit: 'Adjustable',
    rating: 4.7,
    reviews: 64,
    stock: 'In stock',
    frontImage: images.cap,
    backImage: images.cap,
    leftSideImage: images.cap,
    rightSideImage: images.cap,
    angle45Image: images.cap,
    backAngleImage: images.cap,
    detailImages: [images.cap],
    galleryImages: buildGallery(images.cap, images.cap, images.cap, images.cap, images.cap, images.cap, images.cap, images.cap),
    '360Frames': buildGallery(images.cap, images.cap, images.cap, images.cap, images.cap, images.cap, images.cap, images.cap),
    videoPreview: '',
    sizeGuide: 'Adjustable fit with structured crown and curved brim.',
    deliveryInfo: 'Ships in 2-4 business days.',
    returnPolicy: 'Quick replacement for manufacturing defects.',
  },
  {
    id: 'city-loafer',
    name: 'City Leather Loafer',
    brand: 'VELORA',
    category: 'Footwear',
    price: 2899,
    originalPrice: 3599,
    image: images.shoe,
    hoverImage: undefined,
    colors: ['Chestnut', 'Black', 'Mocha'],
    sizes: ['7', '8', '9', '10', '11'],
    badge: 'LIMITED',
    description: 'Luxury everyday loafer with a clean silhouette and soft leather finish for effortless styling.',
    fabric: 'Full Grain Leather',
    fit: 'True to Size',
    rating: 4.9,
    reviews: 72,
    stock: 'In stock',
    frontImage: images.shoe,
    backImage: images.shoe,
    leftSideImage: images.shoe,
    rightSideImage: images.shoe,
    angle45Image: images.shoe,
    backAngleImage: images.shoe,
    detailImages: [images.shoe],
    galleryImages: buildGallery(images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe),
    '360Frames': buildGallery(images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe, images.shoe),
    videoPreview: '',
    sizeGuide: 'True to size with premium leather insole support.',
    deliveryInfo: 'Premium delivery available nationwide.',
    returnPolicy: 'Eligible for exchange within 7 days.',
  },
]

const categoryCards = [
  { title: 'Shirts', image: images.shirts },
  { title: 'T-Shirts', image: images.tee },
  { title: 'Trousers', image: images.bottoms },
  { title: 'Denim', image: images.denim },
  { title: 'Accessories', image: images.chain },
  { title: 'Footwear', image: images.shoe },
  { title: 'Headwear', image: images.cap },
  { title: 'Trending', image: images.look4 },
]

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Shirts', href: '#shop' },
  { label: 'T-Shirts', href: '#shop' },
  { label: 'Trousers', href: '#shop' },
  { label: 'Denim', href: '#shop' },
  { label: 'Accessories', href: '#shop' },
  { label: 'Footwear', href: '#shop' },
  { label: 'Trending', href: '#shop' },
  { label: 'Sale', href: '#shop' },
]

const popularSearches = ['Oxford Shirt', 'Oversized T-Shirt', 'Linen Shirt', 'Baggy Jeans', 'Casual Trousers']
const recentSearches = ['White Shirt', 'Denim', 'Essentials']

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a className={`logo ${light ? 'logo-light' : ''}`} href="#home" aria-label="Velora home">
      <span className="logo-mark">V</span>
      <span>VELORA</span>
    </a>
  )
}

function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  isWished,
}: {
  product: Product
  onAddToCart: (product: Product) => void
  onQuickView: (product: Product) => void
  onToggleWishlist: (id: string) => void
  isWished: boolean
}) {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const cardClassName = product.category === 'Headwear' ? 'product-card product-card-headwear' : 'product-card'

  return (
    <article className={cardClassName}>
      <div className="product-card-media">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="wishlist-btn" type="button" onClick={() => onToggleWishlist(product.id)} aria-label="Toggle wishlist">
          <Heart size={16} />
          <span className={isWished ? 'active' : ''} aria-hidden="true">?</span>
        </button>
        <button className="product-image-button" type="button" onClick={() => window.location.hash = `#product/${product.id}`}>
          <img src={product.image} alt={product.name} className="product-image" />
          {product.hoverImage && <img src={product.hoverImage} alt="" className="product-image-hover" />}
        </button>
      </div>
      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand}</span>
          <span className="product-colors">{product.colors.length} colors</span>
        </div>
        <h3>{product.name}</h3>
        <div className="product-price-row">
          <div>
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice && <span>{formatPrice(product.originalPrice)}</span>}
          </div>
          {discount > 0 && <em>{discount}% off</em>}
        </div>
        <div className="product-actions">
          <button type="button" className="secondary-button" onClick={() => onQuickView(product)}>Quick View</button>
          <button type="button" className="primary-button" onClick={() => onAddToCart(product)}>Add to cart</button>
        </div>
      </div>
    </article>
  )
}

function SearchOverlay({
  open,
  query,
  onChange,
  onClose,
  onNavigate,
  onSelectPopular,
  wishlistCount,
}: {
  open: boolean
  query: string
  onChange: (value: string) => void
  onClose: () => void
  onNavigate: (href: string) => void
  onSelectPopular: (q: string) => void
  wishlistCount: number
}) {
  if (!open) return null

  const matches = products.filter((product) => {
    const needle = query.trim().toLowerCase()
    if (!needle) return false
    return (
      product.name.toLowerCase().includes(needle) ||
      product.category.toLowerCase().includes(needle) ||
      product.brand.toLowerCase().includes(needle)
    )
  })

  return (
    <div className="search-overlay" aria-modal="true" role="dialog">
      <div className="search-panel">
        <div className="search-header">
          <div className="search-input-wrap">
            <Search size={17} />
            <input value={query} onChange={(event) => onChange(event.target.value)} placeholder="Search products, categories, brands" autoFocus />
          </div>
          <button type="button" className="close-button" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        {!query.trim() ? (
          <div className="search-groups">
            <div>
              <p className="search-label">Recent searches</p>
              <div className="search-tags">
                {recentSearches.map((item) => (
                  <button key={item} type="button" onClick={() => onSelectPopular(item)}>{item}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="search-label">Popular searches</p>
              <div className="search-tags">
                {popularSearches.map((item) => (
                  <button key={item} type="button" onClick={() => onSelectPopular(item)}>{item}</button>
                ))}
              </div>
            </div>
            <div className="search-summary-box">
              <span>Wishlist</span>
              <strong>{wishlistCount}</strong>
            </div>
          </div>
        ) : (
          <div className="search-results-list">
            {matches.length ? (
              matches.map((product) => (
                <button key={product.id} type="button" className="search-result-item" onClick={() => { onClose(); onNavigate(`#product/${product.id}`) }}>
                  <img src={product.image} alt={product.name} />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty-state small">
                <p>No matching results found.</p>
                <button type="button" className="primary-button" onClick={() => { onClose(); onNavigate('#shop') }}>Browse collection</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [route, setRoute] = useState<string>(() => window.location.hash.replace('#', '') || 'home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeHero, setActiveHero] = useState(0)
  const [toast, setToast] = useState('')
  const [quickView, setQuickView] = useState<Product | null>(null)

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = window.localStorage.getItem('velora-cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem('velora-wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash.replace('#', '') || 'home')
    const onScroll = () => setScrolled(window.scrollY > 48)

    onHash()
    onScroll()
    window.addEventListener('hashchange', onHash)
    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHero((current) => (current + 1) % heroSlides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => { try { window.localStorage.setItem('velora-cart', JSON.stringify(cart)) } catch {} }, [cart])
  useEffect(() => { try { window.localStorage.setItem('velora-wishlist', JSON.stringify(wishlist)) } catch {} }, [wishlist])
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 1800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const navigate = (path: string) => {
    const cleanPath = path.startsWith('#') ? path.slice(1) : path
    window.location.hash = cleanPath
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId])
  }

  const addToCart = (product: Product, options?: { size?: string; color?: string; quantity?: number }) => {
    const size = options?.size ?? product.sizes[0] ?? 'M'
    const color = options?.color ?? product.colors[0] ?? 'Classic'
    const quantity = options?.quantity ?? 1

    setCart((current) => {
      const match = current.find((item) => item.productId === product.id && item.size === size && item.color === color)
      if (match) {
        return current.map((item) =>
          item.productId === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }
      return [...current, { id: `${product.id}-${size}-${color}`, productId: product.id, size, color, quantity }]
    })

    setToast(`${product.name} added to cart`)
  }

  const removeFromCart = (cartId: string) => {
    setCart((current) => current.filter((item) => item.id !== cartId))
  }

  const updateQuantity = (cartId: string, delta: number) => {
    setCart((current) =>
      current
        .map((item) => (item.id === cartId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length

  const productMap = useMemo(() => Object.fromEntries(products.map((product) => [product.id, product])), [])

  const renderPage = () => {
    if (route.startsWith('product/')) {
      const productId = route.replace('product/', '')
      const product = productMap[productId] ?? products[0]
      return (
        <ProductDetailPage
          products={products}
          product={product}
          onAddToCart={addToCart}
          isWished={wishlist.includes(product.id)}
          onToggleWishlist={toggleWishlist}
          onQuickView={setQuickView}
        />
      )
    }

    switch (route) {
      case 'shop':
        return <ShopPage products={products} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} setQuickView={setQuickView} />
      case 'wishlist':
        return <WishlistPage products={products.filter((p) => wishlist.includes(p.id))} addToCart={addToCart} toggleWishlist={toggleWishlist} setQuickView={setQuickView} />
      case 'cart':
        return <CartPage cart={cart} products={products} removeFromCart={removeFromCart} updateQuantity={updateQuantity} />
      case 'checkout':
        return <CheckoutPage cart={cart} products={products} onCheckout={() => navigate('success')} />
      case 'success':
        return <OrderSuccessPage />
      case 'track':
        return <TrackingPage />
      case 'account':
        return <AccountPage />
      case 'login':
        return <AuthPage variant="login" />
      case 'signup':
        return <AuthPage variant="signup" />
      case 'contact':
        return <ContactPage />
      case 'about':
        return <AboutPage />
      case 'faq':
        return <FaqPage />
      case 'shipping':
        return <PolicyPage title="Shipping Policy" text="We ship across India within 3-6 business days for standard delivery. Express delivery is available for select pin codes. The shipping fee is waived on orders of ₹999 and above." />
      case 'returns':
        return <PolicyPage title="Return Policy" text="Eligible items can be returned within 7 days of delivery if unused and in original packaging. Refunds and exchanges are processed within 5-7 working days." />
      case 'privacy':
        return <PolicyPage title="Privacy Policy" text="We respect your privacy. Personal information is used only to manage orders, provide support, and improve shopping experiences. We do not sell your information to third parties." />
      case 'terms':
        return <PolicyPage title="Terms & Conditions" text="By placing an order, you agree to our terms covering product availability, pricing, shipping, returns, and payment processing for online purchases." />
      default:
        return <HomePage products={products} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} setQuickView={setQuickView} activeHero={activeHero} />
    }
  }

  return (
    <div className="app-shell">
      <Header
        scrolled={scrolled}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onSearch={() => setSearchOpen(true)}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onNavigate={navigate}
      />

      <SearchOverlay
        open={searchOpen}
        query={searchQuery}
        onChange={setSearchQuery}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigate}
        onSelectPopular={(value) => {
          setSearchQuery(value)
          navigate('shop')
        }}
        wishlistCount={wishlistCount}
      />

      <main className="page-main">{renderPage()}</main>
      <Footer onNavigate={navigate} />

      {quickView && (
        <div className="modal-backdrop" onClick={() => setQuickView(null)}>
          <div className="quick-view-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setQuickView(null)} aria-label="Close quick view">
              <X size={18} />
            </button>
            <img src={quickView.image} alt={quickView.name} />
            <div>
              <p className="eyebrow">{quickView.brand}</p>
              <h3>{quickView.name}</h3>
              <p>{quickView.description}</p>
              <div className="price-row">
                <strong>{formatPrice(quickView.price)}</strong>
                {quickView.originalPrice && <span>{formatPrice(quickView.originalPrice)}</span>}
              </div>
              <button type="button" className="primary-button wide" onClick={() => { addToCart(quickView); setQuickView(null) }}>Add to cart</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function Header({
  scrolled,
  menuOpen,
  setMenuOpen,
  onSearch,
  cartCount,
  wishlistCount,
  onNavigate,
}: {
  scrolled: boolean
  menuOpen: boolean
  setMenuOpen: (value: boolean) => void
  onSearch: () => void
  cartCount: number
  wishlistCount: number
  onNavigate: (path: string) => void
}) {
  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="announcement-bar">FREE SHIPPING ON ORDERS ABOVE ₹999</div>
      <div className="header-inner page-width">
        <Logo light={!scrolled} />
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} type="button" className="nav-link" onClick={() => onNavigate(item.href.replace('#', ''))}>{item.label}</button>
          ))}
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="Search" onClick={onSearch}><Search size={17} /></button>
          <button type="button" className="icon-button" aria-label="Account" onClick={() => onNavigate('account')}><User size={17} /></button>
          <button type="button" className="icon-button wishlist-btn-header" aria-label="Wishlist" onClick={() => onNavigate('wishlist')}>
            <Heart size={17} />
            {wishlistCount > 0 && <span className="header-badge">{wishlistCount}</span>}
          </button>
          <button type="button" className="icon-button cart-btn-header" aria-label="Cart" onClick={() => onNavigate('cart')}>
            <Bag size={17} />
            {cartCount > 0 && <span className="header-badge">{cartCount}</span>}
          </button>
          <button type="button" className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  )
}

function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner page-width">
        <div>
          <Logo light />
          <p className="footer-copy">Modern essentials. Elevated everyday.</p>
          <div className="social-row">
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={16} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><span className="social-dot">X</span></a>
          </div>
        </div>

        <div>
          <h4>Shop</h4>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('shop')}>New Arrivals</button>
            <button type="button" onClick={() => onNavigate('shop')}>Bestsellers</button>
            <button type="button" onClick={() => onNavigate('shop')}>Shirts</button>
            <button type="button" onClick={() => onNavigate('shop')}>T-Shirts</button>
            <button type="button" onClick={() => onNavigate('shop')}>Trousers</button>
            <button type="button" onClick={() => onNavigate('shop')}>Denim</button>
            <button type="button" onClick={() => onNavigate('shop')}>Sale</button>
          </div>
        </div>

        <div>
          <h4>Help</h4>
          <div className="footer-links">
            <button type="button" onClick={() => onNavigate('contact')}>Contact Us</button>
            <button type="button" onClick={() => onNavigate('faq')}>FAQ</button>
            <button type="button" onClick={() => onNavigate('shipping')}>Shipping</button>
            <button type="button" onClick={() => onNavigate('returns')}>Returns</button>
            <button type="button" onClick={() => onNavigate('track')}>Track Order</button>
            <button type="button" onClick={() => onNavigate('shop')}>Size Guide</button>
          </div>
        </div>

        <div>
          <h4>Newsletter</h4>
          <div className="newsletter-box">
            <input type="email" placeholder="Email address" />
            <button type="button" className="primary-button">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>© 2026 Velora Studio</span>
        <div>
          <button type="button" onClick={() => onNavigate('privacy')}>Privacy Policy</button>
          <button type="button" onClick={() => onNavigate('terms')}>Terms & Conditions</button>
          <button type="button" onClick={() => onNavigate('shipping')}>Shipping Policy</button>
          <button type="button" onClick={() => onNavigate('returns')}>Return Policy</button>
        </div>
      </div>
    </footer>
  )
}

function HomePage({
  products,
  wishlist,
  addToCart,
  toggleWishlist,
  setQuickView,
  activeHero,
}: {
  products: Product[]
  wishlist: string[]
  addToCart: (product: Product) => void
  toggleWishlist: (id: string) => void
  setQuickView: (product: Product) => void
  activeHero: number
}) {
  const arrivals = products.slice(0, 4)
  const bestsellers = products.slice(0, 6)

  return (
    <>
      <section className="hero-section">
        <div className="hero-slide-stack">
          {heroSlides.map((slide, index) => (
            <div
              key={slide}
              className={`hero-slide ${index === activeHero ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide})` }}
            />
          ))}
        </div>
        <div className="hero-overlay" />
        <div className="hero-content page-width">
          <p className="eyebrow hero-eyebrow">EST. 2026 <span /> MODERN ESSENTIALS</p>
          <h1>
            DEFINED BY
            <br />
            <em>YOUR STYLE</em>
          </h1>
          <p>Elevated essentials for everyday confidence.</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => window.location.hash = '#shop'}>Shop New Arrivals</button>
            <button type="button" className="secondary-button light" onClick={() => window.location.hash = '#shop'}>Explore Collection</button>
          </div>
        </div>
      </section>

      <section className="section page-width">
        <div className="section-header">
          <div>
            <p className="eyebrow">Curated edits</p>
            <h2>Featured categories</h2>
          </div>
        </div>
        <div className="category-grid">
          {categoryCards.map((card) => (
            <button key={card.title} type="button" className="category-card" onClick={() => window.location.hash = '#shop'}>
              <img src={card.image} alt={card.title} />
              <div>
                <span>{card.title}</span>
                <strong>Explore</strong>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section page-width">
        <div className="section-header">
          <div>
            <p className="eyebrow">New drops</p>
            <h2>New arrivals</h2>
          </div>
          <button type="button" className="text-link-button" onClick={() => window.location.hash = '#shop'}>View all</button>
        </div>

        <div className="product-grid four-up">
          {arrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onQuickView={setQuickView}
              onToggleWishlist={toggleWishlist}
              isWished={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="editorial-banner" style={{ backgroundImage: `url(${images.banner})` }}>
        <div className="banner-overlay" />
        <div className="banner-content page-width">
          <p className="eyebrow">VELORA STYLE JOURNAL</p>
          <h2>EVERYDAY, ELEVATED</h2>
          <p>Thoughtfully designed essentials made for modern movement.</p>
          <button type="button" className="primary-button" onClick={() => window.location.hash = '#shop'}>Discover the collection</button>
        </div>
      </section>

      <section className="section page-width">
        <div className="section-header">
          <div>
            <p className="eyebrow">Top picks</p>
            <h2>Bestsellers</h2>
          </div>
          <div className="inline-controls">
            <button type="button" aria-label="Previous" className="circle-button">?</button>
            <button type="button" aria-label="Next" className="circle-button">?</button>
          </div>
        </div>

        <div className="carousel-row">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
              onQuickView={setQuickView}
              onToggleWishlist={toggleWishlist}
              isWished={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-image-wrap">
          <img src={images.story} alt="Velora brand story" />
        </div>
        <div className="story-copy">
          <p className="eyebrow">Our story</p>
          <h2>BUILT FOR YOUR EVERYDAY</h2>
          <p>We build premium everyday essentials sliced with contemporary confidence, designed for movement, clarity, and lasting wear.</p>
          <button type="button" className="primary-button" onClick={() => window.location.hash = '#about'}>Our Story</button>
        </div>
      </section>

      <section className="section page-width">
        <div className="section-header social-header">
          <div>
            <p className="eyebrow">Follow along</p>
            <h2>Instagram</h2>
          </div>
          <button type="button" className="text-link-button" onClick={() => window.location.hash = '#contact'}>FOLLOW @VELORASTUDIO</button>
        </div>

        <div className="social-grid">
          {[images.look1, images.look2, images.look3, images.look4, images.look5, images.look6].map((image, index) => (
            <div key={`${image}-${index}`} className="social-item">
              <img src={image} alt="Velora style" />
              <div className="social-overlay"><Instagram size={18} /> <span>@velorastudio</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="newsletter-section">
        <div className="page-width newsletter-inner">
          <div>
            <p className="eyebrow">Inner circle</p>
            <h2>STAY IN THE LOOP</h2>
          </div>
          <div className="newsletter-form-box">
            <p>Get first access to new drops, exclusive offers, and more.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email address" />
              <button type="button" className="primary-button">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ShopPage({
  products,
  wishlist,
  addToCart,
  toggleWishlist,
  setQuickView,
}: {
  products: Product[]
  wishlist: string[]
  addToCart: (product: Product) => void
  toggleWishlist: (id: string) => void
  setQuickView: (product: Product) => void
}) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sort, setSort] = useState('recommended')
  const [visibleCount, setVisibleCount] = useState(8)

  const filtered = useMemo(() => {
    let filteredProducts = selectedCategory === 'All' ? products : products.filter((product) => product.category === selectedCategory)

    if (sort === 'low') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price)
    if (sort === 'high') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price)
    if (sort === 'new') filteredProducts = [...filteredProducts].slice().reverse()

    return filteredProducts
  }, [products, selectedCategory, sort])

  const visibleProducts = filtered.slice(0, visibleCount)

  return (
    <div className="page-width product-page">
      <div className="breadcrumb-row">
        <button type="button" onClick={() => window.location.hash = '#home'}>Home</button>
        <span>/</span>
        <strong>Shop</strong>
      </div>

      <div className="page-header-row">
        <div>
          <p className="eyebrow">Curated</p>
          <h1>Shop all essentials</h1>
        </div>
        <span className="result-count">{filtered.length} products</span>
      </div>

      <div className="shop-layout">
        <aside className="filters-panel">
          <h3>Filters</h3>
          <div className="filter-group">
            <p>Category</p>
            {['All', 'Shirts', 'T-Shirts', 'Trousers', 'Denim', 'Accessories', 'Headwear', 'Footwear', 'Trending'].map((category) => (
              <button key={category} type="button" className={selectedCategory === category ? 'filter-chip active' : 'filter-chip'} onClick={() => { setSelectedCategory(category); setVisibleCount(8) }}>{category}</button>
            ))}
          </div>
          <div className="filter-group">
            <p>Price</p>
            <label><input type="checkbox" defaultChecked /> Under ₹999</label>
            <label><input type="checkbox" defaultChecked /> ₹1000 - ₹1499</label>
            <label><input type="checkbox" /> ₹1500 +</label>
          </div>
          <div className="filter-group">
            <p>Fabric</p>
            <label><input type="checkbox" defaultChecked /> Oxford</label>
            <label><input type="checkbox" defaultChecked /> Cotton</label>
            <label><input type="checkbox" /> Denim</label>
          </div>
        </aside>

        <div className="shop-content">
          <div className="toolbar-row">
            <div className="mobile-filter-row">
              <button type="button" className="secondary-button">Filters</button>
              <button type="button" className="secondary-button">Sort</button>
            </div>
            <div className="sort-wrap">
              <label htmlFor="sort">Sort by</label>
              <select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="new">Newest</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {visibleProducts.length ? (
            <div className="product-grid shop-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onQuickView={setQuickView}
                  onToggleWishlist={toggleWishlist}
                  isWished={wishlist.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No products match your filter.</h3>
              <button type="button" className="primary-button" onClick={() => setSelectedCategory('All')}>Reset filters</button>
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="load-more-wrap">
              <button type="button" className="secondary-button" onClick={() => setVisibleCount((count) => count + 8)}>Load more</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductDetailPage({
  products,
  product,
  onAddToCart,
  isWished,
  onToggleWishlist,
  onQuickView,
}: {
  products: Product[]
  product: Product
  onAddToCart: (product: Product, opts?: { size?: string; color?: string; quantity?: number }) => void
  isWished: boolean
  onToggleWishlist: (id: string) => void
  onQuickView: (product: Product) => void
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const [pincode, setPincode] = useState('')
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [rotationIndex, setRotationIndex] = useState(0)
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)

  const gallery = product.galleryImages && product.galleryImages.length > 0 ? product.galleryImages : [product.image]
  const rotationFrames = product['360Frames'] && product['360Frames'].length > 0 ? product['360Frames'] : gallery
  const viewerImage = rotationFrames[rotationIndex % rotationFrames.length]
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const handleAdd = () => {
    if (!selectedColor || !selectedSize) {
      setMessage('Please select a size and color.')
      return
    }
    onAddToCart(product, { color: selectedColor, size: selectedSize, quantity })
    setMessage('Added to cart successfully.')
  }

  const handleViewerDragStart = (clientX: number) => {
    setDragStartX(clientX)
    setDragOffset(0)
  }

  const handleViewerDragMove = (clientX: number) => {
    if (dragStartX === null) return
    const diff = clientX - dragStartX
    setDragOffset(diff)

    if (Math.abs(diff) > 35) {
      const direction = diff > 0 ? -1 : 1
      setRotationIndex((prev) => (prev + direction + rotationFrames.length) % rotationFrames.length)
      setDragStartX(clientX)
      setDragOffset(0)
    }
  }

  const handleViewerDragEnd = () => {
    setDragStartX(null)
    setDragOffset(0)
  }

  return (
    <div className="page-width product-detail-page">
      <div className="breadcrumb-row">
        <button type="button" onClick={() => window.location.hash = '#shop'}>Shop</button>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="gallery-main">
            <img src={gallery[selectedImage] ?? product.image} alt={product.name} />
            <div className="gallery-overlay-actions">
              <button type="button" className="gallery-action" onClick={() => setViewerOpen(true)}>Zoom product</button>
              <button type="button" className="gallery-action" onClick={() => setViewerOpen(true)}>View in 360°</button>
            </div>
            <div className="gallery-count">{selectedImage + 1} / {gallery.length}</div>
          </div>
          <div className="gallery-thumbs">
            {gallery.map((image, index) => (
              <button
                type="button"
                key={`${image}-${index}`}
                className={selectedImage === index ? 'thumb-button active' : 'thumb-button'}
                onClick={() => setSelectedImage(index)}
              >
                <span className="thumb-label">{['Front', 'Back', 'Side', 'Detail', '360°', 'Angle', 'Close-up', 'Model'][index % 8]}</span>
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="detail-info sticky-panel">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <div className="rating-row">
            <span><Star size={15} /> {product.rating}</span>
            <span>({product.reviews} reviews)</span>
          </div>
          <div className="detail-price-row">
            <strong>{formatPrice(product.price)}</strong>
            {product.originalPrice && <span>{formatPrice(product.originalPrice)}</span>}
            {discount > 0 && <em>{discount}% off</em>}
          </div>
          <p className="detail-stock">{product.stock}</p>

          <div className="selector-group">
            <label>Color</label>
            <div className="option-row">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={selectedColor === color ? 'option-pill active' : 'option-pill'}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="swatch-compare">
              {product.colors.map((color) => (
                <button
                  key={`compare-${color}`}
                  type="button"
                  className={selectedColor === color ? 'swatch-card active' : 'swatch-card'}
                  onClick={() => setSelectedColor(color)}
                >
                  <span className="swatch-dot" style={{ background: color.toLowerCase().includes('navy') ? '#1b2e4d' : color.toLowerCase().includes('sand') ? '#d7c1a3' : color.toLowerCase().includes('black') ? '#111111' : color.toLowerCase().includes('stone') ? '#c7c0b7' : color.toLowerCase().includes('teal') ? '#3a7f7c' : color.toLowerCase().includes('sunflower') ? '#e2b645' : '#9d9d9d' }} />
                  <span>{color}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <label>Size</label>
            <div className="option-row">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={selectedSize === size ? 'option-pill active' : 'option-pill'}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-row">
            <label>Quantity</label>
            <div className="quantity-box">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>
          </div>

          <div className="cta-row">
            <button type="button" className="primary-button" onClick={handleAdd}>Add to cart</button>
            <button type="button" className="secondary-button" onClick={() => onToggleWishlist(product.id)}>{isWished ? 'Saved' : 'Wishlist'}</button>
          </div>

          <div className="detail-toolbar">
            <button type="button" className="secondary-button" onClick={() => setViewerOpen(true)}>View in 360°</button>
            <button type="button" className="secondary-button" onClick={() => setViewerOpen(true)}>See all angles</button>
          </div>

          <div className="delivery-checker">
            <input value={pincode} onChange={(event) => setPincode(event.target.value)} placeholder="Enter pincode" />
            <button type="button" className="secondary-button" onClick={() => setMessage('Delivery available in 3-5 business days.')}>Check</button>
          </div>

          {message && <p className="status-message">{message}</p>}

          <ul className="detail-list">
            <li>Secure checkout</li>
            <li>Easy 7-day returns</li>
            <li>Free shipping above ₹999</li>
          </ul>
        </div>
      </div>

      {viewerOpen && (
        <div className="viewer-modal" onClick={() => setViewerOpen(false)}>
          <div className="viewer-panel" onClick={(event) => event.stopPropagation()}>
            <div className="viewer-header">
              <span>Drag to rotate 360°</span>
              <div className="viewer-actions">
                <button type="button" className="secondary-button small" onClick={() => setRotationIndex((value) => (value - 1 + rotationFrames.length) % rotationFrames.length)}>Prev</button>
                <button type="button" className="secondary-button small" onClick={() => setRotationIndex((value) => (value + 1) % rotationFrames.length)}>Next</button>
                <button type="button" className="close-button" aria-label="Close" onClick={() => setViewerOpen(false)}><X size={18} /></button>
              </div>
            </div>
            <div
              className="viewer-stage"
              onMouseDown={(event) => handleViewerDragStart(event.clientX)}
              onMouseMove={(event) => handleViewerDragMove(event.clientX)}
              onMouseUp={() => setDragStartX(null)}
              onMouseLeave={() => setDragStartX(null)}
              onTouchStart={(event) => handleViewerDragStart(event.touches[0].clientX)}
              onTouchMove={(event) => handleViewerDragMove(event.touches[0].clientX)}
              onTouchEnd={() => setDragStartX(null)}
            >
              <img src={rotationFrames[rotationIndex % rotationFrames.length]} alt={`${product.name} 360 view`} />
            </div>
            <div className="viewer-footer">
              <span>{product.name}</span>
              <button type="button" className="secondary-button small" onClick={() => { setRotationIndex(0); setViewerOpen(false) }}>Reset view</button>
            </div>
          </div>
        </div>
      )}

      <div className="detail-accordion">
        <div className="accordion-item">
          <h4>Description</h4>
          <p>{product.description}</p>
        </div>
        <div className="accordion-item">
          <h4>Product details</h4>
          <p>Fabric: {product.fabric} • Fit: {product.fit}</p>
        </div>
        <div className="accordion-item">
          <h4>Shipping info</h4>
          <p>Free shipping above ₹999. Estimated delivery 3-6 working days.</p>
        </div>
      </div>

      <div className="detail-sections">
        <div className="detail-panel">
          <div className="panel-head">
            <p className="eyebrow">Fabric & fit</p>
            <h3>Crafted for movement</h3>
          </div>
          <div className="info-grid">
            <div>
              <span>Material</span>
              <strong>{product.fabric}</strong>
            </div>
            <div>
              <span>Fit</span>
              <strong>{product.fit}</strong>
            </div>
            <div>
              <span>Care</span>
              <strong>Cold wash, hang dry</strong>
            </div>
            <div>
              <span>Origin</span>
              <strong>Designed in India</strong>
            </div>
          </div>
        </div>

        <div className="detail-panel">
          <div className="panel-head">
            <p className="eyebrow">Size guide</p>
            <h3>Find your perfect fit</h3>
          </div>
          <div className="size-grid">
            <span>S</span>
            <span>M</span>
            <span>L</span>
            <span>XL</span>
            <span>XXL</span>
          </div>
          <p className="muted-copy">Relaxed chest, shoulder room, and a clean drape for everyday layering.</p>
        </div>
      </div>

      <div className="detail-row">
        <div className="detail-panel">
          <div className="panel-head">
            <p className="eyebrow">Delivery</p>
            <h3>Shipping & returns</h3>
          </div>
          <ul className="bullet-list">
            <li>Free shipping on orders above ₹999</li>
            <li>Dispatched within 48 hours</li>
            <li>Easy 7-day returns and exchanges</li>
          </ul>
        </div>

        <div className="detail-panel">
          <div className="panel-head">
            <p className="eyebrow">Customer love</p>
            <h3>Verified reviews</h3>
          </div>
          <div className="review-box">
            <strong>4.8/5</strong>
            <p>“The fabric feels premium and the fit is exactly what I wanted for everyday wear.”</p>
          </div>
        </div>
      </div>

      <div className="related-section">
        <div className="section-header compact-header">
          <div>
            <p className="eyebrow">Complete the look</p>
            <h2>You may also like</h2>
          </div>
          <button type="button" className="text-link-button" onClick={() => window.location.hash = '#shop'}>View all</button>
        </div>

        <div className="product-grid four-up">
          {products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
              onToggleWishlist={onToggleWishlist}
              isWished={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function WishlistPage({
  products,
  addToCart,
  toggleWishlist,
  setQuickView,
}: {
  products: Product[]
  addToCart: (product: Product) => void
  toggleWishlist: (id: string) => void
  setQuickView: (product: Product) => void
}) {
  if (!products.length) {
    return (
      <div className="page-width empty-state-wrap">
        <div className="empty-state">
          <h3>Your wishlist is empty.</h3>
          <button type="button" className="primary-button" onClick={() => window.location.hash = '#shop'}>Start shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-width section">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Saved favourites</p>
          <h1>Wishlist</h1>
        </div>
      </div>
      <div className="product-grid four-up">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
            onQuickView={setQuickView}
            onToggleWishlist={toggleWishlist}
            isWished
          />
        ))}
      </div>
    </div>
  )
}

function CartPage({
  cart,
  products,
  removeFromCart,
  updateQuantity,
}: {
  cart: CartItem[]
  products: Product[]
  removeFromCart: (cartId: string) => void
  updateQuantity: (cartId: string, delta: number) => void
}) {
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]))
  const items = cart.map((item) => ({ ...item, product: productLookup[item.productId] }))
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 149
  const discount = subtotal > 2999 ? 300 : 0
  const total = subtotal + shipping - discount

  if (!items.length) {
    return (
      <div className="page-width empty-state-wrap">
        <div className="empty-state">
          <h3>Your cart is currently empty.</h3>
          <button type="button" className="primary-button" onClick={() => window.location.hash = '#shop'}>Start shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-width cart-page">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Bag</p>
          <h1>Your cart</h1>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.product.image} alt={item.product.name} />
              <div className="cart-item-info">
                <h3>{item.product.name}</h3>
                <p>{item.product.category} • {item.color} • Size {item.size}</p>
                <div className="cart-item-controls">
                  <div className="quantity-box">
                    <button type="button" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                  <button type="button" className="text-link-button" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
            </div>
          ))}
        </div>

        <aside className="summary-panel">
          <h3>Order summary</h3>
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Discount</span><strong>- {formatPrice(discount)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
          <div className="summary-row total"><span>Grand total</span><strong>{formatPrice(total)}</strong></div>
          <input className="coupon-input" type="text" placeholder="Coupon code" />
          <button type="button" className="primary-button wide" onClick={() => window.location.hash = '#checkout'}>Checkout</button>
          <button type="button" className="secondary-button wide" onClick={() => window.location.hash = '#shop'}>Continue shopping</button>
        </aside>
      </div>
    </div>
  )
}

function CheckoutPage({
  cart,
  products,
  onCheckout,
}: {
  cart: CartItem[]
  products: Product[]
  onCheckout: () => void
}) {
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]))
  const items = cart.map((item) => ({ ...item, product: productLookup[item.productId] }))
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 999 ? 0 : 149
  const total = subtotal + shipping

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!items.length) return
    onCheckout()
  }

  return (
    <div className="page-width checkout-page">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1>Checkout</h1>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-card">
            <h3>Contact details</h3>
            <div className="form-grid two-col">
              <input type="text" placeholder="Full name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone" required />
            </div>
          </div>

          <div className="form-card">
            <h3>Shipping address</h3>
            <div className="form-grid two-col">
              <input type="text" placeholder="House / Flat number" required />
              <input type="text" placeholder="Street" required />
              <input type="text" placeholder="City" required />
              <input type="text" placeholder="State" required />
              <input type="text" placeholder="Pincode" required />
              <input type="text" placeholder="Country" required />
            </div>
          </div>

          <div className="form-card">
            <h3>Payment method</h3>
            <div className="payment-options">
              <label><input type="radio" name="payment" defaultChecked /> UPI</label>
              <label><input type="radio" name="payment" /> Credit / Debit Card</label>
              <label><input type="radio" name="payment" /> Net Banking</label>
              <label><input type="radio" name="payment" /> Cash on Delivery</label>
            </div>
          </div>

          <button type="submit" className="primary-button wide">Place order</button>
        </form>

        <aside className="summary-panel sticky">
          <h3>Order summary</h3>
          {items.map((item) => (
            <div key={item.id} className="summary-product">
              <span>{item.product.name} • {item.quantity}</span>
              <strong>{formatPrice(item.product.price * item.quantity)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
          <div className="summary-row"><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
          <div className="summary-row total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
        </aside>
      </div>
    </div>
  )
}

function OrderSuccessPage() {
  return (
    <div className="page-width success-page">
      <div className="success-card">
        <div className="success-icon">?</div>
        <p className="eyebrow">Order placement</p>
        <h1>ORDER PLACED SUCCESSFULLY</h1>
        <p>Your order ID is <strong>VEL-2026-8412</strong>. Estimated delivery is 5-7 business days.</p>
        <div className="success-actions">
          <button type="button" className="primary-button" onClick={() => window.location.hash = '#track'}>Track Order</button>
          <button type="button" className="secondary-button" onClick={() => window.location.hash = '#shop'}>Continue shopping</button>
        </div>
      </div>
    </div>
  )
}

function TrackingPage() {
  const steps = ['Order Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
  return (
    <div className="page-width tracking-page">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Tracking</p>
          <h1>Order status</h1>
        </div>
      </div>

      <div className="tracking-card">
        <div className="tracking-summary">
          <p>Order ID: <strong>VEL-2026-8412</strong></p>
          <p>Estimated delivery: <strong>27 Sep 2026</strong></p>
        </div>
        <ol className="timeline">
          {steps.map((step, index) => (
            <li key={step} className={index < 4 ? 'done' : ''}>
              <span className="timeline-dot" />
              <div>
                <strong>{step}</strong>
                {index === 0 && <small>Confirmed today</small>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function AccountPage() {
  return (
    <div className="page-width account-page">
      <div className="page-header-row">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>My Account</h1>
        </div>
      </div>

      <div className="account-grid">
        <div className="account-card">
          <h3>Profile</h3>
          <p>Name: Rohan Mehta</p>
          <p>Email: rohan@velora.com</p>
          <p>Saved addresses: 2</p>
        </div>
        <div className="account-card">
          <h3>Orders</h3>
          <p>3 active orders</p>
          <button type="button" className="secondary-button" onClick={() => window.location.hash = '#track'}>Track orders</button>
        </div>
        <div className="account-card">
          <h3>Wishlist</h3>
          <p>4 items saved</p>
          <button type="button" className="secondary-button" onClick={() => window.location.hash = '#wishlist'}>Open wishlist</button>
        </div>
      </div>
    </div>
  )
}

function AuthPage({ variant }: { variant: 'login' | 'signup' }) {
  return (
    <div className="page-width auth-page">
      <div className="auth-card">
        <p className="eyebrow">{variant === 'login' ? 'Welcome back' : 'Create account'}</p>
        <h1>{variant === 'login' ? 'Login' : 'Sign up'}</h1>
        <form className="auth-form">
          {variant === 'signup' && <input type="text" placeholder="Full name" required />}
          <input type="email" placeholder="Email" required />
          {variant === 'signup' && <input type="tel" placeholder="Phone number" required />}
          <input type="password" placeholder="Password" required />
          {variant === 'signup' && <input type="password" placeholder="Confirm password" required />}
          <label className="check-wrap"><input type="checkbox" /> I agree to the terms</label>
          <button type="submit" className="primary-button wide">{variant === 'login' ? 'Login' : 'Create account'}</button>
        </form>
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="page-width section">
      <div className="contact-grid">
        <div>
          <p className="eyebrow">Reach us</p>
          <h1>Contact Velora</h1>
          <p>We’d love to hear from you about sizing, styling, custom orders and collaboration opportunities.</p>
          <ul className="detail-list">
            <li>Email: hello@velora.com</li>
            <li>Phone: +91 98765 43210</li>
            <li>Studio: Coimbatore, Tamil Nadu</li>
          </ul>
        </div>
        <form className="contact-form">
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" rows={5} required />
          <button type="submit" className="primary-button">Send message</button>
        </form>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page-width section">
      <div className="story-page-layout">
        <div className="story-page-copy">
          <p className="eyebrow">Our approach</p>
          <h1>Made for modern movement.</h1>
          <p>Velora Studio creates refined essentials with a premium point of view — clean silhouettes, quality materials, and uncompromising comfort.</p>
          <p>We believe in functional elegance, honest craftsmanship, and wardrobes that work as hard as you do.</p>
        </div>
        <img src={images.story} alt="Velora studio story" />
      </div>
    </div>
  )
}

function FaqPage() {
  return (
    <div className="page-width section">
      <div className="faq-page">
        <p className="eyebrow">FAQ</p>
        <h1>Frequently asked questions</h1>
        <div className="faq-list">
          <div><h4>What is your shipping time?</h4><p>Standard delivery is 3-6 business days across India.</p></div>
          <div><h4>Do you offer exchanges?</h4><p>Yes. Exchanges are available for size changes within 7 days of delivery.</p></div>
          <div><h4>Do you have a studio?</h4><p>Yes, we have a studio in Coimbatore, Tamil Nadu.</p></div>
        </div>
      </div>
    </div>
  )
}

function PolicyPage({ title, text }: { title: string; text: string }) {
  return (
    <div className="page-width section policy-page">
      <div className="policy-card">
        <p className="eyebrow">Velora</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default App
