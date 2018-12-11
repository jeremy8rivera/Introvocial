//ChatLobby

$(document).ready(function(){

	var answers = [];
	$(function () {
		var socket = io();
		$('form').submit(function(){
			socket.emit('chat message', $('#m').val());
			$('#m').val('');
			return false;
		});
		socket.on('chat message', function(msg){
			$('#messages').prepend($('<li>').text(msg));

			msg = msg.toLowerCase()
			scrubbedMsg = msg.slice(msg.indexOf(']:')+3);

			if(scrubbedMsg[0] == '!'){
				scrubbedMsg = scrubbedMsg.slice(1);
				num = scrubbedMsg.slice(0, scrubbedMsg.indexOf(' '));
				acceptableNumArray = ['1','2','3','4'];
				if(acceptableNumArray.includes(num))
				{
					$.ajax({
						method: 'POST',
						url: '/questions',
						data: scrubbedMsg
					})
				}
			}
		});
	});
	


});


function updateGraphs(){
	$.ajax({
		method: 'GET',
		url: '/questions'
	})
	.done(function(data){
		console.log(data);

		questionArrayData = []

		for(obj in data){
			questionArrayData.push([obj, data[obj]]);
		}

		console.log(questionArrayData);

		google.charts.load('current', {'packages':['corechart']});

    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);

     // Callback that creates and populates a data table,
     // instantiates the pie chart, passes in the data and
     // draws it.
     function drawChart() {
     	for(let i = 0; i < questionArrayData.length; i++){
     		let questionSet = [];
     		for(obj in questionArrayData[i][1]){
     			questionSet.push([obj, questionArrayData[i][1][obj]]);
     		}
     		
     		var data = new google.visualization.DataTable();
     		data.addColumn('string', 'responses');
     		data.addColumn('number', 'responAmnt');
     		data.addRows(questionSet);
     		var options = {'title': '(' + (i+1) + ') ' + questionArrayData[i][0], 'width': 400, 'height': 300};
     		var chart = new google.visualization.PieChart(document.getElementById('chart_div' + (i+1)))
     		chart.draw(data, options);
     	}
     }

 });
}

updateGraphs();
setInterval(updateGraphs, 15000);