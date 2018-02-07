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
    req.models.project.find({project_id:req.params.id},function(err,rows){
        if(err){
            console.log(err);
        }
        else{
            data={title:'Edit Project | '+req.session.firstname,fname:req.session.firstname,project:rows};
            res.render('edit_project',data);
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
//edit todo
module.exports.edit_todo=function(req,res){
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
//delete todo
module.exports.delete_todo=function(req,res){
	req.models.todo.find({id:req.params.id}).remove(function(err){
		if(err){
			console.log(err);
			}
		else{
			}
		res.redirect('/');
		});
};
