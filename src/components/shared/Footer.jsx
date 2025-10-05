import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center text-sm text-gray-500">
      &copy; Eduardo Miguel Virgilio | {year}
    </footer>
  );
};

export default Footer;
