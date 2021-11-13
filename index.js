var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { response } = require("express");


var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

//connection to mongo
const toDo = require("./models/todo.model");
const mongoDB = "mongodb+srv://admin:admin@cluster0.m1lxx.mongodb.net/ToDo?retryWrites=true&w=majority";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo DB connection Error:  "))
//connection to mongo

var tasks = ["whats up", "task 2", "brs"];
var completed = [];


app.get("/", function(request, response)
{
    toDo.find(function(error, todo)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            tasks = [];
            completed = [];
            for(let i = 0; i < todo.length; i++)
            {
                if(todo[i].done)
                {
                    completed.push(todo[i]);
                }
                else
                {
                    tasks.push(todo[i]);
                }
            }
            response.render("index", {tasks: tasks, completed: completed});
        }
    });
    //response.render("index", {tasks: tasks, completed: completed});
});

app.post("/addToDo", function(req, res)
{
    let newToDo = new toDo
    ({
        item: req.body.newtoDo,
        done: false
    })
    newToDo.save(function(error, toDo)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.redirect("/");
        }
    })
    //tasks.push(req.body.newtoDo);

})
app.post("/removeToDo", function(req,res){
    const remove = req.body.check;
    if(typeof remove === "string")
    {
        toDo.updateOne({_id: remove}, {done:true}, function(error)
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.redirect("/");
            }
        })
    }
    else if(typeof remove === "object")
    {
        for(var j=0; j < remove.length; j++)
        {
            toDo.updateOne({_id: remove[j]}, {done:true}, function(error)
            {
                if(error)
                {
                    console.log(error);
                }
            })
        }
        res.redirect("/");
    }

})
app.post("/deleteToDo", function(req,res){
    const deleteTask = req.body.delete;
    if(typeof deleteTask === "string")
    {
        toDo.deleteOne({_id: deleteTask}, function(error)
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.redirect("/");
            }
        })
    }
    else if(typeof deleteTask === "object")
    {
        for(var j=0; j < deleteTask.length; j++)
        {
            toDo.deleteOne({_id: deleteTask[j]}, function(error)
            {
                if(error)
                {
                    console.log(error);
                }
            })
        }
        res.redirect('/');
    }
})
app.listen(3000, function(){
    console.log("App is running on port 3000");
});
