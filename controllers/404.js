exports.get404=(req,res,next)=>{
    res.status(404).render('404',{pagetitle:'Not Found!',pageTitle:"Not Found",path:'/404'})
}