import { Message } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import FirebaseService from "../services/FirebaseService";

const messageController = {
  async store(req, res, next) {
    // const { token } = req.body;
    // // check if notif_token exist in database already
    // try {
    //   const exist = await Notif_Tokens.exists({ notif_token: token });
    //   if (exist) {
    //     return next(
    //       FirebaseService.sendNotificationToSpecificUser(next, req.user._id, {
    //         title: "Wegoz App",
    //         body: "Toke found for this app",
    //       })
    //     );
    //   }
    //   await Notif_Tokens.create({
    //     customer: req.user._id,
    //     notif_token: token,
    //   });
    //   res.status(201).json({ message: "token stored" });
    // } catch (err) {
    //   return next(err);
    // }
    console.log("req.user", req.user._id);
    console.log("req.body.rid", req.body.receiverId);
    try {
      //   const room = await Room.find({
      //     $and: [{ senderId: req.user._id }, { receiverId: req.body.rid }],
      //   });
      //   console.log("room object", room);
      //   var reqBodyId = mongoose.Types.ObjectId(req.body.rid);
      //   const userNAme = await User.findById({
      //     _id: reqBodyId,
      //   });

      // if (userName === null) {
      //   const userNAme = await Admin.findById({
      //     _id: reqBodyId,
      //   });
      // }

      //   console.log("here is reqBODY ID IN object ID ===>>>> ", userNAme);

      // console.log("Rooom", room[0]);

      // console.log("here is userNAme ===>>>> ", userNAme);
      // var newRoom = await new Room({
      //   senderId: req.user,
      //   senderName: req.body.senderName,
      //   receiverName: `${userNAme.fname} ${userNAme.lname}`,
      //   receiverId: req.body.rid,
      //   lastMessage: req.body.mes,
      //   status: "unread",
      //   click: false,
      // }).save();
      // roomId = newRoom._id;
      const result = await new Message({
        roomId: req.body.roomId,
        senderId: req.user._id,
        receiverId: req.body.receiverId,
        senderName: req.body.senderName,
        receiverName: req.body.receiverName,
        mes: req.body.mes,
        status: "unread",
      }).save();

      // const updatePassword = await Room.findByIdAndUpdate(
      //   { _id: roomId },
      //   {
      //     lastMessage: req.body.mes,
      //   }
      // );
      console.log("updated last seen message", result);
      //res.status(200).json({ error: "No Record Found" });
      //   }

      return res
        .status(200)
        .json({ message: "Message sent successfully..", result });
    } catch (err) {
      console.log(err);
      console.log("Any error in saving message");
      //res.status(200).json({ error: "user not found" });
    }
  },

  // Get all messages
  async index(req, res, next) {
    // let documents;
    // // pagination mongoose pagination
    // try {
    //   documents = await Category.find()
    //     .select("-updatedAt -__v")
    //     .sort({ createdAt: -1 });
    // } catch (err) {
    //   return next(CustomErrorHandler.serverError());
    // }
    // return res.json(documents);
    try {
      const messages = await Message.find({
        roomId: req.params.roomId,
      });

      if (messages[0] == null) {
        console.log("message not found");
        res.status(200).json({ error: "No Record Found" });
      } else {
        return res.status(200).json({ messages });
      }
    } catch (err) {
      console.log(err);
      console.log("user not found");
      res.status(200).json({ error: "user not found" });
    }
  },
};

export default messageController;
