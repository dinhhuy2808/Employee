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
			type_id : parseInt(input.type),
            country : input.country,
            city : input.city,
            address : input.addr
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
	var sql = 'use employee;'
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }

    });

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
            req.session.email=rows[0].email;
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

module.exports.show_account = function(req, res){
        //delete req.session;
        if(typeof req.session.user_id!='undefined'
            &&  (req.session.type == 1)){

            var sql = 'select * from employee.user ';
            if( (req.query.fname != undefined &&  req.query.fname != '')
                ||  (req.query.lname != undefined &&  req.query.lname != '')
                ||  (req.query.email != undefined &&  req.query.email != '')
                ||  (req.query.type != undefined &&  req.query.type != '')){
                sql += ' where  ';
            }
            if(req.query.fname != '' && req.query.fname != undefined){
                sql += ' firstname = \''+req.query.fname+'\' and';
            }
            if(req.query.lname != '' && req.query.lname != undefined){
                sql += ' lastname = \''+req.query.lname+'\' and';
            }
            if(req.query.email != '' && req.query.email != undefined){
                sql += ' email = \''+req.query.email+'\' and';
            }
            if(req.query.type != '0' && req.query.type != undefined){
                sql += ' type_id = '+req.query.type+' and';
            }

            if( (req.query.fname != undefined &&  req.query.fname != '')
                ||  (req.query.lname != undefined &&  req.query.lname != '')
                ||  (req.query.email != undefined &&  req.query.email != '')
                ||  (req.query.type != undefined &&  req.query.type != '0')){
                sql = sql.substring(0,sql.length-3);
            }
            console.log(sql);
            var con = req.db.driver.db;
            con.query(sql, function (err, rows) {
                if(err){
                    console.log(err);
                    res.redirect('/maintenance')
                }else{
                    data={title:req.session.firstname+' | home',fname:req.session.firstname,users:rows,dateFormat:dateFormat,pic:req.session.pic,type:req.session.type,
                        fnameflt:req.query.fname,
                        lnameflt:req.query.lname,
                        emailflt:req.query.email,
                        typeflt:req.query.type,
			emailheader:req.session.email,};
                    res.render('accounts',data);
				}


            });

        }else{
            res.redirect('/')
        }

    };

module.exports.edit_account = function(req, res){
    if(req.session.type == 1){
        req.models.user.find({email:req.query.email},function(err,rows){
            if(err){
                console.log(err);
            }
            else{
                data={title:'Edit Account | '+req.session.firstname,fname:req.session.firstname,user:rows};
                res.render('edit_account',data);

            }
        });
    }else{
        req.models.user.find({email:req.session.email},function(err,rows){
            if(err){
                console.log(err);
            }
            else{
                data={title:'Edit Account | '+req.session.firstname,fname:req.session.firstname,user:rows};
                res.render('edit_account',data);

            }
        });
    }


    };
module.exports.save_account = function(req, res){
    var input=JSON.parse(JSON.stringify(req.body));
        req.models.user.get(input.id,function(err,rows){
            if(err){
                console.log(err);
            }
            else{
                var date = new Date();
                var month = date.getMonth() + 1;
                month = (month < 10 ? "0" : "") + month;

                var day  = date.getDate();
                day = (day < 10 ? "0" : "") + day;
                var year = date.getUTCFullYear();

                var dt_join=Math.round(+new Date()/1000);
                var birth = input.dob.split("/");
                var newDOB = birth[2]+birth[1]+birth[0];
                rows.email   = input.email;
                rows.phone    = input.phone;
                rows.firstname    = input.fname;
                rows.lastname = input.lname;
                rows.salary=parseFloat(input.salary);
                rows.type_id = parseInt(input.type);
                rows.country = input.country;
                rows.city = input.city;
                rows.address = input.addr;
                rows.dob = parseInt(newDOB);
                rows.save(data,function(err){
                    console.log('saved');
                });
            }
            if(req.session.type == 1){
                res.redirect('/maintenance');
            }else{
                res.redirect('/');
            }

        });


};

