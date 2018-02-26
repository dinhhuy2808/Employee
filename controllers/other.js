module.exports.export_excel=function(req,res){
	var nodeExcel=require('excel-export');
	var dateFormat = require('dateformat');
	var conf={}
	conf.cols=[{
			caption:'Project',
			type:'string',
			width:50
		},
		{
			caption:'Task',
			type:'string',
			width:10
		},
		{
			caption:'Assignee',
			type:'string',
			width:50
		},
        {
            caption:'Reporter',
            type:'String',
            width:50
        },
        {
            caption:'Approved',
            type:'String',
            width:50
        },
        {
            caption:'Status',
            type:'String',
            width:50
        }
		];

    var sql = 'select t.task_id,t.task_code,t.approved,\n' +
        '(select p.project_name from project p where p.project_id = t.project_id) as project,\n' +
        '(select u.firstname from user u where u.user_id = t.assignee_id) as assignee_fname,\n' +
        '(select u.lastname from user u where u.user_id = t.assignee_id) as assignee_lname,\n' +
        '(select u.firstname from user u where u.user_id = t.reporter_id) as reporter_fname,\n' +
        '(select u.lastname from user u where u.user_id = t.reporter_id) as reporter_lname,\n' +
        '(select s.description from status s where s.status_id = t.status_id) as status\n' +
        'from task t order by project,task_id';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            arr=[];
            arr.push(['','','','','','']);
            var temp = '';
            for(i=0;i<rows.length;i++){
            	var a;
            	if(temp != ''){
            		if(temp == rows[i].project){
                        a=['',rows[i].task_code,rows[i].assignee_fname==null?'':(rows[i].assignee_fname+' '+rows[i].assignee_lname),rows[i].reporter_fname==null?'':(rows[i].reporter_fname+' '+rows[i].reporter_lname),rows[i].approved,rows[1].status];
					}else{
                        a=[rows[i].project,rows[i].task_code,rows[i].assignee_fname==null?'':(rows[i].assignee_fname+' '+rows[i].assignee_lname),rows[i].reporter_fname==null?'':(rows[i].reporter_fname+' '+rows[i].reporter_lname),rows[i].approved,rows[1].status];
					}
				}else{
            		temp = rows[i].project == null?'':rows[i].project;
                    a=[rows[i].project,rows[i].task_code,rows[i].assignee_fname==null?'':(rows[i].assignee_fname+' '+rows[i].assignee_lname),rows[i].reporter_fname==null?'':(rows[i].reporter_fname+' '+rows[i].reporter_lname),rows[i].approved,rows[1].status];
				}

                arr.push(a);
            }
            conf.rows=arr;
            var result=nodeExcel.execute(conf);
            res.setHeader('Content-Type','application/vnd.openxmlformates');
            res.setHeader("Content-Disposition","attachment;filename="+"project.xlsx");
            res.end(result,'binary');
        }
    });

};

module.exports.export_excel_user=function(req,res){
    var nodeExcel=require('excel-export');
    var dateFormat = require('dateformat');
    var conf={}
    conf.cols=[{
            caption:'Name',
            type:'string',
            width:50
        },
        {
            caption:'Birth Date',
            type:'string',
            width:30
        },
        {
            caption:'Email',
            type:'string',
            width:50
        },
        {
            caption:'Phone',
            type:'String',
            width:50
        },
        {
            caption:'Salary',
            type:'String',
            width:50
        },
        {
            caption:'Created Date',
            type:'String',
            width:50
        },
        {
            caption:'Type',
            type:'String',
            width:50
        }
    ];

    var sql = 'select *,\n' +
        '(select t.description from type t where t.type_id = u.type_id) as type\n' +
        'from user u;';
    var con = req.db.driver.db;
    con.query(sql, function (err, rows) {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{
            arr=[];
            arr.push(['','','','','','','']);
            var temp = '';
            for(i=0;i<rows.length;i++){
                a=[rows[i].firstname+' '+rows[i].lastname,
                    rows[i].dob.toString().substring(6,8)+'/'+rows[i].dob.toString().substring(4,6)+'/'+rows[i].dob.toString().substring(0,4),
                    rows[i].email,
                    rows[i].phone,
                    rows[i].salary,
                    rows[i].create_time.toString().substring(6,8)+'/'+rows[i].create_time.toString().substring(4,6)+'/'+rows[i].create_time.toString().substring(0,4),
                    rows[i].type];
                arr.push(a);
            }
            conf.rows=arr;
            var result=nodeExcel.execute(conf);
            res.setHeader('Content-Type','application/vnd.openxmlformates');
            res.setHeader("Content-Disposition","attachment;filename="+"user.xlsx");
            res.end(result,'binary');
        }
    });

};
