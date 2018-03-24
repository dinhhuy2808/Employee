module.exports = function (orm, db) {
    db.define('activity', {
        activity_id: {type: 'number',key : true, autoPK: true},
        description: {type: 'text'}
    });
};
