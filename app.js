const express = require("express");
const exphbs = require("express-handlebars");
// 引用 body-parser
const bodyParser = require('body-parser')
const methodOverride = require("method-override");

// 引用路由器
const routes = require('./routes')

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

require("./config/mongoose"); // need to below line 10

const app = express();
const port = 3000;

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
