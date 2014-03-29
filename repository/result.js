/**
 * Created by Alexander on 27.03.14.
 */
var _ = require("underscore");
var fs = require("fs");
var fileNameResul = "result.json";
var fileNameMessages = "messages.json";
var fileNameContent = 'content.json';
var results=[];
var messages = [];

fs.readFile(fileNameResul,function(err, data){
    if(err){
        return;
    }
    results = JSON.parse(data);
});
fs.readFile(fileNameMessages, function(err, data){
    if(err){
        return;
    }
    messages = JSON.parse(data);
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
    saveToFile(results, fileNameResul);
};

function hasQuestion(questinName){
    return getQuestion(questinName) != null;
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
}
function hasIP(question, ip){
    return getRespondentByIP(question, ip) != null;

}
exports.getStatistics = function (questinName) {
    var findCountOption = function (result, option) {
        return _.where(result, {option: option}).length
    };
    var question = getQuestion(questinName);
    if (question != null) {
        return {
            total: question.result.length,
            option: [
                findCountOption(question.result, '1'),
                findCountOption(question.result, '2'),
                findCountOption(question.result, '3')
            ]
        };

    }
    return null;
};

function saveToFile(json , fileName){
    fs.writeFile(fileName, JSON.stringify(json, null, 4), function(err) {
        if(err) {
            console.log(err);
        } else {
            //console.log("JSON saved to " + fileName);
        }
    });
}

exports.saveMessage = function(message){
    messages.push(message);
    saveToFile(messages, fileNameMessages);
};
exports.getMessages = function (){
    return messages;
};

exports.getContent = function (callback){
    fs.readFile(fileNameContent,function(err, data){
        var content = JSON.parse(data);

        _.each(content.questions, function(element){
            var localResults = _.where(results, {name:element.name});
            if(localResults.length>0)
                element.total = localResults[0].result.length;
            else
                return;

            _.each(element.options,function(option){
                if(element.total!=0){
                    option.votes = _.where(localResults[0].result,{option:option.id}).length;
                }
                else
                    option.votes = 0;

            });

        });
        callback(content);
    });
};