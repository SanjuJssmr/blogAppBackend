module.exports = (req, res, next) => {
    if (req.session.isAuth) {
console.log(req.session)
      next();
    } else {
     return res.send({status:0, response:"You need to login in order to acces"})
    }
  };