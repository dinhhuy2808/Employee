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
    req.models.task.find({project_id:req.query.id},function(err, rows,next){
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
                    data={title:'Tasks | '+req.session.firstname,fname:req.session.firstname,tasks:rows,project:row1};
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
        data={title:'Add task | '+req.session.firstname,
				fname:req.session.firstname,
				task_code:req.query.code+'-'+(parseInt(req.query.tasksize) + 1),
				creator : req.session.firstname + ' ' + req.session.lastname,
                creator_id : req.session.user_id
		};
        res.render('add_task',data);
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
        status_id : 0,
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
            }

        });
    }
    else{
        req.models.task.get(input.id,function(err,rows){
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
    res.redirect('/show-task?id='+input.project_id);
};
//edit task
module.exports.edit_task=function(req,res){
    req.models.todo.find({id:req.params.id},function(err,rows){
        if(err){
            console.log(err);
        }
        else{
            data={title:'Edit todo | '+req.session.fname,fname:req.session.fname,todo:rows};
            res.render('edit_todo',data);
        }
    });
};
//delete task
module.exports.delete_task=function(req,res){
    req.models.todo.find({id:req.params.id}).remove(function(err){
        if(err){
            console.log(err);
        }
        else{
        }
        res.redirect('/');
    });
};