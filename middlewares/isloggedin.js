const jwt  = require("jsonwebtoken");


const isLoggedIn = async(req,res,next)=>{
    try{
        const { auth } = req.cookies;
        if(auth)
        {

            const verify = jwt.verify(auth,process.env.SECRET_KEY,(err,decode)=>{
                if(err)
                {
                    res.status(400).json({
                        staus: false,
                        errros:[
                            {
                                message: "Invalid Token.",
                                code:"NOT_SIGNEDIN",
                            }
                        ]
                    });
                }else{
                    next();
                }
            });
        }else{
            res.status(400).json({
                staus: false,
                errros:[
                    {
                        message: "You need to sign in to proceed.",
                        code:"NOT_SIGNEDIN",
                    }
                ]
            });
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            status: false,
            errors:[
                {
                    message: "Something went really bad.",
                    code: "SERVER_ERROR",
                }
            ]
        })
    }
}

module.exports = isLoggedIn;
