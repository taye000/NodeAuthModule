import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  signUp,
  verifyUserLoginByOTP,
} from "../../controllers";
import { validateRequest, validateToken } from "../../middleware";
import {
  passwordReset,
  updateProfile,
  requestPasswordReset,
  currentUserResetPassword,
} from "../../controllers";

const router = Router();

router.get("/", validateRequest, validateToken, getCurrentUser);

router.post("/signup", validateRequest, signUp);
router.post("/signin", validateRequest, login);
router.post("/verifyuser", validateRequest, verifyUserLoginByOTP);
router.post("/signout", validateRequest, logout);
router.post("/requestpasswordreset", validateRequest, requestPasswordReset);
router.post("/passwordreset", validateRequest, passwordReset);
router.post(
  "/userpasswordreset",
  validateRequest,
  validateToken,
  currentUserResetPassword
);
router.post("/updateprofile", validateRequest, validateToken, updateProfile);

module.exports = router;
