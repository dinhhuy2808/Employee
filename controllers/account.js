	var md5 = require('MD5');
//signup
module.exports.signup=function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	var dt_join=Math.round(+new Date()/1000);
	var birth = input.dob.split("/");
	var newDOB = birth[2]+birth[0]+birth[1];
		passwd=md5(input.password);
		var dataUser = {
			username:input.username,
            email   : input.email,
            dob:input.dob,
            phone    : input.phone,
            firstname    : input.fname,
            lastname : input.lname,
            dob:newDOB,
            password:passwd,
            create_time:dt_join
		};
		req.models.user.create(dataUser, function(err, rows) {
					if(err){ 
			console.log(err);
		}
		if(rows.user_id){
			req.session.fname=rows.firstname;
			req.session.id=rows.user_id;
		}
		res.redirect('/');
			});
};
//login
module.exports.login=function(req,res){
	var input=JSON.parse(JSON.stringify(req.body));
		var data={
			email:input.email,
			password:md5(input.password)
		};
	req.models.user.find(data, function(err, rows,next) {
		if(err){
			console.log(err);
		}
		if(rows.length>0){
			req.session.firstname=rows[0].firstname;
			req.session.user_id=rows[0].user_id;
			console.log(rows);
		}
		res.redirect('/');
		});
};
//logout
module.exports.logout=function(req,res){
	delete req.session;
	res.redirect('/');
};
