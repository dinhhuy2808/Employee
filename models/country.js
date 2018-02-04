module.exports = function (orm, db) {
    db.define('country', {
        country_id: {type: 'number',key : true, autoPK: true},
        name: {type: 'text'}
    });
};
