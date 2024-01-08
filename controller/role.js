const Role = require("../model/role");
const Validator = require("validatorjs");
const { Snowflake } = require("@theinternetfolks/snowflake");

const Create = async(req,res)=>{
    try{
       const { name } = req.body;
       const validation = new Validator(req.body,{
            name: 'required|min:2',
       });

       if(validation.passes())
       {
           const role = new Role({ _id: Snowflake.generate() , name })
           await role.save();
    
           res.status(201).json({
                status: true,
                content:{
                    data:role,
                }
           });
       }else{
        
            res.status(400).json({
                status: false,
                errors:[
                    {
                        param: "name",
                        message: "Name should be at least 2 characters.",
                        code: "INVALID_INPUT"
                    }
                ]
            })
        
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
        });
    }
};


const Get = async(req,res)=>{
    try{

        const roles = await Role.find({});
        const response = {
            status: true,
            content:{
                meta:{
                    total: roles.length,
                    pages: (roles.length % 10 === 0 ? (roles.length/10) : (Math.floor(roles.length/10)+1)),
                    page: 1
                },
                data: (roles.length <= 10 ? roles : roles.slice(0,10)),
            }
        };

        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: false,
            erorrs:[
                {
                    message:"Something went really bad",
                    code: "SERVER_ERROR",
                }
            ]
        });
    }
}

module.exports = {
    Create,
    Get,
}