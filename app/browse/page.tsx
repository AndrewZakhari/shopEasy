'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiShoppingCart, FiX, FiFilter } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
  });

  const categories = ['all', 'electronics', 'jewelery', "men's clothing", "women's clothing"];
  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-50', name: '$0 - $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100-500', name: '$100 - $500' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let results = products;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(product => product.category === filters.category);
    }

    // Apply price filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      results = results.filter(product => {
        if (max) return product.price >= min && product.price <= max;
        return product.price >= min;
      });
    }

    setFilteredProducts(results);
  }, [searchTerm, filters, products]);

  const addToCart = (product: Product) => {
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

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) return (
  <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
    );
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/">  
          <h1 className="text-2xl font-bold hover:cursor-pointer text-indigo-600">ShopEasy</h1>
            </Link>          
          <div className="relative flex-1 max-w-md mx-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-700 hover:text-indigo-600"
          >
            <FiShoppingCart className="text-xl" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Mobile filter button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden mb-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
        >
          <FiFilter className="mr-2" />
          Filters
        </button>

        {/* Sidebar Filters - Mobile */}
        {isFilterOpen && (
          <div className="md:hidden mb-6 bg-white p-4 rounded-lg shadow-md">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`mobile-category-${category}`}
                      name="category"
                      type="radio"
                      checked={filters.category === category}
                      onChange={() => setFilters({ ...filters, category })}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`mobile-category-${category}`} className="ml-3 text-sm text-gray-700 capitalize">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input
                      id={`mobile-price-${range.id}`}
                      name="priceRange"
                      type="radio"
                      checked={filters.priceRange === range.id}
                      onChange={() => setFilters({ ...filters, priceRange: range.id })}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`mobile-price-${range.id}`} className="ml-3 text-sm text-gray-700">
                      {range.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Filters - Desktop */}
        <aside className="hidden md:block w-64 pr-8">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center">
                    <input
                      id={`category-${category}`}
                      name="category"
                      type="radio"
                      checked={filters.category === category}
                      onChange={() => setFilters({ ...filters, category })}
                      className="h-4 w-4 hover:cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`category-${category}`} className="ml-3 text-sm text-gray-700 capitalize">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <div key={range.id} className="flex items-center">
                    <input
                      id={`price-${range.id}`}
                      name="priceRange"
                      type="radio"
                      checked={filters.priceRange === range.id}
                      onChange={() => setFilters({ ...filters, priceRange: range.id })}
                      className="h-4 w-4 hover:cursor-pointer border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor={`price-${range.id}`} className="ml-3 text-sm text-gray-700">
                      {range.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {filteredProducts.length} Products
            </h2>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-white flex items-center justify-center p-4">
                    <Image 
                      width={139}
                      height={190}
                      draggable="false"
                      src={product.image} 
                      alt={product.title} 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-3">
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
          )}
        </main>
      </div>

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
                            <Image
                              height={64}
                              width={64}
                              draggable="false"
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            <div className="mt-1 flex items-center">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-gray-500 hover:text-indigo-600"
                              >
                                -
                              </button>
                              <span className="mx-2 text-gray-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-gray-500 hover:text-indigo-600"
                              >
                                +
                              </button>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="ml-auto text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </div>
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
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-700">Subtotal:</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}