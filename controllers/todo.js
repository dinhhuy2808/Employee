var nodemailer = require('nodemailer');
//add project
module.exports.add_project = function(req, res){
	if((typeof req.session.user_id!='undefined') && (req.session.type == 1)){
	    var sql = 'select firstname,lastname,email from employee.user where type_id = 3;'
        var con = req.db.driver.db;
        con.query(sql, function (err, rows) {
            if(err){
                console.log(err);
            }
            else{
                data={title:'Add todo | '+req.session.fname,fname:req.session.fname,users:rows};
                res.render('add_project',data);
            }
        });

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
                        if(req.session.type == 1){
                            rows.save(data,function(err){
                                console.log('saved');
                            });
                        }else{
                            res.redirect('/');
                        }

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
    if(req.session.type == 1){
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
    }else{
        res.redirect('/');
    }

};
//delete project
module.exports.delete_project=function(req,res){
    if(req.session.type == 1){
        req.models.project.find({project_id:req.params.id}).remove(function(err){
            if(err){
                console.log(err);
            }
            else{
                var sql = 'delete from task where project_id  = '+req.params.id+';'
                var con = req.db.driver.db;
                con.query(sql, function (err, rows) {
                    if(err){
                        console.log(err);
                    }
                    res.redirect('/');
                });
            }


            res.redirect('/');
        });
    }else{
        res.redirect('/');
    }

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
    if(req.query.id != undefined){
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
                        data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,tasks:rows,project:row1,type:req.session.type,emailheader:req.session.email};
                        res.render('show_task',data);
                    }
                });


            }
        });
    }else{
        if(req.session.type == 1) {
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
                '    `project`.`project_name`,\n' +
                '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
                '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
                '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
                '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
                '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
                '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
                '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email\n' +
                'FROM `employee`.`task` join `employee`.`project` on `task`.`project_id` = `project`.`project_id`';

            if ((req.query.assigneeflt != '' && req.query.assigneeflt != undefined)
                || (req.query.reporterflt != '' && req.query.reporterflt != undefined)
                || (req.query.statusflt != '' && req.query.statusflt != undefined)
                || (req.query.approvedflt != '' && req.query.approvedflt != undefined)) {
                sql += ' where '
            }

            if (req.query.assigneeflt != '' && req.query.assigneeflt != undefined) {
                sql += ' `assignee_id` = (select user_id from user where email = \'' + req.query.assigneeflt + '\') and';
            }
            if (req.query.reporterflt != '' && req.query.reporterflt != undefined) {
                sql += ' `reporter_id` = (select user_id from user where email = \'' + req.query.reporterflt + '\' ) and';
            }
            if (req.query.statusflt != '' && req.query.statusflt != undefined) {
                sql += ' `status_id` = ' + req.query.statusflt + ' and';
            }
            if (req.query.approvedflt != '' && req.query.approvedflt != undefined) {
                sql += ' `approved` = \'' + req.query.approvedflt + '\' and';
            }
            if ((req.query.assigneeflt != '' && req.query.assigneeflt != undefined)
                || (req.query.reporterflt != '' && req.query.reporterflt != undefined)
                || (req.query.statusflt != '' && req.query.statusflt != undefined)
                || (req.query.approvedflt != '' && req.query.approvedflt != undefined)) {
                sql = sql.substring(0, sql.length - 3);
            }
            sql += ' order by task_code;';

        }else{
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
                '    `project`.`project_name`,\n' +
                '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
                '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
                '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
                '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
                '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
                '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
                '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email\n' +
                'FROM `employee`.`task` join `employee`.`project` on `task`.`project_id` = `project`.`project_id` where assignee_id = '+req.session.user_id+'';

            if ((req.query.reporterflt != '' && req.query.reporterflt != undefined)
                || (req.query.statusflt != '' && req.query.statusflt != undefined)
                || (req.query.approvedflt != '' && req.query.approvedflt != undefined)) {
                sql += ' where '
            }

            if (req.query.reporterflt != '' && req.query.reporterflt != undefined) {
                sql += ' `reporter_id` = (select user_id from user where email = \'' + req.query.reporterflt + '\' ) and';
            }
            if (req.query.statusflt != '' && req.query.statusflt != undefined) {
                sql += ' `status_id` = ' + req.query.statusflt + ' and';
            }
            if (req.query.approvedflt != '' && req.query.approvedflt != undefined) {
                sql += ' `approved` = \'' + req.query.approvedflt + '\' and';
            }
            if ((req.query.reporterflt != '' && req.query.reporterflt != undefined)
                || (req.query.statusflt != '' && req.query.statusflt != undefined)
                || (req.query.approvedflt != '' && req.query.approvedflt != undefined)) {
                sql = sql.substring(0, sql.length - 3);
            }
            sql += ' order by task_code;';
        }
            var con = req.db.driver.db;
            con.query(sql, function (err, rows) {
                if(err){
                    console.log(err);
                }
                else{

                    data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,tasks:rows,project:rows,type:req.session.type,assignee_email:req.session.email};
                    res.render('show_all_task',data);
                    /* var projectName ;
                     req.models.project.find({project_id:req.query.id},function(err, row1,next){
                         if(err){
                             console.log(err);
                         }
                         else{
                             projectName = row1[0].project_name;
                             data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,tasks:rows,project:row1,type:req.session.type};
                             res.render('show_all_task',data);
                         }
                     });*/


                }
            });


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
                var sql = 'select * from employee.status;';
                var con = req.db.driver.db;
                con.query(sql, function (err, rows) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        sql = 'select * from employee.refname;'

                        con.query(sql, function (err, row1s) {
                            if(err){
                                console.log(err);
                            }
                            else{

                                sql = 'select * from employee.activity;';
                                con.query(sql, function (err, row2s) {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        data={title:'Add task | '+req.session.firstname,
                                            fname:req.session.firstname,
                                            task_code:req.query.code+'-'+(parseInt(row1.length) + 1),
                                            creator : req.session.firstname + ' ' + req.session.lastname,
                                            creator_id : req.session.user_id,
                                            status : rows,
                                            type : req.session.type,
                                            user_id:req.session.user_id,
                                            refname : row1s,
                                            activities : row2s,
                                        };
                                        res.render('add_task',data);
                                    }
                                });
                            }

                        });
                    }




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
        create_time:parseInt(year+''+month+''+day),
        close_time:0,
        ref_id : parseInt(input.refname),
        activity_id : parseInt(input.activity)
    };
    console.log(data);
    if(input.action=="save"){
        req.models.task.create(data,function(err,rows){
            if(err){
                console.log(err);
            }
            else{
                console.log(err)
                date.setTime(date.getTime());
                var dataAction={
                    task_id : parseInt(rows.task_id),
                    update_time : date,
                    status_id : parseInt(input.status),
                    user_id : parseInt(req.session.user_id),
                    description:'Create Task'
                };
                req.models.action.create(dataAction,function(err,row1s){
                    if(err){
                        console.log(err);
                    }else{
                        var date2 = new Date();
                        /*date2.setTime(dataAction.update_time);*/
                        date2.setTime(date2.getTime())
                        console.log(date2.toString());
                    }
                });
            }

        });
    }
    else{

        if(req.session.type == 1){
            req.models.task.find({task_id:input.task_id},function(err, row1){
                if(err){
                    console.log(err);
                }
                else{
                    var con = req.db.driver.db;

                    var sql = 'UPDATE `employee`.`task` ' +
                        'SET ' ;
                    if(req.session.type == 1){
                        if(input.approved == 'D'){
                            sql+='`approved` = \'N\', ';
                            sql+='`assignee_id` = 0 ';
                        }else{
                            sql+='`approved` = \''+input.approved+'\', ';
                            sql+='`assignee_id` = '+input.assignee_id+' ';
                        }

                    }else{
                        sql+='`assignee_id` = '+input.assignee_id+' ';
                    }

                    if(row1[0].status_id != input.status){
                        sql += ',`status_id` = '+input.status+' ';
                        if(parseInt(input.status) == 5){
                            sql += ',`close_time` = '+parseInt(year+''+month+''+day)+' ';
                        }
                    }
                    if(input.estimate != undefined){
                        if(row1[0].estimate != input.estimate){
                            sql +=  ',`estimate` = '+input.estimate+' ';
                        }
                    }

                    temp1 = row1[0].description;
                    temp2 = input.description;
                    if(temp1 != temp2){
                        sql +=  ',`description` = \''+input.description+'\' ';
                    }

                    if(input.refname != undefined){
                        if(row1[0].ref_id != input.refname){
                            sql +=  ',`ref_id` = '+input.refname+' ';
                        }
                    }
                    if(input.activity != undefined){
                        if(row1[0].activity_id != input.activity){
                            sql +=  ',`activity_id` = '+input.activity+' ';
                        }
                    }

                    sql +=    ' WHERE `task`.`task_id` = '+input.task_id;
                    console.log(sql);
                    var con = req.db.driver.db;
                    con.query(sql, function (err, rows) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var temp1 = row1[0].approved;
                            var temp2 = input.approved;
                            if((temp1 != temp2)
                                && (req.session.type == 1)){
                                var content = 'Your task '+row1[0].task_code +' has ';
                                if(input.approved == 'Y'){
                                    content += 'been Approved. '
                                }else{
                                    content += 'not been Approved. '
                                }
                                const option = {
                                    service: 'gmail',
                                    auth: {
                                        user: 'huyt71@gmail.com', // email hoặc username
                                        pass: '01663036577'
                                    }
                                };
                                var transporter = nodemailer.createTransport(option);

                                transporter.verify(function(error, success) {
                                    // Nếu có lỗi.
                                    if (error) {
                                        console.log(error);
                                    } else { //Nếu thành công.
                                        console.log('Kết nối thành công!');
                                        var mail = {
                                            from: 'huyt71@gmail.com', // Địa chỉ email của người gửi
                                            to: input.email, // Địa chỉ email của người gửi
                                            subject: 'ABC Comp Anouncement', // Tiêu đề mail
                                            text: content, // Nội dung mail dạng text
                                        };
                                        //Tiến hành gửi email
                                        transporter.sendMail(mail, function(error, info) {
                                            if (error) { // nếu có lỗi
                                                console.log(error);
                                            } else { //nếu thành công
                                                console.log('Email sent: ' + info.response);
                                            }
                                        });
                                    }
                                });
                            }

                            /*-------------------------------------------------*/
                            date.setTime(date.getTime());
                            var sqlInsAct = [];
                            if(row1[0].assignee_id != input.assignee_id){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Assignee to '+input.realname+'\');'+'\n');
                            }
                            if(input.estimate != undefined){
                                temp1 = parseInt(row1[0].estimate);
                                temp2 = parseInt(input.estimate);
                                if(temp1 != temp2){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Estimate to '+input.estimate+'\');'+'\n');
                                }
                            }

                            /*temp1 = row1[0].log_work;
                            temp2 = input.log;
                            if(temp1 != temp2){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Log Work to '+input.log+'\');'+'\n');
                            }*/
                            temp1 = row1[0].description;
                            temp2 = input.description;
                            if(temp1 != temp2){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Description to '+input.description+'\');'+'\n');
                            }
                            if(req.session.type == 1){
                                temp1 = row1[0].approved;
                                temp2 = input.approved;
                                if(temp1 != temp2){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Approved to '+input.approved+'\');'+'\n');
                                }
                            }
                            if(row1[0].status_id != input.status){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Status to '+input.sttdesc+'\');'+'\n');
                            }
                            if((parseInt(row1[0].ref_id) != parseInt(input.refname))){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',(select CONCAT(\'Change Refname to \',description) as result from refname where ref_id =  '+input.refname+'));'+'\n');
                            }
                            if(parseInt(row1[0].activity_id) != parseInt(input.activity)){
                                sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                    'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',(select CONCAT(\'Change Activity to \',description) as result from activity where activity_id =  '+input.activity+'));'+'\n');
                            }
                            for (var i = 0; i < sqlInsAct.length; i++) {
                                con.query(sqlInsAct[i], function (err, row1s) {
                                    if(err){
                                        console.log(err + sqlInsAct);
                                    }
                                    else {

                                    }
                                });
                            }

                        }
                    });



                }
            });
        }else{
            if(input.assignee_id == req.session.user_id){
                req.models.task.find({task_id:input.task_id},function(err, row1){
                    if(err){
                        console.log(err);
                    }
                    else{
                        var con = req.db.driver.db;

                        var sql = 'UPDATE `employee`.`task` ' +
                            'SET ' ;
                        if(req.session.type == 1){
                            if(input.approved == 'D'){
                                sql+='`approved` = \'N\', ';
                                sql+='`assignee_id` = 0 ';
                            }else{
                                sql+='`approved` = \''+input.approved+'\', ';
                                sql+='`assignee_id` = '+input.assignee_id+' ';
                            }

                        }else{
                            sql+='`assignee_id` = '+input.assignee_id+' ';
                        }

                        if(row1[0].status_id != input.status){
                            sql += ',`status_id` = '+input.status+' ';
                            if(parseInt(input.status) == 5){
                                sql += ',`close_time` = '+parseInt(year+''+month+''+day)+' ';
                            }
                        }
                        if(input.estimate != undefined){
                            if(row1[0].estimate != input.estimate){
                                sql +=  ',`estimate` = '+input.estimate+' ';
                            }
                        }

                        temp1 = row1[0].description;
                        temp2 = input.description;

                        if(input.refname != undefined){
                            if(row1[0].ref_id != input.refname){
                                sql +=  ',`ref_id` = '+input.refname+' ';
                            }
                        }
                        if(input.activity != undefined){
                            if(row1[0].activity_id != input.activity){
                                sql +=  ',`activity_id` = '+input.activity+' ';
                            }
                        }
                        if(temp1 != temp2){
                            sql +=  ',`description` = \''+input.description+'\' ';
                        }

                        sql +=    ' WHERE `task`.`task_id` = '+input.task_id;
                        console.log(sql);
                        var con = req.db.driver.db;
                        con.query(sql, function (err, rows) {
                            if(err){
                                console.log(err);
                            }
                            else {
                                var temp1 = row1[0].approved;
                                var temp2 = input.approved;
                                if((temp1 != temp2)
                                    && (req.session.type == 1)){
                                    var content = 'Your task '+row1[0].task_code +' has ';
                                    if(input.approved == 'Y'){
                                        content += 'been Approved. '
                                    }else{
                                        content += 'not been Approved. '
                                    }
                                    const option = {
                                        service: 'gmail',
                                        auth: {
                                            user: 'huyt71@gmail.com', // email hoặc username
                                            pass: '01663036577'
                                        }
                                    };
                                    var transporter = nodemailer.createTransport(option);

                                    transporter.verify(function(error, success) {
                                        // Nếu có lỗi.
                                        if (error) {
                                            console.log(error);
                                        } else { //Nếu thành công.
                                            console.log('Kết nối thành công!');
                                            var mail = {
                                                from: 'huyt71@gmail.com', // Địa chỉ email của người gửi
                                                to: input.email, // Địa chỉ email của người gửi
                                                subject: 'ABC Comp Anouncement', // Tiêu đề mail
                                                text: content, // Nội dung mail dạng text
                                            };
                                            //Tiến hành gửi email
                                            transporter.sendMail(mail, function(error, info) {
                                                if (error) { // nếu có lỗi
                                                    console.log(error);
                                                } else { //nếu thành công
                                                    console.log('Email sent: ' + info.response);
                                                }
                                            });
                                        }
                                    });
                                }

                                /*-------------------------------------------------*/
                                date.setTime(date.getTime());
                                var sqlInsAct = [];
                                if(row1[0].assignee_id != input.assignee_id){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Assignee to '+input.realname+'\');'+'\n');
                                }
                                if(input.estimate != undefined){
                                    temp1 = parseInt(row1[0].estimate);
                                    temp2 = parseInt(input.estimate);
                                    if(temp1 != temp2){
                                        sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                            'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Estimate to '+input.estimate+'\');'+'\n');
                                    }
                                }

                                /*temp1 = row1[0].log_work;
                                temp2 = input.log;
                                if(temp1 != temp2){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Log Work to '+input.log+'\');'+'\n');
                                }*/
                                temp1 = row1[0].description;
                                temp2 = input.description;
                                if(temp1 != temp2){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Description to '+input.description+'\');'+'\n');
                                }
                                if(req.session.type == 1){
                                    temp1 = row1[0].approved;
                                    temp2 = input.approved;
                                    if(temp1 != temp2){
                                        sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                            'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Approved to '+input.approved+'\');'+'\n');
                                    }
                                }
                                if(row1[0].status_id != input.status){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',\'Change Status to '+input.sttdesc+'\');'+'\n');
                                }
                                if(parseInt(row1[0].ref_id) != parseInt(input.refname)){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',(select CONCAT(\'Change Refname to \',description) as result from refname where ref_id =  '+input.refname+'));'+'\n');
                                }
                                if(parseInt(row1[0].activity_id) != parseInt(input.activity)){
                                    sqlInsAct.push('INSERT INTO `employee`.`action`(`task_id`,`update_time`,`status_id`,`user_id`,`description`)\n' +
                                        'VALUES('+input.task_id+',\''+date.toString()+'\','+row1[0].status_id+','+req.session.user_id+',(select CONCAT(\'Change Activity to \',description) as result from activity where activity_id =  '+input.activity+'));'+'\n');
                                }
                                for (var i = 0; i < sqlInsAct.length; i++) {
                                    con.query(sqlInsAct[i], function (err, row1s) {
                                        if(err){
                                            console.log(err + sqlInsAct);
                                        }
                                        else {

                                        }
                                    });
                                }

                            }
                        });



                    }
                });
            }else{
                res.redirect('/');
            }
        }



    }
    res.redirect('/show-task?id='+input.project_id);
};
//edit task
module.exports.edit_task=function(req,res){
    if(req.session.type == 1){
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
            '    `task`.`ref_id`,\n' +
            '    `task`.`activity_id`,\n' +
            '    `action`.`update_time`,\n' +
            '    `action`.`description` as action_description,\n' +
            '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
            '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
            '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
            '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
            '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
            '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
            '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email,\n' +
            '    (select firstname from user where user_id = `action`.`user_id`) as userfirstname,\n' +
            '    (select lastname from user where user_id = `action`.`user_id`) as userlastname,\n' +
            '    (select email from user where user_id = `action`.`user_id`) as useremail \n' +
            'FROM `employee`.`task` join `employee`.`action` on `task`.`task_id` = `action`.`task_id` where `task`.`task_id` ='+ req.query.id + ';';
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
                        sql = 'select * from refname;'
                        con.query(sql, function (err, rowRef) {
                            if(err){
                                console.log(err);
                            }
                            else{
                                sql = 'select * from activity;'
                                con.query(sql, function (err, rowAct) {
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        data={title:'Tasks | '+req.session.firstname
                                            ,fname:req.session.firstname
                                            ,lname:req.session.lastname
                                            ,tasks:rows,status:row2s
                                            ,type:req.session.type
                                            ,userid:req.session.user_id
                                            ,refname:rowRef
                                            ,activity:rowAct};
                                        res.render('edit_task',data);
                                    }
                                });
                            }
                        });


                    }
                });


            }
        });
    }else{
        var sqlCheck = 'select * from task where task_id = '+req.query.id+';'
        var con = req.db.driver.db;
        con.query(sqlCheck, function (err, row1s) {
            if(err){
                console.log(err);
            }
            else{
                if(row1s.length > 0){
                    if((row1s[0].assignee_id == req.session.user_id)
                        || (row1s[0].assignee_id == 0)){
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
                            '    `task`.`ref_id`,\n' +
                            '    `task`.`activity_id`,\n' +
                            '    `action`.`update_time`,\n' +
                            '    `action`.`description` as action_description,\n' +
                            '    (select description from status where status_id = `task`.`status_id`) as status,\n' +
                            '    (select firstname from user where user_id = `task`.`reporter_id`) as reporter_firstname,\n' +
                            '    (select lastname from user where user_id = `task`.`reporter_id`) as reporter_lastname,\n' +
                            '    (select firstname from user where user_id = `task`.`assignee_id`) as assignee_firstname,\n' +
                            '    (select lastname from user where user_id = `task`.`assignee_id`) as assignee_lastname,\n' +
                            '    (select email from user where user_id = `task`.`assignee_id`) as assignee_email,\n' +
                            '    (select email from user where user_id = `task`.`reporter_id`) as reporter_email,\n' +
                            '    (select firstname from user where user_id = `action`.`user_id`) as userfirstname,\n' +
                            '    (select lastname from user where user_id = `action`.`user_id`) as userlastname,\n' +
                            '    (select email from user where user_id = `action`.`user_id`) as useremail \n' +
                            'FROM `employee`.`task` join `employee`.`action` on `task`.`task_id` = `action`.`task_id` where `task`.`task_id` ='+ req.query.id + ';';
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
                                        sql = 'select * from refname;'
                                        con.query(sql, function (err, rowRef) {
                                            if(err){
                                                console.log(err);
                                            }
                                            else{
                                                sql = 'select * from activity;'
                                                con.query(sql, function (err, rowAct) {
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    else{
                                                        data={title:'Tasks | '+req.session.firstname
                                                            ,fname:req.session.firstname
                                                            ,lname:req.session.lastname
                                                            ,tasks:rows,status:row2s
                                                            ,type:req.session.type
                                                            ,userid:req.session.user_id
                                                            ,refname:rowRef
                                                            ,activity:rowAct};
                                                        res.render('edit_task',data);
                                                    }
                                                });
                                            }
                                        });


                                    }
                                });


                            }
                        });
                    }else{
                        res.redirect('/')
                    }
                }else{
                    res.redirect('/');
                }


            }
        });
    }

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