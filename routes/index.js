var fs = require('fs');
var resultRep = require("./../repository/result");
var fileName = 'content.json';

/*
 * GET home page.
 */

exports.index = function(req, res){
    var callback = function(err, data){
        var content = JSON.parse(data);
        res.render('index', { content: content });
    };

    fs.readFile(fileName,callback);
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