// import { OAuth2Client } from "google-auth-library";
const { User } = require("../../models");
const { OAuth2Client } = require("google-auth-library");

const sgMail = require("@sendgrid/mail");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
// import CustomErrorHandler from "../../services/CustomErrorHandler";
const Otp = require("../../models/otp");
const bcrypt = require("bcrypt");
const API_KEY =
  "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";
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
  async codeVerify(req, res) {
    try {
      console.log(req.body);
      let data = await Otp.findOne({
        email: req.body.email,
        code: req.body.code,
      });
      console.log(data);
      res.status(201).json(data);
      // response.message = "Otp verify succcessfully";
      // response.statusText = "Otp verify";
    } catch (error) {
      console.log(error);
      res.status(401).json(error);
      // response.message = "Otp wrong";
      // response.statusText = "Otp not found";
    }
    // res.status(response.statusText).json(response);
  },
  async emailSend(req, res, next) {
    console.log(req.body);
    let data = await User.findOne({ email: req.body.email });
    console.log(data);
    const responseType = {};
    if (data) {
      const otpCode = Math.floor(1000 + Math.random() * 9000);
      const otpData = new Otp({
        email: req.body.email,
        code: otpCode,
        expireIn: new Date().getTime() + 300 * 10000,
      });
      const otpResponse = await otpData.save();
      responseType.statusText = "Success";
      mailer(otpResponse.email, otpResponse.code);
      responseType.message = "Please check your email";
    } else {
      responseType.statusText = "error";
      responseType.message = "Email Id not exist";
    }
    res.status(200).json(responseType);
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

function mailer(email, otp) {
  console.log("email....", email);
  console.log("emailotp....", otp);
  try {
    // const accessToken = await OAuth2Client.getAccessToken();
    // const transport = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",

    //     auth: {
    //       type: "OAuth2",
    //       user: "ameenhamza392@gmail.com",
    //       clientId:
    //         "31003588638-cpdkrb3906qbqcs8oqfjtl5o0pi1d16q.apps.googleusercontent.com",

    //       clientSecret: "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",
    //       refreshToken:
    //         "1//04sJs1EakH9tRCgYIARAAGAQSNwF-L9IrOQ91hKZ9vdTtOHbmy6DkmbeF0uGG6UScI8CLif5xQL3YBRX94QEuUXd44ya5_v7s340",
    //       accessToken:
    //         "ya29.A0ARrdaM-D_4GlxNBKF1m56Ocm3asBP8ay1FMW6vOBXnWvLVH88KIVwA66B3Sn_Lva06Y1Zgy41vhUuC6QaCOr_Eg9ARVjfmQrq60hPXRZGiQxEEscwRNIJPa1NtBeKY8olOv1UIZMF1w1JOfXuJO0VnWf23hT",
    //     },
    //   },
    // });

    // var nodemailer = require("nodemailer");

    // var transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     type: "OAuth2",
    //     clientId: "000000000000-xxx.apps.googleusercontent.com",
    //     clientSecret: "XxxxxXXxX0xxxxxxxx0XXxX0",
    // },
    //   user: "ameenhamza392@gmail.com",
    //   clientId:
    //     "31003588638-cpdkrb3906qbqcs8oqfjtl5o0pi1d16q.apps.googleusercontent.com",
    //   clientSecret: "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",
    //   refreshToken:
    //     "1//04sJs1EakH9tRCgYIARAAGAQSNwF-L9IrOQ91hKZ9vdTtOHbmy6DkmbeF0uGG6UScI8CLif5xQL3YBRX94QEuUXd44ya5_v7s340",
    // },
    // });
    console.log(".....");
    const resp = sgMail.setApiKey(API_KEY);
    console.log("resp", resp);
    const message = {
      from: "hamzaameen8079@gmail.com",
      to: { email },
      subject: "OTP Genrate from Wegoze food App",
      text: `Your verification code is ${otp} from wegoze food`,
      html: `<p>Your verification code is  <h4> ${otp} </h4> for wegoze food App </p>`,
    };
    console.log("message", message);
    sgMail
      .send(message)
      .then((res) => console.log("Email Send Successfully...", res))
      .catch((error) => console.log("erro", error.message));
  } catch (error) {
    console.log("error", error);
  }
}
// sendMail().then((result) => console.log("Email send...", result));
module.exports = userController;
