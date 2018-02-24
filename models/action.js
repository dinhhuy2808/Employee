module.exports = function (orm, db) {
    db.define('action', {
        id: {type: 'number',key : true, autoPK: true},
        task_id: {type: 'number'},
        update_time: {type: 'text'},
        status_id: {type: 'number'},
        user_id: {type: 'number'},
        description: {type: 'text'}
    });
};
