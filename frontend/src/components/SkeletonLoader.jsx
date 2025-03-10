import React from "react";

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`bg-gray-100 animate-pulse rounded ${className}`}></div>
  );
};

export default SkeletonLoader;
