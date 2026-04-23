import React, { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ProductsLists.css";
import Footer from "../components/Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
function SubMenu({ items, onSelect, top, left, onMouseEnter, onMouseLeave }) {
  return createPortal(
    <div
      className="submenu"
      style={{ top: `${top}px`, left: `${left}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {items.map(sub => (
        <div
          key={sub}
          className="submenu-item"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(sub);
          }}
        >
          {sub}
        </div>
      ))}
    </div>,
    document.body
  );
}

function ProductsLists() {
  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [hovered, setHovered] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCat, setExpandedCat] = useState(null);
  const itemRefs = useRef({});
  const leaveTimer = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  // Fetch categories from backend
  useEffect(() => {
    fetch(`${BASE_URL}/Products/categories/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then(data => {
        const normalized = (Array.isArray(data) ? data : []).map(cat => ({
          name: cat.name,
          sub: cat.subcategories ?? [],
        }));
        setCategoriesData(normalized);
      })
      .catch(err => console.error("Categories fetch error:", err))
      .finally(() => setCategoriesLoading(false));
  }, []);

  // Fetch products
  useEffect(() => {
    fetch(`${BASE_URL}/Products/`)
      .then(res => {
        if (!res.ok) throw new Error("Error fetching products");
        return res.json();
      })
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p || !p.title) return false;
      return (
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category) &&
        (subcategory === "All" ||
          p.subcategory?.toLowerCase().trim() === subcategory.toLowerCase().trim())
      );
    });
  }, [products, search, category, subcategory]);

  const activeLabel =
    subcategory !== "All"
      ? subcategory
      : category !== "All"
      ? category
      : "All Products";

  const handleMouseEnter = name => {
    if (isMobile) return;
    clearTimeout(leaveTimer.current);
    const el = itemRefs.current[name];
    if (el) {
      const rect = el.getBoundingClientRect();
      setMenuPos({ top: rect.top, left: rect.right + 6 });
    }
    setHovered(name);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    leaveTimer.current = setTimeout(() => setHovered(null), 120);
  };

  const handleSubMenuEnter = () => clearTimeout(leaveTimer.current);
  const handleSubMenuLeave = () => {
    leaveTimer.current = setTimeout(() => setHovered(null), 120);
  };

  const handleMobileCatClick = cat => {
    setCategory(cat.name);
    setSubcategory("All");
    setExpandedCat(expandedCat === cat.name ? null : cat.name);
  };

  const handleSearch = () => setSearch(searchInput);
  const handleKeyDown = e => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="shop-wrap">
        <div className="shop-search-bar">
          <div className="shop-search-inner">
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="shop-search-input"
              placeholder="Search laptops, phones, cameras..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="shop-search-btn" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="shop-body">
          <aside className="shop-sidebar">
            <div className="shop-sidebar-title">Categories</div>

            <ul className="shop-sidebar-list">
              <li
                className={`shop-cat-item ${category === "All" ? "shop-cat-active" : ""}`}
                onClick={() => {
                  setCategory("All");
                  setSubcategory("All");
                  setHovered(null);
                  setExpandedCat(null);
                }}
              >
                <span className="shop-cat-icon">🖥️</span>
                <span>All Products</span>
              </li>

              {categoriesLoading ? (
                <li className="shop-cat-item" style={{ opacity: 0.5, cursor: "default" }}>
                  Loading categories...
                </li>
              ) : (
                categoriesData.map(cat => (
                  <li key={cat.name} className="shop-cat-wrapper">
                    <div
                      className={`shop-cat-item ${category === cat.name ? "shop-cat-active" : ""}`}
                      ref={el => (itemRefs.current[cat.name] = el)}
                      onMouseEnter={() => handleMouseEnter(cat.name)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => {
                        if (isMobile) {
                          handleMobileCatClick(cat);
                        } else {
                          setCategory(cat.name);
                          setSubcategory("All");
                        }
                      }}
                    >
                  
                      <span className="shop-cat-icon"></span>
                      <span>{cat.name}</span>
                      {!isMobile && cat.sub.length > 0 && (
                        <span className="shop-cat-chevron">›</span>
                      )}
                      {!isMobile && hovered === cat.name && cat.sub.length > 0 && (
                        <SubMenu
                          items={cat.sub}
                          top={menuPos.top}
                          left={menuPos.left}
                          onMouseEnter={handleSubMenuEnter}
                          onMouseLeave={handleSubMenuLeave}
                          onSelect={sub => {
                            setCategory(cat.name);
                            setSubcategory(sub);
                            setHovered(null);
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>

            {isMobile && expandedCat && (
              <ul className="shop-sub-list">
                {categoriesData
                  .find(c => c.name === expandedCat)
                  ?.sub.map(sub => (
                    <li
                      key={sub}
                      className={`shop-sub-item ${subcategory === sub ? "shop-sub-active" : ""}`}
                      onClick={() => {
                        setCategory(expandedCat);
                        setSubcategory(sub);
                      }}
                    >
                      {sub}
                    </li>
                  ))}
              </ul>
            )}
          </aside>

          <main className="shop-main">
            <div className="shop-header">
              <h2><span>{activeLabel}</span></h2>
              {!loading && (
                <span className="shop-count">
                  {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loading ? (
              <p className="shop-status">Loading products...</p>
            ) : (
              <div className="shop-grid">
                {filteredProducts.length === 0 ? (
                  <p className="shop-status">No products found.</p>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className={`pcard ${product.is_sold ? "pcard-sold" : ""}`}
                      onClick={() => !product.is_sold && navigate(`/products/${product.id}`)}
                    >
                      <div className="pcard-img-wrap">
                        <img
                          src={
                            product.images &&
                            Array.isArray(product.images) &&
                            product.images.length > 0
                              ? product.images[0].image
                              : "/placeholder.png"
                          }
                          alt={product.title}
                        />
                        {product.is_sold && (
                          <div className="pcard-sold-overlay">
                            <span>SOLD OUT</span>
                          </div>
                        )}
                        {product.discount_percentage > 0 && !product.is_sold && (
                          <span className="pcard-badge">-{product.discount_percentage}%</span>
                        )}
                      </div>

                      <div className="pcard-body">
                        {product.subcategory && (
                          <span className="pcard-sub">{product.subcategory}</span>
                        )}
                        <h4>{product.title}</h4>
                        <div className="pcard-prices">
                          <span className="pcard-price">Ksh {Number(product.price).toLocaleString()}</span>
                          {product.old_price && product.discount_percentage > 0 && (
                            <span className="pcard-old">Ksh {Number(product.old_price).toLocaleString()}</span>
                          )}
                        </div>
                        {product.rating > 0 && (
                          <div className="pcard-rating">
                            <span className="pcard-stars">
                              {"★".repeat(Math.round(product.rating))}
                              {"☆".repeat(5 - Math.round(product.rating))}
                            </span>
                            <span className="pcard-rval">({product.rating})</span>
                          </div>
                        )}
                        <button
                          className={`pcard-btn ${product.is_sold ? "pcard-btn-off" : ""}`}
                          disabled={product.is_sold}
                          onClick={e => {
                            e.stopPropagation();
                            if (!product.is_sold) navigate(`/products/${product.id}`);
                          }}
                        >
                          {product.is_sold ? "Sold Out" : "View Details →"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ProductsLists;