const { configMail } = require("../config/config.js");
const { generateOTP } = require("../middleware/middleware.js");
const Users = require("../models/users.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    let { username, email, password, confirmPass, isAdmin } = req.body,
      payload,
      userExist,
      matchPass,
      hashedPass,
      otp,
      link;

    userExist = await Users.findOne({ email: email });

    if (userExist) {
      return res.send({ status: 0, response: "User already exist" });
    } else {
      matchPass = password === confirmPass;
      if (matchPass) {
        otp = generateOTP();
        hashedPass = await bcrypt.hash(password, 10);
        payload = await Users.create({
          username: username,
          email: email,
          password: hashedPass,
          otp: otp,
          isAdmin: isAdmin,
          pdf:pdfFile
        });

        if (payload) {
          link = `http://localhost:5001/users/verify/${payload._id}`;

          mailOptions = {
            from: configMail.fromSmtp,
            to: payload.email,
            subject: "Verification OTP",
            html: `<b>Your otp:<strong>${payload.otp}</strong>,<br> Click here to verify :\n<a href=${link}>clickhere</small></p>`,
          };

          configMail.setUp.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res.send({ status: 0, response: "Can't send OTP" });
            } else {
              return res.send({
                status: 1,
                response: `Verification email send to ${payload.email}`,
                Link: link,
              });
            }
          });
        } else {
          return res.send({ status: 0, response: "can't send otp" });
        }
      } else {
        return res.send({ status: 0, response: "Password doesn't match" });
      }
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const verifyUsers = async (req, res) => {
  let { id } = req.params;
  let { OTP } = req.body,
    checkIfExist;
  try {
    checkIfExist = await Users.findById({ _id: id });

    if (!checkIfExist) {
      return res.send({ status: 0, response: "user not found" });
    } else if (checkIfExist.verify === true) {
      return res.send({ status: 0, response: "Your already verified" });
    } else {
      if (checkIfExist.otp === OTP) {
        await Users.findByIdAndUpdate({ _id: id }, { $set: { verify: true } });
        return res.send({ status: 1, response: "User verified" });
      } else {
        return res.send({ status: 0, response: "OTP doesn't match" });
      }
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

const loginUser = async (req, res) => {
  let { email, password } = req.body,
    userExist,
    matchPass,
    checkVerified,
    accessToken;
  try {
    userExist = await Users.findOne({ email: email });
    if (!userExist) {
      return res.send({
        status: 0,
        response: "User not exist",
      });
    }
    matchPass = await bcrypt.compare(password, userExist.password);

    checkVerified = userExist.verify == true;
    if (!matchPass) {
      return res.send({ status: 0, response: "Password doesn't match" });
    } else if (!checkVerified) {
      return res.send({
        status: 0,
        response: "You need to be verified in order to login",
      });
    } else {
      accessToken = jwt.sign(
        { user: { _id: userExist._id, email: userExist.email, admin: userExist.isAdmin } },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );
      res.send({
        status: 1,
        response: "Token generated",
        token: accessToken,
      });
    }
  } catch (error) {
    return res.send({ status: 0, response: error.message });
  }
};

module.exports = { registerUser, verifyUsers, loginUser };
