/**
 * Created by Alexander on 27.03.14.
 */
var _ = require("underscore");
var fs = require("fs");
var fileName = "result.json";
var results=[];

fs.readFile(fileName,function(err, data){
    if(err){
        return;
    }
    results = JSON.parse(data);
    console.log(results);
});

exports.addResult = function(ip, result){
    if(hasQuestion(result.question)){
        var question = getQuestion(result.question);
        if(hasIP(question, ip)){
            var respondent = getRespondentByIP(question, ip);
            respondent.option = result.option;
        }else{
            question.result.push({ip:ip, option:result.option});
        }
    }else{
        results.push({name:result.question, result:[{ip:ip, option:result.option}]});
    }
    saveToFile(results);
    console.log(results);
}

function hasQuestion(questinName){
    if(getQuestion(questinName) == null){
        return false;
    }else{
        return true;
    }
}

function getQuestion(questinName){
    for(var i = 0; i<results.length; i++){
        var question = results[i];
        if(questinName == question.name)
            return question;
    }
    return null;
}

function getRespondentByIP(question, ip){
    if(question!=null){
        for(var i = 0; i<question.result.length;i++){
            var respondent = question.result[i];
            if(ip == respondent.ip){
                return respondent;
            }
        }
    }
    return null;
};

function hasIP(question, ip){
    if(getRespondentByIP(question, ip)==null){
        return false;
    }
    return true;
};

exports.getStatistics = function(questinName){
    var findCountOption = function(result, option){
        return _.where(result, {option:option}).length
    }
    var question = getQuestion(questinName);
    if(question!=null){
        var statistics={
            total:question.result.length,
            option:[
                findCountOption(question.result, '1'),
                findCountOption(question.result, '2'),
                findCountOption(question.result, '3')
            ]
        };
        return statistics;

    }
    return null;
}

function saveToFile(json){
    fs.writeFile(fileName, JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("JSON saved to ");
        }
    });
}