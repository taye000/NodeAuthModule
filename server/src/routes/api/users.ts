import { Router } from "express";
import { signUp } from "../../controllers/users";
import { validateRequest } from "../../middleware";

const router = Router();

router.post("/signup", validateRequest, signUp);

module.exports = router;
