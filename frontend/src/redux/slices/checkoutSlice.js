import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Asyc thuk to create a checkout sessio
export const createCheckout = createAsyncThunk("checkout/createCheckout", async (checkoutdata, {rejectWithValue}) => {
try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout`, checkoutdata, {
        headers:{
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        }

    })
    return response.data;
} catch (error) {
    console.error(error);
    return rejectWithValue(error.response?.data || { message: error.message })
    
}
});

const checkoutSlice = createSlice({
    name:"checkout",
    initialState:{
        checkout: null,
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Something went wrong";
        })
    }

})

export default checkoutSlice.reducer;