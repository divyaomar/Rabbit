import React, { useEffect, useRef, useState } from 'react';
import {FaFilter} from 'react-icons/fa'
import FilterSideBar from '../components/Products/FilterSideBar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductByFilters } from '../redux/slices/productsSlice';


const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.products);
    const queryParams = Object.fromEntries([...searchParams]);

// const [products, setProducts] = useState([]);
const [isSidebarOpen, setIsSidebarOpen] = useState(false)
const sidebarRef = useRef(null)
useEffect(()=>{
    dispatch(fetchProductByFilters({collection, ...queryParams}));
},[dispatch, collection, searchParams])


// toggleSide Bar
const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
}


//
const handleClickOutside = (e) => {
    // close sidebar if clicked outside
    if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
        setIsSidebarOpen(false);
    }

}

// 
useEffect(()=>{
    // add evnt listener for clicks
    document.addEventListener("mousedown", handleClickOutside)

    return
    // clean event listener
     return () => {
         document.removeEventListener("mousedown", handleClickOutside)
     };
},[]);

// useEffect(()=>{
//     setTimeout(() => {
//         const fetchProducts = [
//              {
//         _id:1,
//         name:"Product 1",
//         price: 49,
//         images:[{url:"https://picsum.photos/500/500?random=12"}]
//     },
//       {
//         _id:2,
//         name:"Product 2",
//         price: 59,
//         images:[{url:"https://picsum.photos/500/500?random=7"}]
//     },
//       {
//         _id:3,
//         name:"Product 3",
//         price: 199,
//         images:[{url:"https://picsum.photos/500/500?random=6"}]
//     },
//       {
//         _id:4,
//         name:"Product 4",
//         price: 299,
//         images:[{url:"https://picsum.photos/500/500?random=5"}]
//     },
//     {
//         _id:5,
//         name:"Product 5",
//         price: 99,
//         images:[{url:"https://picsum.photos/500/500?random=8"}]
//     },
//       {
//         _id:6,
//         name:"Product 6",
//         price: 69,
//         images:[{url:"https://picsum.photos/500/500?random=9"}]
//     },
//       {
//         _id:7,
//         name:"Product 7",
//         price: 169,
//         images:[{url:"https://picsum.photos/500/500?random=10"}]
//     },
//       {
//         _id:8,
//         name:"Product 8",
//         price: 159,
//         images:[{url:"https://picsum.photos/500/500?random=11"}]
//     },
//         ];
//         setProducts(fetchProducts)


//     }, 1000)
// },[])



  return (
    <div className='flex flex-col lg:flex-row'>
{/* === Mobbile Filter button==== */}
<button onClick={toggleSidebar} className="lg:hidden border p-2 flex justify-center items-center">

    <FaFilter className='mr-2'/> Filters
</button>
{/* filter side bar */}
<div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full" } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
    <FilterSideBar/>
</div>
{/* === Mobbile Filter button==== */}

<div className="flex-grow p-4">
    <h2 className="text-2xl uppercase mb-4">All Collection</h2>


    {/* ======== SORT OPTIONS =====  */}
<SortOptions/>


     {/* ======== SORT OPTIONS =====  */}

     {/* Product GRID */}

     <ProductGrid products={products} loading={loading} error={error}/>
</div>
    </div>
  )
}

export default CollectionPage