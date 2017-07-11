// Require statements for importing modules
var express = require('express');
var ical = require('ical-toolkit');
var bodyParser = require('body-parser');
var email = require('emailjs');

// Creates server with express
var app = express();

// Create an ical builder object
var builder = ical.createIcsFileBuilder();

// Enables parsing the http post body
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Serves the index.hmtl page on a get request
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

// Handles post requests
app.post('/', urlencodedParser, (req, res) => {
	// Name of calander 'X-WR-CALNAME' tag. 
	builder.calname = 'Test Calendar';
	// Calendar timezone
	builder.timezone = 'america/atlanta';
	// Calendar timezone ID
	builder.tzid = 'america/atlanta';
	// Method
	builder.method = 'REQUEST';
	// Add events
	builder.events.push({
		// Event start
		start: new Date(req.body.startDate),
		// Event end
		end: new Date(req.body.endDate),
		// Transparency setting
		transp: 'OPAQUE',
		// Event summary
		summary: req.body.subject,
		// Organizer info
		organizer: {
			name: req.body.from,
			email: 'testappnutanix@gmail.com'
		},
		// Attendee info
		attendees: [
			{
				name:  req.body.to,
				email: req.body.receiverMail
			}
		]
	})
	// Try to build the object
	var icsFileContent = builder.toString();

	// Display the ical data in the console
	console.log(icsFileContent);
	
	// server details for emailjs
	// uses dummy email account I set up for this project
	var server 	= email.server.connect({
	   user:	"testappnutanix@gmail.com", 
	   password: "pleasehireme2017", 
	   host:	"smtp.gmail.com", 
	   ssl:		true
	});

	// defines the message object
	var message = {
		text: req.body.from + " has sent you an invite!",
		from: req.body.from + "<testappnutanix@gmail.com>",
		to: req.body.to + " " + req.body.receiverMail,
		subject: req.body.subject,

		attachment: [{
			data: icsFileContent, type: "text/calendar", 
			name: "YourInvitation.ics"
		}]
	};

	// send method, also logs errors
	server.send(message, (err, message) => { 
		console.log(err || message);
	});

	res.sendFile(__dirname + '/success.html');
});

// Defines the port the server is listening to
app.listen(8080);