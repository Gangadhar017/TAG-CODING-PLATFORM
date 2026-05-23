// import { toast } from 'react-hot-toast';
// const backendURL = import.meta.env.VITE_BACKEND_URL;

// export const loginUser = async (userData) => {
//   try {
//     const response = await fetch(`${backendURL}/users/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });

//     const data = await response.json();
//     if (response?.status === 200) {
//       const {accessToken,refreshToken,user}=data.data;
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//       localStorage.setItem('user', JSON.stringify(user));
//       toast.success("Logged in");
//       return true;
//     } 
//     else 
//     {
//       toast.error(data?.message || 'Server Error');
//       return false;
//     }
//   } 
//   catch (error) 
//   {
//     toast.error('Server Error');
//     console.error(error);
//     return false;
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await fetch(`${backendURL}/users/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(userData),
//     });
    
//     if (response?.status === 200) {
//       toast.success("Registration Successful");
//       return true;
//     } 
//     else 
//     {
//       const data = await response.json();
//       toast.error(data?.message || "Registration Failed")
//       return false;
//     }
//   } catch (error) {
//     toast.error('Server Error');
//     console.error(error);
//     return false;
//   }
// };

// export const isLoggedIn = () => {
//   const token = localStorage.getItem('accessToken');
//   return !!token;
// };

// export const getMyProfile = async () => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     const response = await fetch(`${backendURL}/users/getcurrentuser`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     const data = await response.json();
//     if (response.status === 200) {
//       return data.data;
//     } 
//     else 
//     {
//       return null;
//     }
//   } 
//   catch (error) 
//   {
//     toast.error('Failed to Load Profile');
//     return null;
//   }
// };

// export const logoutUser = async () => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     const response = await fetch(`${backendURL}/users/logout`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (response.status === 200) {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       toast.success("Logged out");
//       return true;
//     } else {
//       toast.error('Failed to log out');
//       return false;
//     }
//   } catch (error) {
//     toast.error('Server Error');
//     console.log(error);
//     return false;
//   }
// };

// export const updateUserAvatar = async (formData) => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     const response = await fetch(`${backendURL}/users/updateavatar`, {
//       method: 'PATCH',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const data = await response.json();
//     if (response.status === 200) {
//       localStorage.setItem('user', JSON.stringify(data.data));
//       toast.success("Avatar updated successfully");
//       return true;
//     } 
//     else 
//     {
//       toast.error(data?.message || 'Failed to update avatar');
//       return false;
//     }
//   } catch (error) {
//     toast.error('Server Error');
//     return false;
//   }
// };

// export const refreshTokenService = async () => {
//   try {
//     const token=localStorage.getItem('refreshToken');
//     if(!token)return;
    
//     const response=await fetch(`${backendURL}/users/refresh-token`,{
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({refreshToken:token})
//     });

//     const data = await response.json();
//     if (response.status === 200) {
//       const {refreshToken,accessToken}=data.data;
//       console.log("New RT-",refreshToken);
//       console.log("New AT-",accessToken);
//       localStorage.setItem('accessToken', accessToken);
//       localStorage.setItem('refreshToken', refreshToken);
//       return true;
//     } 
//     else 
//     {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       return false;
//     }
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
import { toast } from 'react-hot-toast';

const backendURL = import.meta.env.VITE_BACKEND_URL;

/* ===========================
   LOGIN USER
=========================== */
export const loginUser = async (userData) => {
  try {
    const response = await fetch(`${backendURL}/api/v1/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // ✅ include cookies (important for refresh token)
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok && data?.data?.accessToken) {
      const { accessToken, refreshToken, user } = data.data;

      // ✅ Save tokens and user info
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast.success('Logged in successfully');
      return true;
    } else {
      toast.error(data?.message || 'Invalid credentials');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    toast.error('Server error while logging in');
    return false;
  }
};

/* ===========================
   REGISTER USER
=========================== */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${backendURL}/api/v1/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success('Registration successful');
      return true;
    } else {
      toast.error(data?.message || 'Registration failed');
      return false;
    }
  } catch (error) {
    console.error('Register error:', error);
    toast.error('Server error during registration');
    return false;
  }
};

/* ===========================
   CHECK LOGIN STATUS
=========================== */
export const isLoggedIn = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

/* ===========================
   GET CURRENT USER PROFILE
=========================== */
export const getMyProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    if (!token) return null;

    const response = await fetch(`${backendURL}/api/v1/users/getcurrentuser`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      return data.data;
    } else {
      console.warn('Profile fetch failed:', data?.message);
      return null;
    }
  } catch (error) {
    console.error('Profile error:', error);
    toast.error('Failed to load profile');
    return null;
  }
};

/* ===========================
   LOGOUT USER
=========================== */
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${backendURL}/api/v1/users/logout`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });

    if (response.ok) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      return true;
    } else {
      toast.error('Logout failed');
      return false;
    }
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Server error while logging out');
    return false;
  }
};

/* ===========================
   UPDATE USER AVATAR
=========================== */
export const updateUserAvatar = async (formData) => {
  try {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${backendURL}/api/v1/users/updateavatar`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.data));
      toast.success('Avatar updated successfully');
      return true;
    } else {
      toast.error(data?.message || 'Failed to update avatar');
      return false;
    }
  } catch (error) {
    console.error('Avatar update error:', error);
    toast.error('Server error while updating avatar');
    return false;
  }
};

/* ===========================
   REFRESH TOKENS
=========================== */
export const refreshTokenService = async () => {
  try {
    const token = localStorage.getItem('refreshToken');
    if (!token) return false;

    const response = await fetch(`${backendURL}/api/v1/users/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken: token }),
    });

    const data = await response.json();

    if (response.ok && data?.data) {
      const { accessToken, refreshToken } = data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      console.log('🔄 Tokens refreshed successfully');
      return true;
    } else {
      // Token expired or invalid → log user out
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      console.warn('⚠️ Refresh token invalid, user logged out');
      return false;
    }
  } catch (error) {
    console.error('Refresh token error:', error);
    return false;
  }
};
