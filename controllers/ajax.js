exports.checkEmail=function(req,res){
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
			var data={
			email:input.email
		};
	req.models.user.find(data, function(err, rows,next) {
					if (err){
				data={status:'error',code:'200'};
			}
			else{
					if(rows.length>0){
						data={status:'exist',code:'300'};
						}
					else{
						data={status:'success',code:'400'};
						}	
			}
							res.json(data);
		});
};

exports.checkUser=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var data={
        username:input.username
    };
    req.models.user.find(data, function(err, rows,next) {
        if (err){
            data={status:'error',code:'200'};
        }
        else{
            if(rows.length>0){
                data={status:'exist',code:'300'};
            }
            else{
                data={status:'success',code:'400'};
            }
        }
        res.json(data);
    });
};

exports.checkEmailAddProject=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var data={
        email:input.email
    };
    req.models.user.find(data, function(err, rows,next) {
        if (err){
            data={status:'error',code:'200'};
        }
        else{
            if(rows.length>0){
                data={status:'exist',code:'300',name: rows[0].firstname +' '+ rows[0].lastname, user_id:rows[0].user_id};
            }
            else{
                data={status:'success',code:'400'};
            }
        }
        res.json(data);
    });
};

exports.checkProjectCode=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var data={
        code:input.code
    };
    req.models.project.find(data, function(err, rows,next) {
        if (err){
            data={status:'error',code:'200'};
        }
        else{
            if(rows.length>0){
                data={status:'exist',code:'300'};
            }
            else{
                data={status:'success',code:'400'};
            }
        }
        res.json(data);
    });
};

exports.getName=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var data={
        user_id:input.id
    };
    req.models.user.find(data, function(err, rows,next) {
        if (err){
            data={status:'error',code:'200'};
        }
        else{
            if(rows.length>0){
                data={status:'exist',code:'300',name:rows[0].firstname+' '+rows[0].lastname + '('+rows[0].email+')'};
            }
            else{
                data={status:'success',code:'400'};
            }
        }
        res.json(data);
    });
};


exports.getEmail=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

    var sql = 'select * from user where firstname like \'%' + input.string + '%\';';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }
        else{
            var data;
            if(rows.length>0){
                data={names: rows};
            }
            res.json(data);
        }
    });

};
exports.count=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

    var sql = 'select \n' +
        't.task_code,\n' +
        't.estimate,\n' +
        't.assignee_id,\n' +
        '(select firstname from user u where u.user_id = t.assignee_id) as firstname,\n' +
        '(select lastname from user u where u.user_id = t.assignee_id) as lastname,\n' +
        '(select email from user u where u.user_id = t.assignee_id) as email,\n' +
        '(select salary from user u where u.user_id = t.assignee_id) as salary,\n' +
        '(select description from status s where s.status_id = t.status_id) as status,\n' +
        '(select code from project p where p.project_id = t.project_id) as project\n' +
        'from employee.task t where status_id = 5 ';

    if(input.assigneeflt != '' && input.assigneeflt != undefined){
        sql += 'and `assignee_id` = (select user_id from user where email = \''+input.assigneeflt+'\') ';
    }
    if(input.projectflt != '' && input.projectflt != undefined){
        sql += 'and `project_id` = (select project_id from project where code = \''+input.projectflt+'\' ) ';
    }
    if(input.taskflt != '' && input.taskflt != undefined){
        sql += 'and `task_code` = \''+input.taskflt+'\' ';
    }
    if(input.fromflt != '' && input.fromflt != undefined){
        var from = input.fromflt.split("/");
        var newDOB = from[2]+from[1]+from[0];
        sql += 'and `close_time` >= '+newDOB+' ';
    }
    if(input.toflt != '' && input.toflt != undefined){
        var to = input.toflt.split("/");
        var newDOB = from[2]+from[1]+from[0];
        sql += 'and `close_time` <= '+newDOB+' ';
    }

    sql+= ' order by assignee_id;'

    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            var data;
            if(rows.length >0){

                var temp = 0;
                var total = 0;
                for(i=0;i<rows.length;i++){
                    total += (parseFloat(rows[i].estimate) * parseFloat(rows[i].salary));

                }
                data={status:'exist',code:'300',total: total , detail:rows};
                console.log(data)
            }
            res.json(data);

        }
    });

};
exports.getProject=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

    var sql = 'select code from project where project_name like \'%' + input.string + '%\';';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }
        else{
            var data;
            if(rows.length>0){
                data={names: rows};
            }
            res.json(data);
        }
    });

};
exports.getTask=function(req,res){
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);

    var sql = 'select task_code from task where task_code like \'%' + input.string + '%\';';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }
        else{
            var data;
            if(rows.length>0){
                data={names: rows};
            }
            res.json(data);
        }
    });

};
