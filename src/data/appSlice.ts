import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  ftl: boolean;
}

const initialState: AppState = {
  ftl: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setFtl(state, action: PayloadAction<boolean>) {
      state.ftl = action.payload;
    },
  },

  extraReducers(builder) {
    // builder
    //   .addCase(getLocalSaves.pending, (state) => {
    //     return { ...state, localSavesStatus: AsyncStatus.loading };
    //   })
    //   .addCase(getLocalSaves.fulfilled, (state, action) => {
    //     return { ...state, localSaves: action.payload, localSavesStatus: AsyncStatus.succeeded };
    //   });
  },
});

// Action creators are generated for each case reducer function
export const { setFtl } = appSlice.actions;

export default appSlice.reducer;
