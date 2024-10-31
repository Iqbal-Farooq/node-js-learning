exports.get404=(req,res,next)=>{
    res.status(404).render('404',{pagetitle:'Not Found!',pageTitle:"Not Found",path:'/404'})
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'))
}