import { createSlice } from "@reduxjs/toolkit";
import { fetchData } from "./categoryApi";

const initialState = {
  data: [],
  loading: true,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const { getData } = categorySlice.actions;

export default categorySlice.reducer;
