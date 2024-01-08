const Member = require("../model/member");
const Role   = require("../model/role");
const Community = require("../model/community");
const User = require("../model/user");
const { Snowflake } = require("@theinternetfolks/snowflake");
const jwt = require("jsonwebtoken");


const Add = async(req,res)=>{
    try{
        // const { community , user ,role } = req.body;
        const community = await Community.findOne({_id: req.body.community});
        const {id} = jwt.decode(req.cookies.auth);
        const owner = await User.findOne({ _id: id });

        if(!community)
        {
            res.status(400).json({
                status: false,
                errors: [
                  {
                    param: "community",
                    message: "Community not found.",
                    code: "RESOURCE_NOT_FOUND"
                  }
                ]
              });
            return;
        }

        if(community.owner === owner._id)
        {
            // User is authorized
            const user = await User.findOne({_id: req.body.user});
            const role = await Role.findOne({_id: req.body.role});

            if(!user)
            {
                res.status(400).json({
                    status: false,
                    errors: [
                      {
                        param: "user",
                        message: "User not found.",
                        code: "RESOURCE_NOT_FOUND"
                      }
                    ]
                  });

                  return;
            }

            if(!role)
            {
                res.status(400).json({
                    status: false,
                    errors: [
                      {
                        param: "role",
                        message: "Role not found.",
                        code: "RESOURCE_NOT_FOUND"
                      }
                    ]
                  });

                  return;
            }


            // So now , community exist, role exists and user also exists
            // but, what if the user is already member of that community

            const member = await Member.findOne({
                community: req.body.community,
                user: req.body.user,
            });

            if(member)
            {
                res.status(400).json({
                    status: false,
                    errors: [
                      {
                        message: "User is already added in the community.",
                        code: "RESOURCE_EXISTS"
                      }
                    ]
                  })
            }else{


                // Now you are good to procees...
                // Adding new member to community

                const newMember = new Member({
                    _id: Snowflake.generate(),
                    community: req.body.community,
                    user: req.body.user,
                    role: req.body.role,
                });

                await newMember.save();
                res.status(201).json({
                    status: true,
                    content:{
                        data: newMember,
                    }
                });
            }

        }else{
            // User is not authorized

            res.status(400).json({
                status: false,
                errors: [
                  {
                    message: "You are not authorized to perform this action.",
                    code: "NOT_ALLOWED_ACCESS"
                  }
                ]
            });

        }

    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({
            status: true,
            errors:[
                {
                    message:"Something went really bad.",
                    code:"SERVER_ERROR",
                }
            ]
        });
    }
}


const Delete = async(req,res)=>{
    try{
        const {id} = req.params;
        const payload = jwt.decode(req.cookies.auth);
        
        const member = await Member.findOne({ _id: id });

        if(!member)
        {
          res.status(400).json({
            status: false,
            errors:[
              {
                message: "Member not found.",
                code: "RESOURCE_NOT_FOUND",
              }
            ]
          });
          return;
        }

        const community = await Community.findOne({ _id: member.community });
        const user = await User.findOne({ _id: payload.id });

        if(community.owner == user._id)
        {
            // User is authorized
            await Member.deleteOne({_id: id});
            await Role.deleteOne({_id: member.role });
            res.status(200).json({
              status: true,
            });

        }else{
            res.status(401).json({
                status: false,
                errors: [
                  {
                    message: "You are not authorized to perform this action.",
                    code: "NOT_ALLOWED_ACCESS"
                  }
                ]
              })
        }

        
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: false,
            errors:[
                {
                    message:"Something went really bad.",
                    code:"SERVER_ERROR",
                }
            ]
        });
    }
}


module.exports = {
    Add,
    Delete 
}