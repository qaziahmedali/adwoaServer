const { FIREBASE_TOKEN } = require("../config");
const admin = require("firebase-admin");
const serviceAccount = require("../food-app-69e18-firebase-adminsdk-24cyc-46dcb2530f.json");
const CustomErrorHandler = require("./CustomErrorHandler");
const { options } = require("joi");
const { Notif_Tokens } = require("../models");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class FirebaseService {
  static async sendNotificationToSpecificUser(next, userId, options) {
    let result;
    try {
      result = await Notif_Tokens.findOne({ customer: userId });
      if (!result) {
        return next(
          CustomErrorHandler.wrongCredentials("notif token not found")
        );
      }
      console.log("result", result);
      if (result.notif_token !== "" || result.token !== null) {
        admin
          .messaging()
          .send({
            token: result.notif_token,
            data: {
              customData: "Wegoz",
              id: "1",
              ad: "Nouman",
            },
            android: {
              notification: {
                body: options.body,
                title: options.title,
                color: "#ffffff",
                priority: "high",
                sound: "default",
                vibrateTimingsMillis: [200, 500, 800],
              },
            },
          })
          .then((msg) => {
            console.log("msg", msg);
          })
          .catch((err) => {
            return next(err);
          });
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = FirebaseService;
