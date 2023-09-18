import { useState, useContext, createContext, useEffect } from "react";

const CartProductsContext = createContext();
const CartProductsProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cartProducts");
    if (existingCartItem) {
      setCartProducts(JSON.parse(existingCartItem));
    }
  }, []);

  return (
    <CartProductsContext.Provider value={[cartProducts, setCartProducts]}>
      {children}
    </CartProductsContext.Provider>
  );
};

// custom hook
const useCartProducts = () => useContext(CartProductsContext);

export { useCartProducts, CartProductsProvider };
