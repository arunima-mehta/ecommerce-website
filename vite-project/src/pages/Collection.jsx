import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { useNavigate } from 'react-router-dom';
import Discover from '../components/Discover';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [showDiscover, setShowDiscover] = useState(false);
  const navigate = useNavigate();

  const toggleCategory = (e) => {

    if ( category.includes(e.target.value)) {
      setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    if(showSearch && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length >0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    
    if(subCategory.length > 0){
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    setFilterProducts(productsCopy)
  }

const sortProduct = () => {

  let fpCopy = filterProducts.slice();

  switch (sortType) {
    case 'low-high':
      setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
      break;

    case 'high-low':
      setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
      break;
  
    default:
      applyFilter(); 
      break; 
  }
}

  useEffect(() => {
    applyFilter();
  }, [category,subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);
  

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

      {/* Filter Panel */}
      <div className='min-w-60'>
        <p 
          onClick={() => setShowFilter(!showFilter)} 
          className='my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          Filters
          <img 
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} 
            src={assets.dropdown_icon} 
            alt="dropdown" 
          />
        </p>

        {/* Category Filter */}
        <div className={`border border-gray-300 dark:border-gray-600 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium dark:text-gray-200'>Categories</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Men" onChange={toggleCategory} /> Men
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Women" onChange={toggleCategory} /> Women
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Unisex" onChange={toggleCategory} /> Unisex
            </p>
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className={`border border-gray-300 dark:border-gray-600 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium dark:text-gray-200'>Types</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700 dark:text-gray-300'>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Topwear" onChange={toggleSubCategory}/> Topwear
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Bottomwear" onChange={toggleSubCategory}/> Bottomwear
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Bags" onChange={toggleSubCategory}/> Bags
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Sunglasses" onChange={toggleSubCategory}/> Sunglasses
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Hats" onChange={toggleSubCategory}/> Hats
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Jewelery" onChange={toggleSubCategory}/> Jewelery
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Perfumes" onChange={toggleSubCategory}/> Perfumes
            </p>
            <p className='flex gap-2'> 
              <input className='w-3' type="checkbox" value="Footwear" onChange={toggleSubCategory}/> Footwear
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className='flex-1'>
          <>
            {/* Customized Collections Block */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-lg hover:shadow-xl transition-all">
              <h2 className="text-2xl font-bold mb-3 text-gray-800">CUSTOMIZED COLLECTIONS</h2>
              <p className="text-gray-600 mb-4">Discover products tailored to your taste. Swipe right to like, left to skip!</p>
              <button 
                onClick={() => navigate('/discover')} 
                className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                Start Discovering
              </button>
            </div>

            <div className='flex justify-between text-base sm:text-2xl mb-4'>
              <Title text1="All " text2="Collections" />
          
          {/* Sorting */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 text-sm px-2'>
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low-High</option>
            <option value="high-low">Sort by: High-Low</option>
          </select>
        </div>

        {/* Product List */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item, index) => (
              <ProductItem 
                key={index} 
                name={item.name} 
                id={item._id} 
                price={item.price} 
                image={item.image} 
              />
            ))
          }
        </div>
          </>
      </div>
    </div>
  );
};

export default Collection;
