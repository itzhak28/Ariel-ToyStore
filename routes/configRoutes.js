const toysR = require("./toys");
const usersR = require("./users");

exports.routesInit = (app) => {
  app.use("/toys", toysR);
  app.use("/users", usersR);
};
