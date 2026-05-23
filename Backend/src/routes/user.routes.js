import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getCurrentUser,
  gettemplateandlang,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  setdefaultlang,
  settemplate,
  updateAvatar,
} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/getcurrentuser", verifyJWT, getCurrentUser);
router.patch("/updateavatar", verifyJWT, upload.single("avatar"), updateAvatar);
router.post("/updatedefaultlang/:lang", verifyJWT, setdefaultlang);
router.post("/updatetemplate/:lang", verifyJWT, settemplate);
router.get("/getdeflangandtemplate", verifyJWT, gettemplateandlang);

export default router;
