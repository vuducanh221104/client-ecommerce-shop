import httpRequest from "@/utils/httpRequest";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  updateUserProfile,
} from "./authSlice";
import {
  updateUserProfile as updateUserProfileService,
  authLogin as authLoginService,
  logout as logoutService,
} from "@/services/authServices";
// import routes from '@/config/routes';

export const login = async (
  user: any,
  tokenCaptcha: string,
  dispatch: any,
  router: any
) => {
  dispatch(loginStart());
  try {
    const res = await authLoginService(user, dispatch);

    // Manually dispatch loginSuccess here to ensure Redux state is updated
    if (res && res.user) {
      dispatch(loginSuccess(res.user));
    }

    return res;
  } catch (error) {
    dispatch(loginFailed());
    throw error;
  }
};

export const logout = async (dispatch: any, router: any) => {
  dispatch(logOutStart());
  try {
    await logoutService(dispatch);
    // No need to dispatch logOutSuccess here, as it's done in the service
  } catch (err) {
    dispatch(logOutFailed());
  }
};

export const updateProfile = async (userData: any, dispatch: any) => {
  try {
    // Use the existing service function to update profile
    const response = await updateUserProfileService(userData, dispatch);
    return response;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
