var dateFormat = require('dateformat');
module.exports.home = function(req, res){
	//delete req.session;
	if(typeof req.session.user_id!='undefined'){
        var sql = '';
         sql += 'select * ,\n' +
            '(select firstname from user where user_id = pro.customer_id) as firstname,\n' +
            '(select lastname from user where user_id = pro.customer_id) as lastname,\n' +
            '(select email from user where user_id = pro.customer_id) as email,\n' +
            '(select email from user where user_id = '+req.session.user_id+') as assigneeemail\n' +
            ' from employee.project pro ';
        if( (req.query.email != undefined &&  req.query.email != '')
			||  (req.query.name != undefined &&  req.query.name != '')){
            sql += 'join user u on pro.customer_id = u.user_id where  ';
		}
        if(req.query.email != '' && req.query.email != undefined){
        	sql += 'u.email = \''+req.query.email+'\'';
		}
        if(req.query.name != '' && req.query.name != undefined){
            sql += 'u.firstname = \''+req.query.name+'\'';
        }
        var con = req.db.driver.db;
        con.query(sql, function (err, rows) {
            if(err){
                console.log(err);
            }
            data={title:req.session.firstname+' | home',fname:req.session.firstname,project:rows,dateFormat:dateFormat,pic:req.session.pic,type:req.session.type};
            res.render('home',data);

        });

	}
	else{
		data={title:'login|signup'};
		res.render('index',data);
	}
};
