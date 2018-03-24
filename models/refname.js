module.exports = function (orm, db) {
    db.define('refname', {
        ref_id: {type: 'number',key : true, autoPK: true},
        description: {type: 'text'}
    });
};
