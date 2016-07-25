var http = require('http'); //include the http module
var fs = require('fs'); //require the fs modeule

const PORT = 3000; //declare your listening port

http.createServer(function(request, response){
	console.log(request.url);
	
	//var file_Name = request.url.toString();
	if (request.method == 'POST') {
		var body = '';
		request.on('data', function(data){
			body += data;
		})
		request.on('end', function(){
			if(request.url == "/carcoolersignup"){
				//coolersingup(body, );
				console.log(JSON.parse(body));
			}else if(request.url == "/carrulersignup"){
				//rulersignup(request.data)
				console.log(body);
			}
		})
		

	}else{

		if(request.url == "/"){
		
		sendRes(response, "index.html", "text/html");

		
		}else if(request.url == "/assets/scripts/script.js"){
			sendRes(response, "assets/scripts/script.js", "text/javascript");
		}else if(request.url == "/assets/scripts/jquery-2.2.4.min.js"){
			sendRes(response, "assets/scripts/jquery-2.2.4.min.js", "text/javascript");
		}else if(request.url == "/assets/css/style.css"){
			sendRes(response, "assets/css/style.css", "text/css");

		}
		/*}else{
			//call function to decide what JSON data to send
			sendJson(request.url, response);
			//sendRes(response, 'nytimes.json', "text/json" );
			//response.write('nytimes.json');
		*/
			
	}

	

}).listen(PORT, function()

	{console.log('listening to port: %s', PORT)

	});


function sendRes(response, file_name, content_type){
	// send a file when requested
	fs.readFile(file_name, 'utf8', function(error, file_contents){

		if(error){
			response.writeHead(404);
			response.write('error reading file in sendRes: %s', file_name);
		}else{
			
			response.writeHead(200, {'Content-Type': content_type});
			response.write(file_contents);
			console.log('file sent from server: %s', file_name);			
		}
		response.end();
	});
}