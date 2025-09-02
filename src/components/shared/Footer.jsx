import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return <footer>&copy; Eduardo Miguel Virgilio | {year}</footer>;
};

export default Footer;
