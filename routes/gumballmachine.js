exports.index = function(req, res){
	res.render('index', {page_title:"index"});
}

exports.turnCrank = function(req, res){
	var input = JOSN.parse(JSON.stringify(req.bosy));
	
}
exports.inventory = function(req, res){
  var getinvent=require('restler');
  getinvent.get('http://chaitanya-grails-gumball-v2.cfapps.io/gumballs').on('complete', function(result) {
	  if (result instanceof Error) {
	    console.log('Error:', result.message);
	    this.retry(5000); // try again after 5 sec
	  } else {
		  console.log(result);
		  res.render('inventory', {result:result});
	  }
	});
};

exports.getindividualdetails = function(req,res){
	var id = req.params.id;
	var getind = require('restler');
	getind.get('http://chaitanya-grails-gumball-v2.cfapps.io/gumballs/'+id).on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
			  console.log(result);
			  res.render('getindividualdetails', {result:result, id: id, state:'No Coin', Msg:'Please Insert Coin'});
		  }
		});
}
exports.newindividualdetails = function(req, res){
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {
				serialNumber : input.serialNumber,
				modelNumber : input.modelNumber,
				countGumballs : input.count
		}
		console.log(data);
		var newinddata = require('restler');
		
		newinddata.post('http://chaitanya-grails-gumball-v2.cfapps.io/gumballs', {
			  data: data,
			}).on('complete', function(data, response) {
				newinddata.get('http://chaitanya-grails-gumball-v2.cfapps.io/gumballs').on('complete', function(result) {
					  if (result instanceof Error) {
					    console.log('Error:', result.message);
					    this.retry(5000); // try again after 5 sec
					  } else {
						  console.log(result);
						  res.render('inventory', {result:result});
					  }
					});
			});

	}
exports.deleteindividualdetails = function(req, res){
	var id = req.params.id;
	var delind = require('restler');
	delind.del('http://chaitanya-grails-gumball-v2.cfapps.io/gumballs/'+id).on('complete', function(result) {
		  if (result instanceof Error) {
		    console.log('Error:', result.message);
		    this.retry(5000); // try again after 5 sec
		  } else {
			  console.log(result);
			  res.render('index');
		  }
		});
}
exports.updateindividualdetails = function(req, res){
	var id = req.params.id;
	var input = JSON.parse(JSON.stringify(req.body));
	var state = input.state;
	var event = input.event;
	
	var data = {
			id : id,
			serialNumber : input.serialNumber,
			modelNumber : input.modelNumber,
			countGumballs : input.countGumballs
	}
	console.log(data);
	if(event=="Insert Quarter"){
		if(state=="No Coin"){
			//state = "Has Coin";
			res.render('getindividualdetails', {result:data, id:id, state:'Has Coin', Msg:'Coin Inserted'});
		}
		else
			res.render('getindividualdetails', {result:data, id:id, state:state, Msg:'Coin already Inserted'});
	}
	else{
		if(state=="No Coin"){
			res.render('getindividualdetails', {result:data,id:id, state:state, Msg:'Please Insert Coin'})
		}
		else if(state=="Has Coin"){
			if(input.countGumballs > 0){
				var dataNew = {
						serialNumber : input.serialNumber,
						modelNumber : input.modelNumber,
						countGumballs : input.countGumballs-1
				}
				var updtind = require('restler');
				updtind.putJson('http://newgumball.cfapps.io/machines/'+id, dataNew).on('complete', function(data, response) {
					res.render('getindividualdetails', {result:dataNew, id:id, state:'No Coin', Msg:'Please Collect gumball'});
				});
			}
			else {
				res.render('getindividualdetails', {result:data, id : id, state:state, Msg:'Inventory Zero'});
			}
			
		}
	}
}

