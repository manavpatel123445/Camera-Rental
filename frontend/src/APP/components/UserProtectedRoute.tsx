import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../store";
import { logout } from "../userAuth/userAuthSlice";
import { useEffect } from "react";

export default function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.userAuth?.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // If user exists in Redux but no token in localStorage, clear the user state
    if (user && !token) {
      dispatch(logout());
    }
    // If token exists but no user in Redux, clear the token
    if (!user && token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    // Check if we have a valid user object in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user) {
      // If there's a user in localStorage but not in Redux, clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token, dispatch]);
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
