var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var UseSchema = new Schema({
    "num": Number,
    "name":String,
    "birthday": String, // 生日
    "surplus": Number, //余额
    "times": Number,  // 消费次数
    "allSurplus": Number  //消费总额
});

module.exports = mongoose.model('User',UseSchema);