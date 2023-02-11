const express = require("express");
const router = express.Router();
const Restaurant = require("../../models/restaurant");


router.get("/new", (req, res) => {
  return res.render("new");
});

router.post("/", (req, res) => {
  Restaurant.create(req.body) // 存入資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log(error));
});

router.get("/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((err) => console.log(err));
});

router.put("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/restaurants/${restaurantId}`))
    .catch((err) => console.log(err));
});

router.get("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("show", { restaurantData }))
    .catch((err) => console.log(err));
});

router.delete("/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;