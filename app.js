const express = require("express");
const exphbs = require("express-handlebars");
const restaurantsData = require("./restaurant.json").results;
const mongoose = require('mongoose')
const Restaurant = require('./models/restaurant')
// 引用 body-parser
const bodyParser = require('body-parser')
const methodOverride = require("method-override");

// 引用路由器
const routes = require('./routes')

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

app.use(methodOverride("_method"));

// 將 request 導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
