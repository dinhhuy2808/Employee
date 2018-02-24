//add project
module.exports.add_project = function(req, res){
	if(typeof req.session.user_id!='undefined'){
		data={title:'Add todo | '+req.session.fname,fname:req.session.fname};
		res.render('add_project',data);
	}
	else{
		res.redirect('/');
	}
};


//save project
module.exports.save_project=function(req,res){
    var input=JSON.parse(JSON.stringify(req.body));
		var data1={
		   email:input.email
		};
    req.models.user.find(data1, function(err, rows,next) {
        if(err){
            console.log(err);
        }
        if(rows.length>0){
            console.log(rows);
            var data={
                project_name:input.projname,
                customer_id:rows[0].user_id,
                code:input.code
            };
            if(typeof input.id=="undefined"){
                req.models.project.create(data,function(err,rows){
                    if(err){
                        console.log(err);
                    }
                    else{
                    }

                });
            }
            else{
                req.models.project.get(input.id,function(err,rows){
                    if(err){
                        console.log(err);
                    }
                    else{
                        rows.project_name=input.projname;
                        rows.code=input.code;
                        rows.customer_id=input.email;
                        rows.save(data,function(err){
                            console.log('saved');
                        });
                    }
                   /* res.redirect('/');*/
                });
            }
        }

    });
    res.redirect('/');
};
//edit project
module.exports.edit_project=function(req,res){
    req.models.project.find({project_id:req.query.id},function(err,rows){
        if(err){
            console.log(err);
        }
        else{
            req.models.user.find({user_id:rows[0].customer_id},function(err,row1s){
                if(err){
                    console.log(err);
                }
                else{

                    data={title:'Edit Project | '+req.session.firstname,fname:req.session.firstname,project:rows,email:row1s[0].email,name:row1s[0].firstname+' '+row1s[0].lastname};
                    res.render('edit_project',data);
                }
            });

        }
    });
};
//delete project
module.exports.delete_project=function(req,res){
    req.models.project.find({project_id:req.params.id}).remove(function(err){
        if(err){
            console.log(err);
        }
        else{
        }
        res.redirect('/');
    });
};

//save todo
module.exports.save_todo=function(req,res){
	var input=JSON.parse(JSON.stringify(req.body));

		var data={
			job:input.job,
			add_date:Math.round(+new Date()/1000),
			user_id:req.session.id
		};
		if(typeof input.id=="undefined"){
			req.models.todo.create(data,function(err,rows){
				if(err){
					console.log(err);
					}
				else{
					}
					res.redirect('/');
				});
			}
		else{
			req.models.todo.get(input.id,function(err,rows){
				if(err){
					console.log(err);
				}
				else{
					rows.job=input.job;
					rows.save(function(err){
						console.log('saved');
						});
				}
				res.redirect('/');
				});
			}
};


//Show Task
module.exports.show_task=function(req,res){
    var sql = 'SELECT `task`.`task_id`,\n' +
        '    `task`.`project_id`,\n' +
        '    `task`.`create_time`,\n' +
        '    `task`.`approved`,\n' +
        '    `task`.`status_id`,\n' +
        '    `task`.`assignee_id`,\n' +
        '    `task`.`estimate`,\n' +
        '    `task`.`log_work`,\n' +
        '    `task`.`description`,\n' +
        '    `task`.`reporter_id`,\n' +
        '    `task`.`task_code`,\n' +
        '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
        '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
        '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
        '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
        '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
        '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
        '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email\n' +
        'FROM `employee`.`task` where `project_id` = '+req.query.id;


    if(req.query.assigneeflt != '' && req.query.assigneeflt != undefined){
        sql += ' and `assignee_id` = (select user_id from user where email = \''+req.query.assigneeflt+'\') ';
    }
    if(req.query.reporterflt != '' && req.query.reporterflt != undefined){
        sql += ' and `reporter_id` = (select user_id from user where email = \''+req.query.reporterflt+'\') ';
    }
    if(req.query.statusflt != '' && req.query.statusflt != undefined){
        sql += ' and `status_id` = '+req.query.statusflt+' ';
    }
    if(req.query.approvedflt != '' && req.query.approvedflt != undefined){
        sql += ' and `approved` = \''+req.query.approvedflt+'\' ';
    }

    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }
        else{
            var projectName ;
            req.models.project.find({project_id:req.query.id},function(err, row1,next){
                if(err){
                    console.log(err);
                }
                else{
                    projectName = row1[0].project_name;
                    data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,tasks:rows,project:row1,type:req.session.type};
                    res.render('show_task',data);
                }
            });


        }
    });


};

//add project
module.exports.add_project = function(req, res){
    if(typeof req.session.user_id!='undefined'){
        data={title:'Add todo | '+req.session.fname,fname:req.session.fname};
        res.render('add_project',data);
    }
    else{
        res.redirect('/');
    }
};

