const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo = require('./db');
const ObjectID = dbo.ObjectID;

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}))
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyparser.urlencoded({extended:true}));

app.get('/', async (req, res) => {
  
  let database = await dbo.getDatabase();
  const collection = database.collection('stationaryproducts');
  const cursor = collection.find({})
  let stationaryproducts = await cursor.toArray();
  
  let message = '';
  let edit_id, edit_stationaryproduct;
  
  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    edit_stationaryproduct = await collection.findOne({ _id:new ObjectID(edit_id) })
  }
  
  if (req.query.delete_id) {
    await collection.deleteOne({_id:ObjectID(req.query.delete_id)})
    return res.redirect('/?status=3');
  }
  
  switch (req.query.status) {
      case '1':
       message = 'Inserted Succesfully!';
       break;
      
      case '2':
       message = 'Updated Succesfully!';
       break;
      
      case '3':
       message = 'Deleted Succesfully!';
       break;
      
      default:
       break;
    }
  
  
  res.render('main',{message, stationaryproducts,edit_id,edit_stationaryproduct})
})

app.post('/store_stationaryproduct',async (req,res)=>{
  let database = await dbo.getDatabase();
  const collection = database.collection('stationaryproducts');
  let stationaryproduct= { name: req.body.name, quantity: req.body.quantity,price:req.body.price  };
  await collection.insertOne(stationaryproduct);
  return res.redirect('/?status=1');
})

  
