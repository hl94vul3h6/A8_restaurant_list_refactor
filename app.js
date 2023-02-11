const express = require("express");
const exphbs = require("express-handlebars");
const restaurantsData = require("./restaurant.json").results;
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
// 引用 body-parser
const bodyParser = require('body-parser')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express();
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 3000;

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine("hbs", exphbs({ defaultLayout: "main", extname: '.hbs' }));
app.set("view engine", "hbs");

app.use(express.static("public"));

// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  Restaurant.find() // 取出 Restaurant model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then((restaurantsData) => res.render("index", { restaurantsData })) // 將資料傳給 index 樣板
    .catch((error) => console.error(error)); 
});

app.get("/restaurants/new", (req, res) => {
  return res.render("new");
});

app.post("/restaurants", (req, res) => {
  Restaurant.create(req.body) // 存入資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log(error));
});

app.get("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("edit", { restaurantData }))
    .catch((err) => console.log(err));
});

app.post("/restaurants/:restaurantId/edit", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndUpdate(restaurantId, req.body)
    .then(() => res.redirect(`/`))
    .catch((err) => console.log(err));
});

app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    return res.redirect("/");
  }
  
  const keywords = req.query.keywords;
  const keyword = req.query.keywords.trim().toLowerCase();
  
  Restaurant.find({})
    .lean()
    .then((restaurantsData) => {
      const filterRestaurantsData = restaurantsData.filter(
        (data) =>
          data.name.toLowerCase().includes(keyword) ||
          data.category.includes(keyword)
      );
      res.render("index", { restaurantsData: filterRestaurantsData, keywords });
    })
    .catch((err) => console.log(err));
});

app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findById(restaurantId)
    .lean()
    .then((restaurantData) => res.render("show", { restaurantData }))
    .catch((err) => console.log(err));
});

app.post("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  Restaurant.findByIdAndDelete(restaurantId)
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
