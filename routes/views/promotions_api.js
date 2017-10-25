var keystone = require('keystone');
var Store = keystone.list('Store');
var Promotion = keystone.list('Promotion');
var _ = require('underscore');

module.exports.find_all = function(req, res) {
	console.log("holaaaaaaaaaaaaaaa")
	var page = req.params.page || 1,
	limit = req.params.limit || 10;

	Promotion
	.paginate({
		page: page,
		perPage: limit,
		maxPages: 100
	})
    .where({state: 'activo'})
    .populate('store')
    .exec(function(err, promotions) {
    	if (err) {
    		return res.status(500).json({error: err});
    	}
		return res.json(promotions);
    })
};
