import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';
const backendURL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin;
const socket = io(backendURL);

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: socket,
  },
  reducers: {
    setSocket(state, action) {
      state.socket = action.payload;
    },
  },
});

export const { setSocket } = socketSlice.actions;
export default socketSlice.reducer;
