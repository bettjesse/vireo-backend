import catchErrors from "../utils/catchErrors";
import { createAccount, loginUser } from "../services/auth.service";
import { setAuthCookies,  } from "../utils/cookies";
import { registerSchema,loginSchema } from "./auth.schema";
import { CREATED,OK,UNAUTHORIZED } from "../constants/http";
import appAssert from "../utils/appAssert";
import { refreshUserAccessToken } from "../services/auth.service";
import SessionModel from "../models/session.model";
import { verifyToken } from "../utils/jwt";
import { clearAuthCookies, getRefreshTokenCookieOptions, getAccessTokenCookieOptions } from "../utils/cookies";
export const registerController = catchErrors(async (req, res) => {
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
    const { user, accessToken, refreshToken } = await createAccount(request);
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(CREATED)
      .json(user);
  });
  export const loginController = catchErrors(async (req, res) => {
    const request = loginSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
    const { accessToken, refreshToken } = await loginUser(request);
  
    // set cookies
    return setAuthCookies({ res, accessToken, refreshToken })
      .status(OK)
      .json({ message: "Login successful" });
  });
  export const logoutController = catchErrors(async (req, res) => {
    const accessToken = req.cookies.accessToken as string | undefined;
    const { payload } = verifyToken(accessToken || "");
  
    if (payload) {
      // remove session from db
      await SessionModel.findByIdAndDelete(payload.sessionId);
    }
  
    // clear cookies
    return clearAuthCookies(res)
      .status(OK)
      .json({ message: "Logout successful" });
  });

  export const refresController = catchErrors(async (req, res) => {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");
  
    const { accessToken, newRefreshToken } = await refreshUserAccessToken(
      refreshToken
    );
    if (newRefreshToken) {
      res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
    }
    return res
      .status(OK)
      .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .json({ message: "Access token refreshed" });
  });