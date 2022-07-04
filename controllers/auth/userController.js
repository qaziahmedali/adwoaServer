// import { OAuth2Client } from "google-auth-library";
const { User } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const bcrypt = require("bcrypt");

const userController = {
  async me(req, res, next) {
    try {
      const user = await User.findOne({ _id: req.user._id }).select(
        "-password -updatedAt -__v"
      );
      if (!user) {
        return next(CustomErrorHandler.notFound());
      }

      res.json(user);
    } catch (err) {
      return next(err);
    }
  },
  async codeVerify(req, res, next) {
    try {
      let data = await Otp.findOne({
        email: req.body.email,
        code: req.body.code,
      })
        .limit(1)
        .sort({ $natural: -1 });

      if (data) {
        const date = new Date();
        const currenTime = date.getTime();

        console.log("db expireIn", data.expireIn);
        const diff = data.expireIn - currenTime;

        if (diff < 0) {
          return next(CustomErrorHandler.wrongCredentials("token expired"));
        } else {
          let user;
          if (req.body.type == "verification") {
            user = {
              emailVerified: true,
            };
          }
          if (req.body.type == "forgot_password") {
            user = {
              reset_password: true,
            };
          }
          const result = await User.findOneAndUpdate(
            { email: data.email },
            user,
            { new: true }
          );

          res
            .status(201)
            .json({ message: "verified", success: "true", statusCode: 200 });
        }
      } else {
        return next(CustomErrorHandler.notFound("verification code incorrect"));
      }
    } catch (error) {
      return next(error);
    }
    // res.status(response.statusText).json(response);
  },
  async emailSend(req, res, next) {
    const response = await SendGridService.sendEmail(req.body.email, next);
    const result = {
      message: response.message,
      statusCode: 201,
      success: true,
      data: data,
    };
    res.status(201).json(result);
  },
  async changePassword(req, res, next) {
    console.log("req", req.body);
    try {
      const data = await Otp.find({
        email: req.body.email,
        code: req.body.code,
      });

      console.log("data", data);
      const response = {};

      if (data) {
        console.log("data");
        const date = new Date();
        const currenTime = date.getTime();
        console.log("time", currenTime);

        console.log("data?.forEach((v,i)=>{v?.expireIn})", data[0].expireIn);
        const diff = data[0].expireIn - currenTime;
        console.log("time", diff);
        if (diff < 0) {
          console.log("data...");
          response.message = "token expired";
          response.statusText = "error";
        } else {
          response.message = "Otp verified succcessfully";
          response.statusText = "Otp verify";
          console.log("....");
          console.log("....", req.body.password);
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const user = await User.findOneAndUpdate(
            { email: req.body.email },
            { password: hashedPassword }
          );

          // await user.save();
          console.log("user", user);
          res.status(201).json("Update Success");
          // response.message = "password change Successfully";
          // response.statusText = "Success";
        }
      } else {
        res.json("Please Correct code enter");
        // response.message = "Invalid Otp";
        // response.statusText = "error";
      }
      // res.json(response);
    } catch (error) {
      console.log(error);
      res.json("Please Correct code enter");
    }
  },

  // Get all users
  async index(req, res, next) {
    let documents;
    // pagination mongoose pagination
    try {
      documents = await User.find({ role: { $eq: "customer" } })
        .select("-updatedAt -__v -password")
        .sort({ createdAt: -1 });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    return res.json(documents);
  },
};

module.exports = userController;
