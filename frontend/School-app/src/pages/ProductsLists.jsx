import React, { useEffect, useState, useMemo } from "react";
import "./ProductsLists.css";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [subcategory, setSubcategory] = useState("All");
  const [categoriesData, setCategoriesData] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Fetch with caching
  useEffect(() => {
    const cachedProducts = localStorage.getItem("market_products");

    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
    } else {
      fetch("http://127.0.0.1:8000/Products/")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          localStorage.setItem("market_products", JSON.stringify(data));
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  // Categories
  useEffect(() => {
    setCategoriesData([
      { name: "Electronics", sub: ["Laptops", "Cameras", "Audio & Headphones"] },
      { name: "Fashion", sub: ["Men's Clothing", "Women's Clothing", "Shoes", "Bags"] },
      { name: "Home", sub: ["Furniture", "Kitchen", "Decor", "Lighting"] },
      { name: "Jewellery", sub: ["Necklaces", "Rings", "Bracelets", "Watches"] },
      { name: "Sports", sub: ["Fitness", "Footwear", "Outdoor Activities"] },
      { name: "Drinks", sub: ["Snacks", "Beverages", "Dairy Products"] },
    ]);
  }, []);

  // ✅ Optimized filtering
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || p.category === category;
      const matchesSubcategory =
        subcategory === "All" || p.subcategory === subcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [products, search, category, subcategory]);

  return (
    <>
      <div className="shop-container">
        {/* SIDEBAR */}
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          <ul>
            <li
              className={category === "All" ? "active" : ""}
              onClick={() => {
                setCategory("All");
                setSubcategory("All");
              }}
            >
              All
            </li>

            {categoriesData.map((cat) => (
              <li
                key={cat.name}
                className={category === cat.name ? "active" : ""}
                onMouseEnter={() => setHoveredCategory(cat.name)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => {
                  setCategory(cat.name);
                  setSubcategory("All");
                }}
              >
                {cat.name}

                {hoveredCategory === cat.name && (
                  <ul className="subcategory-flyout">
                    <li
                      className={subcategory === "All" ? "active" : ""}
                      onClick={() => setSubcategory("All")}
                    >
                      All
                    </li>
                    {cat.sub.map((sub) => (
                      <li
                        key={sub}
                        className={subcategory === sub ? "active" : ""}
                        onClick={() => setSubcategory(sub)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* MAIN */}
        <main className="shop-main">
          <div className="shop-search">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-text">Loading products...</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  className="product-card"
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="product-image-wrapper">
                    <img
                      loading="lazy"
                      src={product.images || "/placeholder.png"}
                      alt={product.title}
                    />
                  </div>

                  <div className="product-info">
                    <h4>{product.title}</h4>
                    <p className="price">
                      Ksh {Number(product.price).toLocaleString()}
                    </p>
                    {!product.is_sold ? (
                      <span className="available">In stock</span>
                    ) : (
                      <span className="sold">Sold</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}

export default ProductsList;
