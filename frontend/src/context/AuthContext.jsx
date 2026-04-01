import { Loader } from "lucide-react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  currentUser,
  commonLogin,
  loggedOutUser,
  registerAdmin,
  updateUserProfile,
  changeCurrentPassword,
  updateUserAvatar,
} from "../api/index";

import { LocalStorage } from "../utils";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================

  const [user, setUser] = useState(() => LocalStorage.get("user") || null);
  const [role, setRole] = useState(() => LocalStorage.get("user")?.role || "");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const isAuthenticated = !!user;

  const initialized = useRef(false);

  // =========================
  // SAVE USER
  // =========================

  const persistUser = useCallback((userData) => {

    if (!userData) return;

    setUser(prev => {
      if (JSON.stringify(prev) === JSON.stringify(userData)) return prev;
      return userData;
    });

    setRole(prev => {
      if (prev === userData.role) return prev;
      return userData.role;
    });

    LocalStorage.set("user", userData);

  }, []);

  // =========================
  // CLEAR AUTH
  // =========================

  const clearAuth = useCallback(() => {

    LocalStorage.remove("user");

    setUser(prev => prev ? null : prev);
    setRole(prev => prev ? null : prev);

  }, []);

  // =========================
  // FETCH USER
  // =========================

  const fetchCurrentUser = useCallback(async () => {

    try {

      const res = await currentUser();

      const userData =
        res?.data?.data?.user ||
        res?.data?.data ||
        null;

      if (userData) {
        persistUser(userData);
        return userData;
      }

      clearAuth();
      return null;

    } catch {

      clearAuth();
      return null;

    }

  }, [persistUser, clearAuth]);

  // =========================
  // UPDATE USER PROFILE
  // =========================

  const updateUser = useCallback(async (updatedUserData) => {
    try {
      // Update the user state and localStorage
      const newUserData = { ...user, ...updatedUserData };
      persistUser(newUserData);
      return { success: true, data: newUserData };
    } catch (error) {
      console.error("Failed to update user:", error);
      return { success: false, error: error.message };
    }
  }, [user, persistUser]);

  // =========================
  // INIT (RUN ONLY ONCE)
  // =========================

  useEffect(() => {

    if (initialized.current) return;

    initialized.current = true;

    const init = async () => {

      try {

        const storedUser = LocalStorage.get("user");

        if (storedUser) {
          await fetchCurrentUser();
        }

      } finally {

        setIsInitializing(false);

      }

    };

    init();

  }, [fetchCurrentUser]);

  // =========================
  // LOGIN
  // =========================

  const login = useCallback(async (payload) => {

    setLoading(true);

    try {

      await commonLogin(payload);

      const userData = await fetchCurrentUser();

      if (!userData) throw new Error("User fetch failed");

      return { success: true };

    } finally {

      setLoading(false);

    }

  }, [fetchCurrentUser, navigate]);

  // =========================
  // REGISTER
  // =========================

  const register = useCallback(async (payload) => {

    setLoading(true);

    try {

      const res = await registerAdmin(payload);

      return { success: true, data: res.data };
    }
    catch(error) {
      console.error(error?.response?.data.message);
      return { success: false, error: error?.response?.data?.message || "Registration failed" };
    } finally {
      setLoading(false);
    }

  }, []);

  // =========================
  // LOGOUT
  // =========================

  const logout = useCallback(async () => {

    setLoading(true);

    try {
      await loggedOutUser();
    } finally {

      clearAuth();

      navigate("/login", { replace: true });

      setLoading(false);

    }

  }, [clearAuth, navigate]);

  // =========================
  // UPDATE PROFILE API INTEGRATION
  // =========================

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    try {
      const response = await updateUserProfile(profileData);
      const updatedUser = response?.data?.data || response?.data;

      if (updatedUser) {
        persistUser(updatedUser);
        return { success: true, data: updatedUser };
      }

      return { success: false, error: "Failed to update profile" };
    } catch (error) {
      console.error("Failed to update profile:", error);
      return { success: false, error: error?.response?.data?.message || "Failed to update profile" };
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  // =========================
  // CHANGE PASSWORD API INTEGRATION
  // =========================

  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    try {
      const response = await changeCurrentPassword(passwordData);
      return { success: true, data: response?.data };
    } catch (error) {
      console.error("Failed to change password:", error);
      return { success: false, error: error?.response?.data?.message || "Failed to change password" };
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // UPDATE AVATAR API INTEGRATION
  // =========================

  const updateAvatar = useCallback(async (avatarFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await updateUserAvatar(formData);
      const updatedUser = response?.data?.data || response?.data;

      if (updatedUser) {
        persistUser(updatedUser);
        return { success: true, data: updatedUser };
      }

      return { success: false, error: "Failed to update avatar" };
    } catch (error) {
      console.error("Failed to update avatar:", error);
      return { success: false, error: error?.response?.data?.message || "Failed to update avatar" };
    } finally {
      setLoading(false);
    }
  }, [persistUser]);

  // =========================
  // MEMO VALUE
  // =========================

  const value = useMemo(() => ({
    user,
    role,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    setUser: updateUser, // Add setUser function
    updateProfile,       // Add updateProfile function
    changePassword,      // Add changePassword function
    updateAvatar,        // Add updateAvatar function
  }), [user, role, loading, isAuthenticated, login, register, logout, updateUser, updateProfile, changePassword, updateAvatar]);

  // =========================
  // LOADING SCREEN
  // =========================

  if (isInitializing) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

};
