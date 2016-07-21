var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var fileSystem = require("../../../fileSystem.js");


//Renders a partial according  to the two parameters: the topic (locates the related content in the file system), and the type (gets the correct type of files from the containing folder)
function getStuff(subject, topic , type){
    var folder = path.join(rootpath, '/client/assets/files', subject, topic, '/', type);
    var results = fs.readdirSync(folder);
    var data = [];
    for (var i in results){
        data.push(results[i].substring(0, results[i].length - 4));
    }
    var partial = rootpath + '/client/assets/html/partials/'+  type + '.ejs';
    var compiled = ejs.compile(fs.readFileSync(partial, 'utf8'));
    var html = compiled({data:data});

    return html;
}

//renders the introduction partial
function getIntro(subject, topic){
    var template = rootpath + '/client/assets/files/' + subject + '/' + topic + '/' + topic;
    return ejs.render(template);
}


module.exports = {
//Renders dynamic content of the target folder, including introduction, videos, powerpoints, and assignments using a template for each of these partials
    renderContent: function(req, res){
        var message;
        if (req.params.id == "csharp"){
            message = "Welcome to C#!";    
        }
        else{
            message = "Welcome to " + req.params.id + "!";
        }
        
        var intro = getIntro(req.params.subject, req.params.id);
        var videos = getStuff(req.params.subject, req.params.id, "videos"); 
        var presentations = getStuff(req.params.subject, req.params.id, "presentations");
        var assignments = getStuff(req.params.subject, req.params.id, "assignments");
        console.log("Rendered templates:", videos, presentations);
        res.render(rootpath + '/client/assets/html/content', {
            inSubject : true,
            subjectName : req.params.subject,
            subTopic : req.params.id,
            fileSystem : fileSystem,
            welcomeMessage: message,
        content: {
            introduction: intro,
            presentations: presentations,
            videos: videos,
            assignments: assignments
            },
        });
    },

}
