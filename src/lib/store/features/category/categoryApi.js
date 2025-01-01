import { base_url } from "@/utils/apiUrl";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchData = createAsyncThunk(
  "category/fetchData",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${base_url}/category?status=${status}`);
      const result = response.data;

      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue("Failed to fetch data");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
