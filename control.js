// Require the serialport node module
var SerialPort = require('serialport');


var serialPort = new SerialPort("COM7", {
    baudRate: 9600
});

// Read the port data


var http = require('http'),
    fs = require('fs'),
    // NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);

// Send current time to all connected clients
function sendReading() {
	serialPort.on('data', function (data) {
  		console.log('Data:', data.toString('utf8'));
  		fsr = data.toString('utf8');
  		io.emit('fsr_data', { fsr_data: fsr.split(" ")[3] });
	});
    
}

setInterval(sendReading, 1000);

// Emit welcome message on connection
io.on('connection', function(socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('i am client', console.log);
});

app.listen(3000);




