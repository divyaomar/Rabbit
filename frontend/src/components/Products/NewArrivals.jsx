// import React, { useEffect, useRef, useState } from 'react'
// import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// import { Link } from 'react-router-dom';

// const NewArrivals = () => {
// const scrollRef = useRef(null);
// const [isDragging, setIsDragging] = useState(false);
// const [startX, setStartX] = useState(0);
// const [scrollLeft, setScrollLeft] = useState(false)
// const [canScrollRight, setCanScrollRight] = useState(true);
// const [canScrollLeft, setCanScrollLeft] = useState(true);


//     const newArrivals = [
//         {
//             _id:"1",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=1",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"2",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=2",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"3",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=3",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"4",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=4",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"5",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=5",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"6",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=6",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"7",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=7",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//          {
//             _id:"8",
//             name:"Stylish Jacket",
//             price:120,
//             images:[
//                 {
//                     url:"https://picsum.photos/500/500?random=8",
//                     altText:"Stylish Jacket",
//                 },
//             ],
//         },
//     ]




//     // handlemousedown
// const handleMouseDown = (e) => {
//     setIsDragging(true);
//     setStartX(e.pageX - scrollRef.current.offsetLeft);
//     setScrollLeft(scrollRef.current.scrollLeft);
// }
// // handleMouseMove
// const handleMouseMove = () => {
// if(!isDragging) return;
// const x = e.pageX - scrollRef.current.offsetLeft;
// const walk = x - startX;
// scrollRef.current.scrollLeft = scrollLeft -walk;
// }

// // 
// const handleMouseUpOrLeave = () => {
// setIsDragging(false);

// }


// // buttons clicked

// const scroll = (direction) => {
//     const scrollAmount = direction === "left" ? -300 : 300;
//     scrollRef.current.scrollBy({left: scrollAmount, behaviour: "smooth"})
// }


//     // update scroll buttons
//     const updateScrollButtons = () => {
//         const container = scrollRef.current;

//         if(container) {
//             const leftScroll = container.scrollleft;
//             const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth
//             setCanScrollLeft(leftScroll > 0);
//         }
//         console.log({
//             scrollLeft: container.scrollLeft,
//             clientWidth: container.clientWidth,
//             containerScrollWidth: container.scrollWidth
//         })
//     }

//     useEffect(()=>{
//         const container = scrollRef.current;
//         if(container){
//             container.addEventListener("scroll", updateScrollButtons )
//             return () => container.removeEventListener("scroll", updateScrollButtons)
//         }

//     }, [])
//   return (
//     <section className='py-16 px-4 lg:px-0'>
//         <div className="container mx-auto text-center mb-10 relative">
//             <h2 className="text-3xl font-bold mb-4">
//                 Explore New Arrivals
//             </h2>
//             <p className='text-lg text-gray-300 mb-8'>
//                 Discover the latest styles straight off the runway, freshly added to keep your wardrob on the cutting edge of Fashion.
//             </p>

//             {/* Scroll button */}
//             <div className="absolute right-0 bottom-[-30px] flex space-x-2">
//                 <button onClick={()=>scroll("left")}
//                 disabled={!canScrollLeft} className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
//                     <FiChevronLeft className='text-2xl'/>
//                 </button>

//                 <button onClick={()=>scroll("right")} className={`p-2 rounded border ${canScrollRight ? 
//                     "bg-white text-black" : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}>
//                     <FiChevronRight className='text-2xl'/>
//                 </button>
//             </div>
//         </div>

//         {/* scrollable content */}
//         <div 
//         ref={scrollRef}
//         className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
//         onMouseDown={handleMouseDown}
//         onMouseMove={handleMouseMove}
//         onMouseUp = {handleMouseUpOrLeave}
//         onMouseLeave = {handleMouseUpOrLeave}
//         >
//             {
//                 newArrivals.map((product) => (
//                     <div key={(product.id)} className='min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative'>
//                         <img 
//                         src={product.images[0]?.url}
//                         alt={product.images[0]?.altText || product.name}
//                         className='w-full h-[500px] object-cover rounded-lg'
//                         draggable="false"
//                         />
//                         <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-n-lg">
//                             <Link to={`/products/${product._id}`} className='block'><h4 className='font-medium'>{product.name}
//                                 </h4>
//                                 <p className='mt-1'>${product.price}</p>
//                                 </Link>
//                         </div>
//                     </div>
//                 ))
//             }
//         </div>
//     </section>
//   )
// }

