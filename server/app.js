const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Sets up /client as static directory
app.use(express.static(path.resolve(__dirname, '../client')));

// deployment port variable - default to 3000
var port = process.env.PORT || 3000
app.listen(port, function(){
	console.log(`listening on port ${port}!`);
});