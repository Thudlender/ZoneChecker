

//Register a new user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  //Prepare user data
  const newUser = {
    username: username,
    email: email,
    UserPassword: bcrypt.hashSync(password, 11),
  };

  //Save user in the database
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
              message: "User register successfully!",
            });
          });
        });
      } else {
        //set default role to "user" id=1
        user.setRoles([1]).then(() => {
          res.send({
            message: "User register successfully!",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while registering a new user.",
      });
    });
};

//Signin
exports.signin = async (req, res) => {
  //TODO
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  await User.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.UserPassword);
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid password!",
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24h
      });

      //Select * From user_roles inner join users on user.id = user_roles.userId inner join roles on user_roles.roleId = roles.id
      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].roleName.toUppercase());
        }
        res.status(200).send({
          id: user.id,
          username: user.name,
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
