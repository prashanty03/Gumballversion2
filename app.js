
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , gumballmachine= require('./routes/gumballmachine')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', gumballmachine.index);
app.get('/list', gumballmachine.inventory);
app.get('/getDetails/:id',gumballmachine.getindividualdetails);
app.post('/newindividualMachine',gumballmachine.newindividualdetails);
app.get('/deleteindividualMachine/:id',gumballmachine.deleteindividualdetails);
app.post('/getDetails/:id',gumballmachine.updateindividualdetails);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
