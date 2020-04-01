const express = require("express");
const CONFIG = require("./config/config");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const BodyParser = require("body-parser");
const app = require("passport");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const urlShorter = require("./routes/shortUrl");
const urlRoute = require("./routes/url");

const app = express();

app.use(logger("dev"));
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(passport.initialize());

let expiryDate = new Date(Date.now() + 60 * 60 * 1000);
app.use(
  cookieSession({
    name: "session",
    keys: ["key 1"],
    cookie: {
      path: "/",
      expires: expiryDate
    }
  })
);
// app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/urlshort", urlShorter);
app.use("./url", urlRoute);

const models = require("./models");

models.sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to SQL database:", CONFIG.db_name);
  })
  .catch(err => {
    console.error("Unable to connect to SQL database:", CONFIG.db_name, err);
  });

if (CONFIG.app === "dev") {
  //creates table if they do not already exist
  models.sequelize.sync();

  //deletes all tables then recreates them useful for testing and development purposes
  //models.sequelize.sync({ force: true });
}

// Main page rendering
app.get("/", (req, res) => {
  let user_id = req.session.user_id;

  if (user_id) {
    res.redirect("/urls");
  } else {
    res.status(200).send("Home Page");
  }
});

app.listen(CONFIG.port, () => {
  console.log(
    `Server running on port ${CONFIG.port}.... is there anybody out there?`
  );
});

module.exports = app;
