
var resultRep = require("./../repository/result");

/*
 * GET home page.
 */

exports.index = function(req, res){
    var messages = resultRep.getMessages();
    var callback = function(data){
        res.render('index', { content: data, extend: false, messages:messages});
    };
    resultRep.getContent(callback);
//    fs.readFile(fileName,callback);
};

exports.indexExtends = function(req,res){
    var messages = resultRep.getMessages();
    var callback = function(data){
        res.render('index', { content: data, extend: true, messages:messages});
    };
    resultRep.getContent(callback);
//    fs.readFile(fileName,callback);
};

exports.result = function(req,res){
    console.log(req.body);
    console.log(req.ip);
    var result={
        option: req.body.option,
        question: req.body.question
    };
    resultRep.addResult(req.ip, result);
    res.send({result:resultRep.getStatistics(result.question)});
};

exports.sendMessage = function(req, res){
    console.log(req.body);
    res.send(req.body);

    resultRep.saveMessage(req.body);
};