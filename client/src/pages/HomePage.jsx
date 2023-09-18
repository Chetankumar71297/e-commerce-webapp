import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCartProducts } from "../context/cart";
import { toast } from "react-toastify";
function HomePage() {
  const navigate = useNavigate();
  const [cartProducts, setCartProducts] = useCartProducts();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checkedCategoriesId, setCheckedCategoriesId] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //get total product count
  useEffect(() => {
    const getTotalCount = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/get-product-count`
        );
        setTotal(data?.totalProductCount);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCategories();
    getTotalCount();
  }, []);

  //get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/product/products-for-page/${page}`
      );
      setLoading(false);
      if (data?.success) {
        setProducts(data.products);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!checkedCategoriesId.length && !priceRange.length) getAllProducts();
  }, [checkedCategoriesId.length, priceRange.length]);

  //get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/category/get-categories`
      );
      if (data?.success) {
        setCategories(data.categoriesList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //filter by category
  const handleCategoryFilter = (value, id) => {
    let allCheckedId = [...checkedCategoriesId];
    if (value) {
      allCheckedId.push(id);
    } else {
      allCheckedId = allCheckedId.filter(
        (checkedCategoryId) => checkedCategoryId !== id
      ); //removes unchecked category id's
    }
    setCheckedCategoriesId(allCheckedId);
  };

  useEffect(() => {
    //get filtered products
    const getFilteredProducts = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API}/api/v1/product/get-filtered-products`,
          {
            checkedCategoriesId,
            priceRange,
          }
        );
        setProducts(data?.products);
      } catch (error) {
        console.log(error);
      }
    };

    if (checkedCategoriesId.length || priceRange.length) {
      getFilteredProducts();
    }
  }, [checkedCategoriesId, priceRange]);

  useEffect(() => {
    //load more products
    const loadMoreProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/product/products-for-page/${page}`
        );
        setLoading(false);
        setProducts((products) => [...products, ...data?.products]);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    if (page === 1) return;
    loadMoreProducts();
  }, [page]);

  return (
    <Layout title="All products - Best offers">
      <div className="row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter by category</h4>
          <div className="d-flex flex-column">
            {categories?.map((category) => (
              <Checkbox
                key={category._id}
                onChange={(e) =>
                  handleCategoryFilter(e.target.checked, category._id)
                }
              >
                {category.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center">Filter by price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setPriceRange(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((product) => (
              <div
                key={product._id}
                className="card m-2"
                style={{ width: "18rem" }}
              >
                <img
                  src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description.substring(0, 30)}
                  </p>
                  <p className="card-text"> $ {product.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCartProducts([...cartProducts, product]);
                      localStorage.setItem(
                        "cartProducts",
                        JSON.stringify([...cartProducts, product])
                      );
                      toast.success("Product added to cart");
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => p + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;
