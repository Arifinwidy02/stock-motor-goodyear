const express = require("express");
const router = express.Router(); // Create a Router instance

const Controller = require("../controller");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Stock Motor Goodyear API" });
});
router.get("/dashboard", Controller.motors);
router.get("/dashboard/repair", Controller.allRepair);
router.get("/dashboard/status", Controller.allStatus);
router.get("/dashboard/:id", Controller.findMotorById);
router.put("/dashboard/:id", Controller.editMotor);
router.post("/", Controller.registerMotor);
router.patch("/", Controller.changeStatus);
router.patch("/hidden/:id", Controller.isHiddenMotor);

module.exports = router;
