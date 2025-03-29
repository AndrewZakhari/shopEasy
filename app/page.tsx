"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Head from 'next/head';
import { FiSearch, FiShoppingCart, FiChevronRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiX } from 'react-icons/fi';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  rating: {
    count: number;
  };
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  interface CartItem extends Product {
    quantity: number;
  }
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch featured products (limit to 4)
        const featuredResponse = await axios.get('https://fakestoreapi.com/products?limit=4');
        setFeaturedProducts(featuredResponse.data);
        
        // Fetch trending products (electronics category)
        const trendingResponse = await axios.get('https://fakestoreapi.com/products/category/electronics');
        setTrendingProducts(trendingResponse.data.slice(0, 6));
  const addToCart = (product: Product) => {
        setLoading(false);
  }
      } catch (err :any) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product : Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <>
      <Head>
        <title>ShopEasy - Modern E-Commerce Store</title>
        <meta name="description" content="Discover amazing products at ShopEasy" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">New Season Collection</h1>
            <p className="text-xl mb-6">Discover our curated selection of premium products</p>
            <Link href="/browse">
            <button  className="bg-white
             text-indigo-600 px-6 py-3 rounded-lg font-medium hover:cursor-pointer hover:bg-gray-100 transition duration-300">
              Shop Now
            </button>
            </Link>
            
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="relative bg-transparent">
                <Image
                width={440}
                height={650}
                  src="/monitor.png"
                  alt="Featured Product" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FiTruck className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-lg mb-1">Free Shipping</h3>
                <p className="text-gray-600">On all orders over $50</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FiRefreshCw className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-lg mb-1">Easy Returns</h3>
                <p className="text-gray-600">30-day return policy</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm flex items-start">
              <div className="bg-indigo-100 p-3 rounded-full mr-4">
                <FiShield className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-black text-lg mb-1">Secure Payment</h3>
                <p className="text-gray-600">100% secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <a href="/browse" className="flex items-center text-indigo-400 hover:text-indigo-600">
              View all <FiChevronRight className="ml-1" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div key={product.id} className="bg-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
                <div className="relative h-60 bg-white flex items-center justify-center p-4">
                  <Image
                    width={139}
                    height={190 }
                    src={product.image} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  <button 
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-indigo-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-700"
                  >
                    <FiShoppingCart />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-black">
                      
                      <FiStar id={product.id + "star1"} className='hover:text-yellow-500'/>
                      <FiStar id={product.id + "star2"} className='hover:text-yellow-500'/>
                      <FiStar id={product.id + "star3"} className='hover:text-yellow-500'/>
                      <FiStar id={product.id + "star4"} className='hover:text-yellow-500'/>
                      <FiStar id={product.id + "star5"} className='hover:text-yellow-500'/>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({product.rating.count})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-black mb-10">Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map(product => (
              <div key={product.id} className="bg-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
                <div className="relative h-48 bg-white flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 hover:cursor-pointer bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="max-w-2xl mx-auto mb-6">Subscribe to our newsletter for the latest products and exclusive offers.</p>
          <div className="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none text-white"
            />
            <button className="bg-indigo-800 px-6 py-3 rounded-r-lg font-medium hover:bg-indigo-900 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setIsCartOpen(false)}></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Your Cart ({totalItems} items)</h3>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-4">
                  {cart.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                          <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <div className="w-full">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}