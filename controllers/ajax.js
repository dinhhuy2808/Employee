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
