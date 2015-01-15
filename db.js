var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId; 

var uri = "mongodb://localhost/addressbook";

mongoose.connect(uri,function(err,succ){
    if(err)
        console.log("Error: " + err);    
    else
        console.log("Connected to: " + uri);
});

var user = new mongoose.Schema({
    name:{type:String,index:{unique:true}},
    password:String,
    email:String,
    addresses:[]
});

var User = mongoose.model("User", user);


exports.getUser = function(req,res){
    if(typeof req.session.login == 'undefined'){
        var username = req.body.username;
        var password = req.body.password;
        User.find({name: username, password: password}, function(err,data){
            console.log(data);
            if(err)
                res.render('error', {message:'Failed', error:err});
            if(data.length > 0) {   // Found user in database                   
                var data = data[0];
                req.session.login = true;
                req.session.name = data.name;
                //res.status(301);
                //res.setHeader('location', 'http://127.0.0.1:3000/names');
                res.render('names', {user:data, hasAddresses:data.addresses.length ===  0 ? false : true}); 
            }    
            else { // user not found
                console.log('Wrong username/password');              
                res.render('index', {error:'Wrong username/password'});
            }
        });
    }
    else{
        getNames(req,res);
    }
}

exports.getNames = function(req,res){
    if (typeof req.session.name == 'undefined') res.redirect('/');
    else {
        User.find(req.session.name, function(err,data){
            if(err)
                res.render('error', {message:'Failed', error:err});
            if(data.length > 0) {                   
                var data = data[0];
                res.render('names', {user:data}); 
            }    
            else { 
                res.render('error', {message:'error', error:{}});
            }
        }); 
    }
}

exports.registerUser = function(req,res){  
        
    var temp = new User({
        name:req.body.username,
        password:req.body.password,
        email:req.body.email,
        addresses:[]
    });

    console.log(temp);
  
    temp.save(function(err){
        if(err)
            res.render('error', {message:'prkl', error:err});
        else {
            req.session.login = true;
            req.session.id = temp._id;
            res.render('names', {user:temp, hasAddresses:temp.addresses.length ===  0 ? false : true});
//            res.status(301);
//            res.setHeader('location', 'http://127.0.0.1:3000');
//            res.send();
        }
    });
}

exports.saveAddress = function(req,res){
    console.log(req.body);
    if(typeof req.session.login == 'undefined') res.redirect('/');
    else{
        User.find({name: req.session.name}, function(err,data){
            if(err)
                res.render('error', {message:'Failed', error:err});
            if(data.length > 0) {                   
                var data = data[0];
                
                var address = {name: req.body.name, address: req.body.address,
                               email: req.body.email, phone: req.body.phone,
                               birthday: req.body.birthday, info: req.body.info};
                data.addresses.push(address);
                console.log(data);
                User.update(data, function(){});
                res.render('names', {user:data, hasAddresses:data.addresses.length ===  0 ? false : true}); 
            }    
            else { 
                res.render('error', {message:'error', error:{}});
            }
        });
    } 
}