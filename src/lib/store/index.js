import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./features/category/categorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      category: categoryReducer,
    },
  });
};
