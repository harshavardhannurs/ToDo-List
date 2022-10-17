const express=require('express');
const app = express();
const bodyParser=require('body-parser');
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

// const toDoList=["Go shopping", "Cook food", "Go to gym"];
// const workList=[];

mongoose.connect("mongodb+srv://admin-Harsha:test123@cluster0.ywdirbw.mongodb.net/todolistDB", {useNewUrlParser:true});

const itemsSchema = new mongoose.Schema({
  name:String
});

const Item = mongoose.model("Item", itemsSchema);

const item1  = new Item({
  name:"Go shopping"
});
const item2  = new Item({
  name:"Cook food"
});
const item3  = new Item({
  name:"Hit gym"
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
  name:String,
  items:[itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res)=>{
  Item.find({},function(err, foundItems){ //find returns an array of documents
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){console.log(err);}else{console.log("Added successfully");}
      });
      res.redirect("/");
    }else{
    res.render("index", {dateBeingDisplayed:"Today", newItemAdded:foundItems});
    }
  });
});

app.get("/:customListName", (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);//capitalize() only
   //changes the first letter to uppercase
  List.findOne({name:customListName},function(err, foundList){//findOne returns a single object
    if(!err){
      if(!foundList){
        //create a new list
        const newList = new List({
          name:customListName,
          items: defaultItems
        });
        newList.save();
        res.redirect("/"+customListName);
      }else{
        //Show an existing list
        res.render("index", {dateBeingDisplayed:foundList.name, newItemAdded:foundList.items})
      }
    }
  });
});

app.post("/", (req, res)=>{
  // console.log(req.body);
  const itemAdded=req.body.workAdded;
  const listName = req.body.listType;
  // console.log(listName);
  const newItem = new Item({
    name:itemAdded
  });
  if(listName == "Today"){
    newItem.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName}, function(err, foundList){
      foundList.items.push(newItem);
      foundList.save();
    });
    res.redirect("/"+listName);
  }
});

app.post("/delete", (req, res)=>{
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if(listName == "Today"){
    Item.findByIdAndRemove(checkedItemID, (err)=>{
      if(err){console.log(err);}else{"Deleted ok"}
      res.redirect("/");
    });
  }else{
    List.findOneAndUpdate({name:listName}, {$pull:{items:{_id:checkedItemID}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+listName)
      }
    })
  }
});

app.listen(process.env.PORT||3000, ()=>{
  console.log("server running...");
});
