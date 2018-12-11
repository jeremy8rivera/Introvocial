var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var database = require('./server.js');
var bannedList = require('./bannedWords.js');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

userArray = [];
userID = '';

app.get('/app/:username', function(req, res){
	res.render('chatLobby', {name: req.params.username});
	userID = req.params.username;
})

io.on('connection', function(socket){
	io.emit('chat message', userID + ' has joined the channel');

	socket.on('chat message', function(msg){
		let d = new Date();

		if(bannedList.msgCheck(msg) != true)
		io.emit('chat message', d.getHours() + ':' + d.getMinutes() + ' [' + userID + ']: ' + msg);
	})
	socket.on('disconnect', function(){
		console.log('a user disconnected');
	});
});

app.get('/questions', function(req, res){
	database.readQuestionData(function(dataInfo){
		res.send(dataInfo);
	});
})

app.post('/questions', function(req, res){
	submittedData = Object.keys(req.body)[0];
	database.readQuestionData(function(dataInfo){
		questionArrayData = []
		for(obj in dataInfo){
			questionArrayData.push([obj, dataInfo[obj]]);
		}
		submittedDataQ = submittedData[0];
		submittedDataInfo = submittedData.slice(2);
		newPossibleValue = 1;
		for (obj in questionArrayData[submittedDataQ-1][1]){
			if(obj == submittedDataInfo){
				newPossibleValue = questionArrayData[submittedDataQ-1][1][obj]+1; 
				break;}
		}
		questionArrayData[submittedDataQ-1][1][submittedDataInfo] = newPossibleValue;
		database.writeQuestionData(questionArrayData[submittedDataQ-1][0], submittedDataInfo, questionArrayData[submittedDataQ-1][1])
	})
})

app.get('/*', function(req, res){
	res.render('index');
	userArray = database.readUserData();
	//database.writeUserData('chrisA', 'pass12');
});

app.post('/*', function(req, res){
	console.log(req.body);
	let username = req.body.user;
	let password = req.body.password;
	let accessType = req.body.accountAccess;
	console.log(accessType);
	let accountExists = false;
	let accountIndex = -1;
	for(let i = 0; i < userArray.length; i++){
		if ( userArray[i][0] == username){
			accountExists = true;
			accountIndex = i;
			break;
		}
	}
	if(accessType == "Sign Up"){
		console.log('signing up');
		if(accountExists){
			console.log('deny');
			return res.redirect('/invalidU');
		}
		else{
			console.log('create');
			database.writeUserData(username, password);
			return res.redirect('/app/' + username);
		}
	}
	else if(accessType == "Sign In"){
		console.log('signing in');
		if(accountIndex != -1 && userArray[accountIndex][1] == password){
			console.log('access');
			return res.redirect('/app/' + username);
		}
		else{
			console.log('deny');
			return res.redirect('/invalidI');
		}
	}
	console.log('done');
})


http.listen(3000, function(){
	console.log('listening on *:3000');
});
