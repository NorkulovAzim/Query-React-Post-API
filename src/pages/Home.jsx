import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <Link to="/faqs">Go to FAQ Management</Link>
      </div>
    </div>
  );
};

export default Home;
