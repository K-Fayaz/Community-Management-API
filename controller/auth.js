const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const { Snowflake } = require("@theinternetfolks/snowflake");
const Validator = require("validatorjs");

const signup = async(req,res)=>{
    try{    
        const { name , email ,password } = req.body;

        // check if the user is already present in the database ?
        const user = await User.findOne({email});
        if(!user)
        {
            const validation = new Validator(req.body,{
                name: 'required|min:2',
                email: 'required|email',
                password: 'required|min:6'
            });

            if(validation.passes())
            {
                const newUser = new User;
                newUser._id = Snowflake.generate();
                newUser.name = name;
                newUser.email = email;
                const hashed = await bcrypt.hash(password,8);
                newUser.password = hashed;

                await newUser.save();

                const payload = {
                    id: newUser._id,
                    email: newUser.email,
                };

                const token = jwt.sign(payload,process.env.SECRET_KEY,{
                    expiresIn: '24h',
                });


                const response = {
                    status: true,
                    content:{
                        data: {
                            id: newUser._id,
                            name: newUser.name,
                            email: newUser.email,
                            created_at: newUser.created_at,
                        },
                        meta:{
                            access_token: token,
                        }
                    }
                };

                res.status(201).cookie('auth',token,{
                    httpOnly: true,
                    secure: true,
                    sameSite: 'lax',
                    maxAge: 1000*60*60*24,
                }).json(response);

            }else{
                let response = {
                    status: false,
                };

                let errors = [];
                if(validation.errors.first('name'))
                    errors.push({
                        param:'name',
                        message:"Name should be atleast 2 charecters.",
                        code:"INVALID_INPUT"
                    });
                
                if(validation.errors.first('email'))
                    errors.push({
                        param:"email",
                        message:"Email is invalid",
                        code: "INVALID_INPUT"
                    });
                
                if(validation.errors.first('password'))
                    errors.push({
                        param:"password",
                        message:"Password must be atleast 6 charecters.",
                        code: "INVALID_INPUT",
                    });
                
                response = {...response,errors};

                res.status(400).json(response);
            }
        }else{
            res.status(409).json({
                status: false,
                errors:[
                    {
                        param:"email",
                        message: "User with this email already exists.",
                        code: "RESOURCE_EXISTS",
                    }
                ]
            })
        }
    }
    catch(err)
    {
        res.status(520).json({
            status:false,
            errors:[
                {
                    message:"Something Went really bad.",
                    code: "SERVER_ERROR",
                }
            ]
        })
    }
}


const signin = async(req,res)=>{
    try{
        const { email , password } = req.body;

        // check email is valid or not
        const validation = new Validator({email: email},{
            email:'email|required',
        });

        if(validation.fails())
        {               
            // Validation failed
            res.status(400).json({
                status:false,
                errors:[
                    {
                        param:'email',
                        message: 'Please provide a valid email address.',
                        code: 'INVALID_INPUT',
                    }
                ]
            });

        }else{

            // Validation passed
            // check if there is a user with this email ?
            const user = await User.findOne({email: email});
            if(user)
            {

                const result = await bcrypt.compare(password,user.password);
                console.log(result);
                if(result)
                {
                    // create the token
                    const payload = {
                        id: user._id,
                        email: user.email,
                    };

                    const token = jwt.sign(payload,process.env.SECRET_KEY,{
                        expiresIn:'24h'
                    });

                    res.status(200).cookie('auth',token,{
                        httpOnly: true,
                        secure: true,
                        sameSite: 'lax',
                        maxAge: 1000*60*60*24,
                    }).json({
                        status: true,
                        content:{
                            data:{
                                id: user._id,
                                name: user.name,
                                email: user.email,
                                created_at: user.created_at,
                            },
                            meta:{
                                access_token: token,
                            }
                        }
                    });

                }else{

                    // User entered the wrong password here
                    res.status(401).json({
                        status: false,
                        errors:[
                            {
                                param:'password',
                                message: 'The crdentials you provided are invalid.',
                                code: "INVALID_CREDENTIALS",
                            }
                        ]
                    })

                }

            }else{
                res.status(404).json({
                    status: false,
                    errors:[
                        {
                            param:"email",
                            message: "No user exists with this email.",
                            code: "INVALID_CREDENTIALS",
                        }
                    ]
                })
            }
        }

        
    }
    catch(err)
    {
        console.log(err);
        res.status(520).json({
            status:false,
            errors:[
                {
                    message:"Something Went really bad",
                    code: "SERVER_ERROR",
                }
            ]
        })
    }
}


const getME = async(req,res)=>{
    try{

        const { auth } = req.cookies;
        if(auth)
        {
            const payload = jwt.decode(auth);
            
            const user = await User.findOne({email: payload.email});
            // console.log({...user._doc})

            res.status(200).json({
                status: true,
                content:{
                    data:{
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        created_at: user.created_at,
                    }
                }
            });

        }else{
            res.status(400).json({
                status: false,
                errors:[
                    {
                        message: "You need to sign in to proceed.",
                        code: "NOT_SIGNEDIN",
                    }
                ]
            });
        }
    }
    catch(err)
    {
        console.log(err);
        res.status(400).json({
            status: false,
            errors:[
                {
                    message: "Something Went really bad.",
                    code: "SERVER_ERROR",
                }
            ]
        })
    }
}

module.exports = {
    signup,
    signin,
    getME,
}