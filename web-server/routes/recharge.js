var Url = require('url');
var filter = require('../util/filter');
var path = require('path');
var _ = require('underscore');

var recharge = function(app) {

    app.get('/admin/recharge', filter.authorize, function(req, res) {
        res.render('recharge', {
            menu: 'recharge',
            title: '后台充值',
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
};

module.exports = recharge;