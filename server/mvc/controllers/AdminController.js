exports.index = function(req, res){
  res.render('admin/index', {
    layout: {
      title: 'Admin',
    },
  });
};
