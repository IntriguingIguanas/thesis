const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Sets up /client as static directory
app.use(express.static(__dirname + '/../client/dist'));

// deployment port variable - default to 3000
var port = process.env.PORT || 3000
app.listen(port, function(){
	console.log(`Magic happens on port ${port}!`);
});