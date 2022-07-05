// import express from "express";
const express = require("express");
const router = express.Router();
// import {
//   registerController,
//   loginController,
//   userController,
//   productController,
//   categoryController,
//   orderController,
//   adminOrderController,
//   statusController,
//   profileController,
//   dashboardController,
//   challengeController,
//   notificationController,
//   messageController,
// } from "../controllers";
const {
  registerController,
  loginController,
  userController,
  productController,
  categoryController,
  orderController,
  adminOrderController,
  statusController,
  profileController,
  dashboardController,
  challengeController,
  notificationController,
  messageController,
} = require("../controllers");
const auth = require("../middlewares/auth");
const seller = require("../middlewares/seller");

const admin = require("../middlewares/admin");

//Change password
router.post("/email-send", userController.emailSend);
router.post("/code-verify", userController.codeVerify);
router.post("/change-password", userController.changePassword);

// Auth Routes
router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/logout", auth, loginController.logout);
router.get("/users", auth, userController.index);

// profile update routes
router.put("/profile/edit/name/:id", auth, profileController.editName);
router.put("/profile/edit/email/:id", auth, profileController.editEmail);
router.put("/profile/edit/phone/:id", auth, profileController.editPhone);
router.put("/profile/edit/password/:id", auth, profileController.editPassword);

// Products Routes
router.post("/products", [auth, seller], productController.store);
router.put("/products/:id", [auth, admin, seller], productController.update);
router.delete(
  "/products/:id",
  [auth, admin, seller],
  productController.destroy
);
router.get("/products", productController.index);
router.get("/products/:id", productController.show);
router.get("/products/show/:categoryId", productController.showByCategoryId);

// Category Routes
router.post("/categories", [auth, admin], categoryController.store);
router.put("/categories/:id", [auth, admin], categoryController.update);
router.delete("/categories/:id", [auth, admin], categoryController.destroy);
router.get("/categories", categoryController.index);
router.get("/categories/:id", categoryController.show);
// router.get("/category/products", categoryController.products);

// Orders Routes
router.post("/orders", [auth], orderController.store);
router.get("/customer/orders", [auth], orderController.index);
router.get("/customer/orders/:id", [auth], orderController.show);
router.get("/orders", [auth, admin], adminOrderController.index);
router.get("/records/total", [auth, admin], dashboardController.index);

// Status Route
router.post("/admin/order/status", [auth, admin], statusController.update);

// challenges Route
router.post("/challenges", [auth, admin], challengeController.store);
router.get("/challenges", [auth, admin], challengeController.index);
router.delete("/challenges/:id", [auth, admin], challengeController.destroy);

// Firesbase Push Notification Routes
router.post("/store/notif-token", auth, notificationController.store);

// Firesbase Push Notification Routes
router.get("/message/all/:roomId", auth, messageController.index);
router.post("/message/send", auth, messageController.store);

module.exports = router;
