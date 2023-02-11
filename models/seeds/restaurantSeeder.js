const Restaurant = require("../restaurant"); // 載入 restaurant model
const restaurantList = require("../../restaurant.json").results
const db = require("../../config/mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

db.once("open", () => {
   Restaurant.create(restaurantList)
     .then(() => {
       console.log("restaurantSeeder done!");
       db.close();
     })
     .catch((err) => console.log(err));
});
