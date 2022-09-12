const express=require('express');
const app = express();
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

const toDoList=[];
const workList=[];

app.get("/", (req, res)=>{
  const date=new Date();
  const options={weekday:"long", month:"long", year:"numeric"};
  const dateToBeDisplayed=date.toLocaleDateString("en-GB", options);
  res.render("index", {dateBeingDisplayed:dateToBeDisplayed, newItemAdded:toDoList});
});

app.post("/", (req, res)=>{
  const itemAdded=req.body.workAdded;
  toDoList.push(itemAdded);
  res.redirect("/");
});

app.listen(process.env.PORT||3000, ()=>{
  console.log("server running...");
});
