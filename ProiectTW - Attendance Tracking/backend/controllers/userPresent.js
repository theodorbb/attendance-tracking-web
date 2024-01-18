const userPresentDB = require("../models").userPresent;
const userDB = require("../models").users;
const eventDB = require("../models").event;

const controller = {
  addUserEvent: async (req, res) => {
    try {
      const { userId, eventId } = req.body;

      const user = await userDB.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(500).send({
          message: "Don't find the user!",
        });
      } else {
        const event = await eventDB.findOne({
          where: {
            id: eventId,
          },
        });

        if (!event) {
          return res.status(500).send({
            message: "Don't find the event!",
          });
        } else {
          const addUserPresent = await userPresentDB.create({
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            phone: user.phone,
            EventId: event.id,
          });
          res.status(201).send(addUserPresent);
        }
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Server error to addUserPresent!",
      });
    }
  },
  getUsersEvent: async (req, res) => {
    try {
      const getUserPresent = await userPresentDB.findAll();
      res.status(200).send(getUserPresent);
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Server error to getUsersPresent!",
      });
    }
  },
};

module.exports = controller;
