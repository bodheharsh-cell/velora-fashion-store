export const products = [
  { 
    id: 1, 
    name: 'Minimalist Black Dress', 
    price: 2499, 
    category: 'Women', 
    image: '/prod_1_1778924866615.png',
    description: 'A timeless silhouette crafted from lightweight crepe. This minimalist black dress features a tailored fit, subtle darting, and a fluid drape that moves elegantly with you.',
    details: ['100% Crepe de Chine', 'Hidden back zip closure', 'Midi length', 'Dry clean only'],
    reviews: 4.8,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black']
  },
  { 
    id: 2, 
    name: 'Crisp White Shirt', 
    price: 1999, 
    category: 'Men', 
    image: '/prod_2_1778924880423.png',
    description: 'The foundation of any wardrobe. Our crisp white shirt is cut from premium organic cotton poplin for breathability and structure, featuring a concealed button placket for an ultra-clean look.',
    details: ['100% Organic Cotton Poplin', 'Concealed placket', 'Tailored fit', 'Machine washable'],
    reviews: 4.9,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Light Blue']
  },
  { 
    id: 3, 
    name: 'Leather Handbag', 
    price: 4999, 
    category: 'Accessories', 
    image: '/prod_3_1778924918345.png',
    description: 'Expertly crafted in Italy from smooth full-grain leather, this handbag boasts a structured minimalist design with subtle hardware. Generously sized to carry your daily essentials in style.',
    details: ['100% Full-grain Leather', 'Magnetic closure', 'Interior zip pocket', 'Adjustable shoulder strap'],
    reviews: 5.0,
    sizes: ['One Size'],
    colors: ['Black', 'Tan']
  },
  { 
    id: 4, 
    name: 'Sleek Sneakers', 
    price: 2999, 
    category: 'Men', 
    image: '/prod_4_1778924935977.png',
    description: 'Elevate your everyday uniform with our sleek leather sneakers. Designed with a stripped-back profile and resting on a comfortable tonal rubber sole for all-day wear.',
    details: ['Italian leather upper', 'Tonal rubber sole', 'Waxed cotton laces', 'Handcrafted in Portugal'],
    reviews: 4.7,
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['White', 'Black']
  },
  { 
    id: 5, 
    name: 'Oversized Wool Coat', 
    price: 6499, 
    category: 'Women', 
    image: '/prod_1_1778924866615.png', 
    description: 'Envelop yourself in luxury with this oversized wool coat. Featuring drop shoulders and a tie belt, it offers a relaxed yet deeply sophisticated layering option for colder months.',
    details: ['80% Wool, 20% Cashmere', 'Unlined for soft drape', 'Removable belt', 'Dry clean only'],
    reviews: 4.9,
    sizes: ['S', 'M', 'L'],
    colors: ['Camel', 'Charcoal']
  },
  { 
    id: 6, 
    name: 'Silk Evening Blouse', 
    price: 1499, 
    category: 'Women', 
    image: '/prod_2_1778924880423.png', 
    description: 'An ethereal silk blouse designed with a delicate mock neck and draped back. Perfect for evening events where understated luxury is required.',
    details: ['100% Mulberry Silk', 'Mock neck with button fastening', 'Relaxed fit', 'Dry clean only'],
    reviews: 4.6,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Ivory', 'Black', 'Champagne']
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};
