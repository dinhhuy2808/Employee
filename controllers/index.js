var dateFormat = require('dateformat');
module.exports.home = function(req, res){
	//delete req.session;
	if(typeof req.session.user_id!='undefined'){
	req.models.project.find({}, function(err, rows) {
		if(err){
			console.log(err);
		}
				data={title:req.session.firstname+' | home',fname:req.session.firstname,project:rows,dateFormat:dateFormat,pic:req.session.pic};
				res.render('home',data);
		});


	}
	else{
		data={title:'login|signup'};
		res.render('index',data);
	}
};
