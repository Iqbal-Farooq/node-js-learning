module.exports=(req,res,next)=>{
    if(!req.session.isLoggedIn){
      console.log('NO AUTHENTICATED')
        return res.redirect('/login')
      }
      next();
}