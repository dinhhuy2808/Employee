module.exports = function (orm, db) {
    db.define('project', {
        project_id: {type: 'number',key : true, autoPK: true},
        project_name: {type: 'text'},
        customer_id: {type: 'text'}
    });
};
