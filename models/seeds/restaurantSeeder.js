const Restaurant = require("../restaurant"); // 載入 restaurant model
const restaurantList = require("../../restaurant.json").results


if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const db = require("../../config/mongoose"); // need to below line 5

db.once("open", () => {
  console.log("running restaurantSeeder script...");
   Restaurant.create(restaurantList)
     .then(() => {
       console.log("restaurantSeeder done!");
       db.close();
     })
     .catch((err) => console.log(err));
});