// export default NewArrivals;


import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
// Left & Right arrow icons
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
// For product detail page navigation
import { Link } from 'react-router-dom';

const NewArrivals = () => {

  // 👉 Scrollable container ka reference (DOM element)
  const scrollRef = useRef(null);

  // 👉 Mouse drag ho raha hai ya nahi(to check the container ca be scrolled)
  const [isDragging, setIsDragging] = useState(false);

  // 👉 Mouse ka starting X position jab drag start hua(starting value of x-axis when user grabs and scrolls the container)
  const [startX, setStartX] = useState(0);

  // 👉 Drag start ke time container ka scrollLeft value( this will be the initial scroll position of container)
  const [scrollLeft, setScrollLeft] = useState(false);

  // 👉 Right scroll button enable / disable()
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 👉 Left scroll button enable / disable
  const [canScrollLeft, setCanScrollLeft] = useState(true);

  // ================== PRODUCTS DATA ==================
  // Dummy products list (backend/API se bhi aa sakta hai)
  // const newArrivals = [
  //   {
  //     _id: "1",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=1",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //   // ... baaki products same structure
  //    {
  //     _id: "2",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=2",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "3",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=3",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "4",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=4",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "5",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=5",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "6",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=11",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "7",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=7",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "8",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=8",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "9",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=9",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  //    {
  //     _id: "10",
  //     name: "Stylish Jacket",
  //     price: 120,
  //     images: [
  //       {
  //         url: "https://picsum.photos/500/500?random=10",
  //         altText: "Stylish Jacket",
  //       },
        
  //     ],
  //   },
  // ];

  const [newArrivals, setNewArrivals] = useState([]);
  useEffect(() =>{
    const fetchNewArrivals = async() => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        setNewArrivals(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchNewArrivals();
  }, [])
  // ================== MOUSE EVENTS ==================

  // 👉 Jab user mouse press karta hai (drag start)
  const handleMouseDown = (e) => {
    setIsDragging(true); // drag start
    // Mouse ki X position store
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    // Us moment ka scrollLeft store
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // 👉 Jab mouse move hota hai (drag chal raha)
  const handleMouseMove = (e) => {
    // Agar drag start hi nahi hua to kuch mat karo
    if (!isDragging) return;

    // Current mouse X position
    const x = e.pageX - scrollRef.current.offsetLeft;

    // Mouse kitna aage/peeche gaya
    const walk = x - startX;

    // Container ko utna hi scroll kara do
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // 👉 Jab mouse chhod diya ya container se bahar gaya
  const handleMouseUpOrLeave = () => {
    setIsDragging(false); // drag end
  };

  // ================== BUTTON SCROLL ==================

  // 👉 Left / Right arrow button se scroll
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;

    // Smooth horizontal scroll
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behaviour: "smooth",
    });
  };

  // ================== SCROLL BUTTON LOGIC ==================

  // 👉 Check karta hai ki left/right scroll possible hai ya nahi
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      // Kitna left scroll hua hai
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth

      // Left button tab enable jab scrollLeft > 0
      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable)
    }

    // Debug ke liye values print
    console.log({
      scrollLeft: container.scrollLeft,
      clientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
    });
  };

  // 👉 Component mount hone par scroll listener add
  useEffect(() => {
    const container = scrollRef.current;

    if (container) { 
      container.addEventListener("scroll", updateScrollButtons);

      // Cleanup: component unmount hone par remove listener
      return () =>
        container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);

  // ================== UI ==================
  return (
    <section className="py-16 px-4 lg:px-0">
      
      {/* Heading & description */}
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">
          Explore New Arrivals
        </h2>

        <p className="text-lg text-gray-300 mb-8">
          Discover the latest styles straight off the runway.
        </p>

        {/* Left / Right scroll buttons */}
        <div className="absolute right-0 bottom-[-30px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border mb-3 ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded border mb-3 ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* ================== SCROLLABLE PRODUCTS ================== */}
      <div
        ref={scrollRef} // scrollable div ka reference
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            {/* Product image */}
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-[400px] object-cover rounded-lg"
              draggable="false"
            />

            {/* Product overlay info */}
            <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 backdrop-blur-md text-white p-4 rounded-lg">
              <Link to={`/products/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
