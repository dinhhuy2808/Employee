module.exports = function (orm, db) {
    db.define('task', {
        task_id: {type: 'number',key : true, autoPK: true},
        project_id: {type: 'number'},
        create_time: {type: 'number'},
        approved: {type: 'text'},
        status_id: {type: 'number'},
        assignee_id: {type: 'number'},
        estimate: {type: 'number'},
        log_work: {type: 'text'},
        description: {type: 'text'},
        reporter_id: {type: 'number'},
        task_code: {type: 'text'},
        close_time: {type: 'number'},
        ref_id: {type: 'number'},
        activity_id: {type: 'number'},
        bill_date: {type: 'number'}
    });
};
