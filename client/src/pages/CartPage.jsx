import React from "react";
import Layout from "../components/Layout/Layout";
import { useCartProducts } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth] = useAuth();
  const [cartProducts, setCartProducts] = useCartProducts();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cartProducts?.map((product) => {
        total = total + product.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //remove product from cart
  const removeProductFromCart = (pid) => {
    try {
      let myCart = [...cartProducts];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCartProducts(myCart);
      localStorage.setItem("cartProducts", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">{`Hello ${
              auth?.token && auth?.user?.name
            }`}</h1>
            <h4 className="text-center">
              {cartProducts?.length > 0
                ? `You have ${cartProducts.length} items in your cart. ${
                    auth?.token ? "" : "Please login to checkout"
                  }`
                : "Your cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            {cartProducts?.map((product) => (
              <div className="row m-2 p-3 card flex-row" key={product._id}>
                <div className="col-md-4">
                  <img
                    src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                    width="100px"
                    height="100px"
                  />
                </div>
                <div className="col-md-8">
                  <p>{product.name}</p>
                  <p>{product.description.substring(0, 30)}</p>
                  <p>Price: $ {product.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeProductFromCart(product._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/login", { state: "/cart" })}
                  >
                    Please login to checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;