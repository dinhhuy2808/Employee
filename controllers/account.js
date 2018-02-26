	var md5 = require('MD5');
    var dateFormat = require('dateformat');
//signup
module.exports.signup=function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));

    var date = new Date();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var year = date.getUTCFullYear();

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
            type_id:2,
            password:passwd,
            create_time:parseInt(year+''+month+''+day),
			salary:parseFloat(input.salary),
			type_id : parseInt(input.type)
		};
		req.models.user.create(dataUser, function(err, rows) {
					if(err){ 
			console.log(err);
		}
		/*if(rows.user_id){
            req.session.firstname=rows.firstname;
            req.session.lastname=rows.lastname;
            req.session.user_id=rows.user_id;
            req.session.type=rows.type_id;
		}*/
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
            req.session.lastname=rows[0].lastname;
			req.session.user_id=rows[0].user_id;
            req.session.type=rows[0].type_id;
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

module.exports.register=function(req,res){
    data={title:req.session.firstname+' | Register',fname:req.session.firstname,dateFormat:dateFormat,pic:req.session.pic,type:req.session.type};

    res.render('register',data);
};
