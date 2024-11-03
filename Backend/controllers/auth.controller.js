const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//Register a new user
exports.signup = async (req, res) => {
  const { username, password, email} = req.body;
  if (!username || !password || !email) {
    res.status(400).send({
      message: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
    return;
  }

  // เตรียมข้อมูลผู้ใช้
  const newUser = {
    username: username,
    password: bcrypt.hashSync(password, 8),
    email: email,
  };

  // บันทึกผู้ใช้ในฐานข้อมูล
  await User.create(newUser)
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: { [Op.or]: req.body.roles },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({
              message: "ลงทะเบียนผู้ใช้สำเร็จ!",
            });
          });
        });
      } else {
        // กำหนดบทบาทเริ่มต้นเป็น "user" โดย id=1
        user.setRoles([1]).then(() => {
          res.send({
            message: "ลงทะเบียนผู้ใช้สำเร็จ!",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message: error.message || "เกิดข้อผิดพลาดขณะลงทะเบียนผู้ใช้ใหม่",
      });
    });
};

//Signin
exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }
  // Select * from User where username = "username";
  await User.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24h
      });

      //Select * from user_roles
      //inner join users on user.id = user_roles.Id inner
      //join roles on user_roles.roleId =roles.id
      //where user.'username'
      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while registering a new user.",
      });
    });
};