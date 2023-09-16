import { useState, useContext, createContext } from "react";

const CartProductsContext = createContext();
const CartProductsProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  return (
    <CartProductsContext.Provider value={[cartProducts, setCartProducts]}>
      {children}
    </CartProductsContext.Provider>
  );
};

// custom hook
const useCartProducts = () => useContext(CartProductsContext);

export { useCartProducts, CartProductsProvider };
