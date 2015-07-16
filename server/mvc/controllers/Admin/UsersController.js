exports.index = function(req, res){
  res.render('admin/users/index', {
    title: 'Users',
  });
};
