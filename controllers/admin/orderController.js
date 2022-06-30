const { Order } = require("../../models");
const CustomErrorHandler = require("../../services/CustomErrorHandler");
const orderController = {
  async index(req, res, next) {
    let documents;
    console.log("admin controller");
    try {
      documents = await Order.find({ status: { $ne: "completed" } })
        .select("-updatedAt -__v")
        .sort({ createdAt: -1 })
        .populate("customerId", "-password");
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
    // console.log("orders", documents);
    return res.json(documents);
    // Order.find({ status: { $ne: "completed" } }, null, {
    //   sort: { createdAt: -1 },
    // })
    //   .populate("customerId", "-password")
    //   .exec((err, orders) => {
    //     if (req.xhr) {
    //       return res.status(200).json(orders);
    //     } else {
    //       return res.render("admin/orders");
    //     }
    //   });
  },
};

module.exports = orderController;
