// src/layouts/CustomerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import TopBarAuth from "../components/header/TopBarAuth";
import MainNav from "../components/header/MainNav";
import Footer from "../components/Footer";

export default function CustomerLayout() {
    return (
        <div className="site-wrap">
            {/* CSS chuáº©n cho toÃ n bá»™ site */}
            <style>{`
  .site-wrap{
    min-height:100dvh;
    display:flex;
    flex-direction:column;
    background:#fffffff;
    color:#f5f5f5;
  }

  /* â†“ GIáº¢M khoáº£ng bÃ¹ cho header á»Ÿ Ä‘Ã¢y */
  :root{
    --header-offset: 72px; /* trÆ°á»›c lÃ  110px */
  }
  /* CÃ³ thá»ƒ tinh chá»‰nh theo mÃ n hÃ¬nh */
  @media (min-width: 1024px){
    :root{ --header-offset: 0px; } /* desktop cao hÆ¡n chÃºt */
  }

  .site-main{
    flex:1;
    padding-top: var(--header-offset);
    padding-bottom: 24px;
  }
`}</style>

            <TopBarAuth fixed cartCount={0} />
            <MainNav
                stickBelowTop
                routes={{ home: "/", products: "/products", news: "/news", contact: "/contact" }}
            />

            <main className="site-main">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}