//add task
module.exports.add_task = function(req, res){
    if(typeof req.session.user_id!='undefined'){

        req.models.task.find({project_id:req.query.project_id},function(err, row1){
            if(err){
                console.log(err);
            }
            else{
                var sql = 'select * from status;';
                var con = req.db.driver.db;
                con.query(sql, function (err, rows) {
                    if(err){
                        console.log(err);
                    }
                    data={title:'Add task | '+req.session.firstname,
                        fname:req.session.firstname,
                        task_code:req.query.code+'-'+(parseInt(row1.length) + 1),
                        creator : req.session.firstname + ' ' + req.session.lastname,
                        creator_id : req.session.user_id,
                        status : rows
                    };
                    res.render('add_task',data);

                });

            }
        });

    }
    else{
        res.redirect('/');
    }
};

//Save Task
module.exports.save_task=function(req,res){
    var input=JSON.parse(JSON.stringify(req.body));
    var date = new Date();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    var year = date.getUTCFullYear();
    var data={
        project_id : parseInt(input.project_id),
        approved : input.approved,
        status_id : parseInt(input.status),
        assignee_id: parseInt(input.assignee_id),
        estimate : parseInt(input.estimate),
        log_work: input.log,
        description:input.description,
        reporter_id:parseInt(input.creator_id),
        task_code:input.taskcode,
        create_time:parseInt(year+''+month+''+day)
    };
    if(input.action=="save"){
        req.models.task.create(data,function(err,rows){
            if(err){
                console.log(err);
            }
            else{
                console.log(err)
                var dataAction={
                    task_id : parseInt(rows.task_id),
                    update_time : date.getTime(),
                    status_id : parseInt(input.status),
                    user_id : parseInt(req.session.user_id),
                    description:'Create Task'
                };
                req.models.action.create(dataAction,function(err,row1s){
                    if(err){
                        console.log(err);
                    }else{
                        var date2 = new Date();
                        date2.setTime(dataAction.update_time);
                        console.log(date2.toString());
                    }
                });
            }

        });
    }
    else{
        req.models.task.find({task_id:input.task_id},function(err, row1){
            if(err){
                console.log(err);
            }
            else{
                var con = req.db.driver.db;
                var sqlInsAct = '';
               if(row1[0].assignee_id != input.assignee_id){
                   sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                       'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Assignee to '+input.name+'\');';
               }
                if(row1[0].estimate != input.estimate){
                    sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                        'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Estimate to '+input.estimate+'\');';
                }
                if(row1[0].log_work.trim !== input.log){
                    sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                        'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Log Work to '+input.log+'\');';
                }
                if(row1[0].description.trim !== input.description){
                    sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                        'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Description to '+input.description+'\');';
                }
                if(req.session.type == 1){
                    if(row1[0].approved.trim !== input.approved){
                        sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                            'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Approved to '+input.approved+'\');';
                    }
                }
                if(row1[0].status_id != input.status){
                    sqlInsAct += 'INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                        'VALUES('+input.task_id+',\''+date.getTime()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Status to '+input.sttdesc+'\');';
                }
                con.query(sqlInsAct, function (err, row1s) {
                    if(err){
                        console.log(err);
                    }
                    else {
                        var sql = 'UPDATE `employee`.`task` ' +
                            'SET ' ;
                        if(req.session.type == 1){
                            sql+='`approved` = \''+input.approved+'\', ';
                        }
                        sql += '`status_id` = '+input.status+', ' +
                            '`assignee_id` = '+input.assignee_id+', ' +
                            '`estimate` = '+input.estimate+', ' +
                            '`log_work` = \''+input.log+'\', ' +
                            '`description` = \''+input.description+'\' ' +
                            ' WHERE `task`.`task_id` = '+input.task_id;
                        var con = req.db.driver.db;
                        con.query(sql, function (err, rows) {
                            if(err){
                                console.log(err);
                            }

                        });
                    }
                });
            }
        });


    }
    res.redirect('/show-task?id='+input.project_id);
};
//edit task
module.exports.edit_task=function(req,res){
    var sql = 'SELECT `task`.`task_id`,\n' +
        '    `task`.`project_id`,\n' +
        '    `task`.`create_time`,\n' +
        '    `task`.`approved`,\n' +
        '    `task`.`status_id`,\n' +
        '    `task`.`assignee_id`,\n' +
        '    `task`.`estimate`,\n' +
        '    `task`.`log_work`,\n' +
        '    `task`.`description`,\n' +
        '    `task`.`reporter_id`,\n' +
        '    `task`.`task_code`,\n' +
        '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
        '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
        '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
        '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
        '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
        '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
        '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email\n' +
        'FROM `employee`.`task` where `task`.`task_id` ='+ req.query.id + ';';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
        }
        else{
            var sql2 = 'select * from status';
            con.query(sql2, function (err, row2s) {
                if(err){
                    console.log(err);
                }
                else{
                    data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,lname:req.session.lastname,tasks:rows,status:row2s,type:req.session.type,userid:req.session.user_id};
                    res.render('edit_task',data);

                }
            });


        }
    });
};
//delete task
module.exports.delete_task=function(req,res){
    req.models.task.find({task_id:req.params.id}).remove(function(err){
        if(err){
            console.log(err);
        }
        else{
        }
        res.redirect('/show-task?id='+req.params.project);
    });
};