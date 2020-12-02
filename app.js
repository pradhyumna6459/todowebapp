const express=require('express');
const app=express();
const mongoose = require('mongoose');
const _=require('lodash');
app.set('view engine', 'ejs');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
mongoose.connect('mongodb+srv://pradhyumna6459:Rathore@123@cluster0.uarwv.mongodb.net/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    }
});
const Item=new mongoose.model("Item",itemschema);
const item1=new Item(
    {
        name:"welcome to your Todo list"
    }
);
const item2=new Item(
    {
        name:"click + to add"
    }
);
const item3=new Item(
    {
        name:"click checkbox to delete "
    }
);
const defaultlist=[item1,item2,item3]
const listschema=new mongoose.Schema({

    name:String,
    items:[itemschema]
});
const List=new mongoose.model("List",listschema);

let port=process.env.PORT;
if(port==null|| port=="")
{
port=3000;

}


app.listen(port,function(req,res)
{
console.log("We are at port 3000");
});

app.get('/:customlistname',function(req,res)
{
    const customlistname=_.capitalize(req.params.customlistname);
    List.findOne({name:customlistname},function(err,foundOne)
    {
        if(!foundOne)
        {
            const list=new List(
                {
                    name:customlistname,
                    items:defaultlist
                }
            );
            list.save();
            res.redirect('/'+customlistname);
        }
        else
        {
            res.render('list',{listtitle:customlistname,items:foundOne.items});
        }

    });

});
app.get('/',function(req,res)
{
    Item.find({},function(err,items)
    {
        if (items.length==0)
        {
            Item.insertMany(defaultlist,function(err)
            {
                if (err)
                {
                    console.log(err);
                }
                else{
                    console.log("success");
                }
            });
            res.redirect('/');
        }
        else{
            res.render('list',{listtitle:"Today",items:items});
        //console.log(items);
        }
    });
    
});
app.post("/",function(req,res)
{
    var item1=req.body.add;
    var listname=req.body.list;
    const item=new Item(
        {
            name:item1
        }
    );
    if (listname=="Today")
    {
    item.save();
    res.redirect('/');
    }
    else
    {
      List.findOne({name:listname},function(err,foundList)
      {
          if(foundList)
          {
              foundList.items.push(item);
              foundList.save();
          }

      }) ;
      res.redirect('/'+listname);
    }

});
app.post("/delete",function(req,res)
{
    const id=req.body.checkbox;
    const listname=req.body.listname;
    //console.log(listname);
    if (listname=="Today")
    {
    Item.findByIdAndRemove({_id:id},function(err)
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });
    
    }
    else
    {
        List.findOneAndUpdate({name:listname},{$pull:{items:{_id:id}}},function(err,results)
        {
            if(!err)
            {
                res.redirect('/'+listname);
            }
        });
    }

});
app.post('/nav',function(req,res)
{
    const name1=req.body.add;
    const name=_.capitalize(name1);
    List.findOne({name:name},function(err,foundOne)
    {
        if(!foundOne)
        {
            const list=new List(
                {
                    name:name,
                    items:defaultlist
                }
            );
            list.save();
            res.redirect('/'+name);
        }
        else
        {
            res.render('list',{listtitle:name,items:foundOne.items});
        }

    });

})