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
  console.log(req.body);
  const itemAdded=req.body.workAdded;
  if(req.body.listType==='Work'){
    workList.push(itemAdded);
    res.redirect("/work");
  }else{
  toDoList.push(itemAdded);
  res.redirect("/");
  }
});

app.get("/work", (req, res)=>{
  res.render("index", {dateBeingDisplayed:"Work List", newItemAdded:workList});
});

app.listen(process.env.PORT||3000, ()=>{
  console.log("server running...");
});
