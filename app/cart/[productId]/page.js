"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion"; // Use framer-motion for advanced animations
import { CldImage } from "next-cloudinary";

// Icons for increment/decrement buttons
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const MinusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Manage product quantity
  const router = useRouter();
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50; // Minimum swipe distance to register a swipe
  const productId = params?.productId;

  useEffect(() => {
    if (productId) {
      const fetchProductDetails = async () => {
        try {
          const response = await fetch(`/api/uploadProduct/${productId}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [productId]);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Handle next and previous image navigation
  const goToNextImage = () => {
    if (product && currentImageIndex < product.productImage.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;

    if (distance > minSwipeDistance) {
      // Swipe left -> Next image
      goToNextImage();
    } else if (distance < -minSwipeDistance) {
      // Swipe right -> Previous image
      goToPreviousImage();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Professional Loader with Animation
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="relative">
          <div className="absolute w-12 h-32 rounded-full border-8 border-t-4 border-white border-solid animate-spin-slow"></div>
          <div className="absolute w-10 h-20 rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 animate-ping"></div>
          <div className="flex flex-col items-start mt-8">
            <div className="text-xl font-bold text-white mb-6 animate-bounce">
              <span className="text-yellow-300">We&apos;re</span> Getting Things
              Ready!
            </div>
            <div className="text-xs text-white font-light animate-pulse">
              Please hold on, this won&apos;t take long...
            </div>
          </div>
          <div className="absolute top-0 left-0 right-0 bottom-0 animate-pulse-sparkle">
            <div className="absolute w-3 h-3 rounded-full bg-white opacity-50 animate-sparkle1"></div>
            <div className="absolute w-4 h-4 rounded-full bg-white opacity-40 animate-sparkle2"></div>
            <div className="absolute w-5 h-5 rounded-full bg-white opacity-30 animate-sparkle3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen p-4 bg-gray-50">
      <motion.div
        className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg overflow-hidden max-w-[90vw] md:max-w-3xl w-full p-4 md:p-6"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Product Image with Navigation */}
        <div className="md:w-1/2 flex flex-col items-center md:items-start p-0 md:px-10 relative mb-6 md:mb-0">
          <motion.div
            className="transition-transform transform hover:scale-105 duration-500 ease-in-out"
            whileHover={{ rotateY: 15 }}
            whileTap={{ scale: 0.95 }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {product.productImage?.length > 0 ? (
              <CldImage
                src={product.productImage[currentImageIndex].public_id}
                alt={product.name}
                width={400}
                height={300}
                className="object-fill w-[100vw] md:w-[30vw] h-[50vh] md:h-[40vh] rounded-lg"
              />
            ) : (
              <Image
                src="/placeholder.png"
                alt="Placeholder Image"
                width={300}
                height={300}
                className="object-cover w-full h-full rounded-lg"
              />
            )}
          </motion.div>

          {/* Thumbnail Images */}
          <div className="flex mt-3 space-x-2 overflow-x-auto">
            {product.productImage.map((image, index) => (
              <div
                key={index}
                className="w-12 h-12 cursor-pointer"
                onClick={() => handleThumbnailClick(index)}
                onMouseEnter={() => handleThumbnailClick(index)}
              >
                <CldImage
                  src={image.public_id}
                  alt={`Thumbnail ${index}`}
                  width={48}
                  height={48}
                  className="object-cover rounded-md border border-gray-300"
                />
              </div>
            ))}
          </div>

          {/* Image Navigation Arrows */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer" onClick={goToPreviousImage}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer" onClick={goToNextImage}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 hover:text-gray-700 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Product Info */}
        <motion.div
          className="flex flex-col justify-between md:w-1/2 p-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <div className="text-center md:text-left mb-4">
            <h1 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-yellow-400 mb-4">⭐⭐⭐⭐⭐ (5.0)</p>
            <h3 className="text-xl text-green-600 font-bold">Rs. {product.price}</h3>
            <p className="text-sm text-gray-600 mt-4">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4 mt-6">
            <motion.button
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none transition-all duration-300 shadow"
              onClick={handleDecrement}
              whileTap={{ scale: 0.9 }}
            >
              <MinusIcon />
            </motion.button>

            <p className="text-lg font-medium text-gray-700">{quantity}</p>

            <motion.button
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 focus:outline-none transition-all duration-300 shadow"
              onClick={handleIncrement}
              whileTap={{ scale: 0.9 }}
            >
              <PlusIcon />
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <motion.button
              className="flex-1 mx-2 bg-gradient-to-br from-teal-500 via-blue-500 to-purple-500 hover:from-blue-700 hover:to-teal-700 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>

            <motion.button
              className="flex-1 mx-2 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 hover:from-orange-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded transition duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Buy Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );



};

export default ProductDetail;
