var events = require('events');
var jsonData = require('./json');
var express = require('express');
// var ejs = require('ejs');
var app = express();
var mongoose = require('mongoose');
var UserModel = require('./dbmodel');


//连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/test',{ useNewUrlParser: true ,useUnifiedTopology: true});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open',function () {
    console.log('数据库连接成功');
})


app.use(express.static('views'));
app.set('views','./');

// app.engine('html',ejs_express);
app.get('/',function (req,res) {
    res.render('index',function () {
        console.log('abc')
    })
});

app.get('/registe',function (req,res) {
    var userData = req.query
    var newUser = new UserModel({
        name:userData.name,
        num:userData.phoneNum,
        birthday:userData.birthday,
        surplus:0,
        times:0,
        allSurplus:0
    })

    // UserModel.user.push(registeUser);
    newUser.save(function (err,doc) {
        if (err){
            res.send('注册失败')
        }else{
            res.send('注册成功')

        }
    })
})


app.get('/searchName',function (req,res) {
    var name = req.query.name
    UserModel.findOne({"name":name},function (err,userData) {
        if(err){
            res.send('查无此人')
        }else {
            if (typeof userData == 'object'){
                res.send(userData)
                console.log('searchName',userData)
            }else {
                res.send('查无此人')
            }
        }
    })
});

//      充值操作
app.get('/Invest',function (req,res) {
    var dataNum = req.query

    UserModel.findOne({"num":Number(dataNum.telNum)},function (err,userData) {
        console.log(userData._doc)
        if(err){
            res.send('充值失败')
        }else {
            var surplus = Number(userData._doc.surplus) + Number(dataNum.invest)
            UserModel.updateOne({"num":Number(dataNum.telNum)},{"surplus":surplus},function (err1,doc) {
                if (err1){
                    res.send('充值失败')
                }else {
                    res.send(doc)
                }
            })
        }
    })

})

//      消费操作
app.get('/Consume',function (req,res) {
    var dataNum = req.query;
    UserModel.findOne({"num":dataNum.telNum},function (err,userData) {
        console.log("Consume: " + userData)
        if(err){
            res.send('扣费失败')
        }else {
            var surplus = userData._doc.surplus;
            surplus -= dataNum.consumeNum;
            if (surplus < 0){
                res.send('余额不足，扣费失败！');
                return ;
            }
            var update = {
                "surplus": Number(userData._doc.surplus) - Number(dataNum.consumeNum),
                "times": Number(userData._doc.times) + 1,
                "allSurplus": Number(userData._doc.allSurplus) + Number(dataNum.consumeNum)
            }
            UserModel.updateOne({"num":Number(dataNum.telNum)},update,function (err1,doc) {
                if (err1){
                    res.send('扣费失败')
                }else {
                    res.send(doc)
                }
            })

        }
    })
})

app.get('/searchNum',function (req,res) {
    var num = req.query.num
    UserModel.findOne({"num":num},function (err,userData) {
        if(err){
            res.send('查无此人')
        }else {
            if (typeof userData == 'object'){
                res.send(userData)
                console.log('searchName',userData)
            }else {
                res.send('查无此人')
            }

        }
    })

})

app.get('/readyData',function (req,res) {
   UserModel.find({},function (err,data) {
       if (err){
           res.send('暂无会员')
       }else {
           console.log('readyData: ' + data)
           res.send(data)
       }
   })


})



app.listen(3000);


