const { Order } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const FirebaseService = require("../../services/FirebaseService");

const statusController = {
  async update(req, res, next) {
    console.log("req.body", req.body);
    let user = await Order.findOne({ _id: req.body.orderId });
    console.log("user", user);
    await Order.updateOne(
      { _id: req.body.orderId },
      { status: req.body.status },
      (err, data) => {
        if (err) {
          return next(CustomErrorHandler.serverError());
        }
        console.log("result data", data);
        // Emit event
        const eventEmitter = req.app.get("eventEmitter");
        eventEmitter.emit("orderUpdated", {
          id: req.body.orderId,
          status: req.body.status,
        });
        if (req.body.message !== "undefined") {
          FirebaseService.sendNotificationToSpecificUser(
            next,
            user.customerId,
            {
              title: "Wegoz App",
              body: req.body.message,
            }
          );
        }
        res.status(201).json({ message: "status updated" });
      }
    );
  },
};

module.exports = statusController;
