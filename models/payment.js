module.exports = function (orm, db) {
    db.define('payment', {
        payment_id: {type: 'number',key : true, autoPK: true},
        user_id: {type: 'number'},
        salary: {type: 'text'}
    });
};
