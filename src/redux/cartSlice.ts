// cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  quantity: 0,
  products: [],
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    incrementQuantity: (state) => {
      state.quantity = state.products.length;
    },
    decreaseQuantity: (state) => {
      state.quantity = state.products.length;
    },
    deleteQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = state.products.length;
    },
    addProductToCart: (state, action: PayloadAction<any>) => {
      const product = action.payload;

      if (!state.products) {
        state.products = [];
      }

      const existingProduct = state.products.find((p:any) => p._id === product._id);
      const productPrice = product.price.discount || product.price.original;

      if (existingProduct) {
        existingProduct.quantityAddToCart += product.quantityAddToCart;
        existingProduct.productTotalPrice =
          existingProduct.quantityAddToCart * productPrice;
      } else {
        state.products.push({
          ...product,
          productTotalPrice: product.quantityAddToCart * productPrice,
        });
      }

      state.quantity = state.products.length;
      state.totalPrice += productPrice * product.quantityAddToCart;
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const product = state.products.find((item:any) => item._id === id);
      if (product) {
        const productPrice = product.price.discount || product.price.original;
        const oldQuantity = product.quantityAddToCart;

        product.quantityAddToCart = quantity;
        product.productTotalPrice = quantity * productPrice;

        state.totalPrice += (quantity - oldQuantity) * productPrice;
      }
    },
    updateTotalPrice: (state) => {
      state.totalPrice = state.products.reduce(
        (total:any, item:any) =>
          item.price.discount
            ? total + item.price.discount * item.quantityAddToCart
            : total + item.price.original * item.quantityAddToCart,
        0
      );
      state.quantity = state.products.length;
    },
    removeProduct: (state, action: PayloadAction<{ id: string }>) => {
      const productId = action.payload.id;
      const productToRemove = state.products.find(
        (item:any) => item._id === productId
      );

      if (productToRemove) {
        state.totalPrice -= productToRemove.productTotalPrice;
        state.products = state.products.filter(
          (item:any) => item._id !== productId
        );
        state.quantity = state.products.length;
      }
    },
    clearCart: (state) => {
      state.quantity = 0;
      state.products = [];
      state.totalPrice = 0;
    },
  },
});

export const {
  incrementQuantity,
  decreaseQuantity,
  deleteQuantity,
  addProductToCart,
  updateQuantity,
  updateTotalPrice,
  removeProduct,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
