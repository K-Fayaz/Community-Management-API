const Validator = require("validatorjs");
const jwt       = require("jsonwebtoken");
const User      = require("../model/user");
const Community = require("../model/community");
const { Snowflake } = require("@theinternetfolks/snowflake");
const { Mate } = require("@theinternetfolks/mate");
const Role = require("../model/role");
const Member = require("../model/member");


const Create = async(req,res)=>{
    try{
        const { name } = req.body;
        const { auth } = req.cookies;

        const validation = new Validator(req.body,{
            name: "required|min:2",
        });

        if(validation.passes())
        {
            // Name is valid
            
            // check if there is already a community with given name ?
            const oldCommunity = await Community.findOne({ slug: Mate.toSlug(name) });
            
            if(!oldCommunity)
            {
                // Who is the owner ?
                console.log(auth)
                const { id } = jwt.verify(auth,process.env.SECRET_KEY);
                const owner  = await User.findOne({_id: id});
    
                let details = {
                    _id: Snowflake.generate(),
                    name: name,
                    slug: Mate.toSlug(name),
                    owner: owner.id,
                };
    
                const community = new Community(details);

                const role = new Role({ _id: Snowflake.generate() , name: 'Community Admin' });
                const member = new Member({ 
                    _id: Snowflake.generate(), 
                    community: community._id,
                    user: owner._id,
                    role: role._id,
                });

                await community.save();
                await role.save();
                await member.save();
    
                res.status(201).json({
                    status: true,
                    content: {
                        data:{
                            id: community._id,
                            name: community.name,
                            slug: community.slug,
                            owner: community.owner,
                            created_at: community.created_at,
                            updated_at: community.updated_at,
                        }
                    }
                });
            }else{
                // there is already a community with the given name ...
                res.status(400).json({
                    status: false,
                    errors:[
                        {
                            message:"There is already a Community with this name.",
                            code: "RESOURCE_EXISTS",
                        }
                    ]
                });
            }



        }else{
            // Validation failed!!

            res.status(400).json({
                status: false,
                errors:[
                    {
                        param:"name",
                        message: "Name should be atleast 2 charecters.",
                        code:"INVALID_INPUT",
                    }
                ]
            });
        }

    }
    catch(err){
        console.log(err);
        res.status(400).json({
            status: false,
            errors:[
                {
                    message: "Something went really bad.",
                    code: "SERVER_ERROR",
                }
            ]
        });
    }
}


const GetAll = async(req,res)=>{
    try{

        const communities = await Community.find({}).populate({path: 'owner'});
        console.log("Total length is ",communities.length)
        
        let data = [];

        communities.forEach((item)=>{
            data.push({
                id: item._id,
                name: item.name,
                slug: item.slug,
                owner:{
                    id: item.owner._id,
                    name: item.owner.name,
                },
                created_at: item.created_at,
                updated_at: item.updated_at
            });
        });
        
        let response =  {
            status: true,
            content:{
                meta:{
                    total: communities.length,
                    pages: (communities.length % 10 == 0 ? Math.floor(communities.length/10) : (Math.floor(communities.length/10))+1),
                    page: 1,
                },
                data
            }
        };

        res.status(200).json(response);

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            status: true,
            errors:[
                {
                    message: "Something Went Really bad",
                    code:"SERVER_ERROR",
                }
            ]
        });
    }
}


const GetMyOwnedCom = async(req,res)=>{
    try{

        const { auth } = req.cookies;
        if(auth)
        {

            const payload = jwt.decode(auth);
            let user = await User.findOne({_id: payload.id});
            const communities = await Community.find({ owner: user._id });

            let response = {
                status: true,
                content:{
                    meta:{
                        total: communities.length,
                        pages: (communities.length % 10 == 0 ? (Math.floor(communities.length/10)) : (Math.floor(communities.length/10)+1)),
                        page: 1
                    },
                    data:(communities.length <= 10 ? communities : communities.slice(0,10))
                }
            };

            res.status(200).json(response);
        }else{
            res.status(400).json({
                status: false,
                erorrs:[
                    {
                        message: "You need to sign in to proceed.",
                        code: "NOT_SIGNEDIN",
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
                    message:"Something went really bad",
                    code: "SERVER_ERROR",
                }
            ]
        });
    }
}


const GetMembers = async(req,res)=>{
    try{
        const { id } = req.params;
        const community = await Community.findOne({_id: id});

        if(!community)
        {
            res.status(400).json({
                status: false,
                errors:[
                    {
                        param: "community",
                        message: "Community not found.",
                        code: "RESOURCE_NOT_FOUND"
                    }
                ]
            })
            return;
        };

        const payload = jwt.decode(req.cookies.auth);
        const owner   = await User.findOne({_id: payload.id});

        // if(community.owner === owner._id || )
        let my_member = false;
        let member_exists = false;

        const members = await Member
                                .find({ community: community._id })
                                .populate('role')
                                .populate('user');
        
        let data = [];
        members.forEach((item)=>{
            let obj = { ...item._doc };
            obj.role = {
                id: item.role._id,
                name: item.role.name,
            };

            obj.user = {
                id: item.user._id,
                name: item.user.name,
            }

            data.push(obj);
        });

        // check if the logged In user ("owner" above) is a member of community
        for(let i = 0; i < members.length; i++)
        {
            if(members[i].user._id == owner._id )
            {
                my_member = true; // if so then set my_member to be true
                break;
            }
        }

        if(community.owner == owner._id || my_member)
        {
            res.status(200).json({
                status: true,
                content:{
                    meta:{
                        total: members.length,
                        pages: (members.length % 10 === 0 ? (Math.floor(members.length/10)) : (Math.floor(members.length/10)+1)),
                        page: 1,
                    },
                    data:(members.length <= 10 ? data : data.slice(0,10))
                }
            });
        }else{
            // User is neither a member nor is he an Admin
            res.status(400).json({
                status: false,
                errors:[
                    {
                        message: "You are not member of this community.",
                        code: "NOT_ALLOWED_ACCESS",
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
        })
    }
}


const GetMyJoinedComm = async(req,res)=>{
    try{

        const payload = jwt.decode(req.cookies.auth);
        const user = await User.findOne({_id: payload.id });
        if(user)
        {
            const members = await Member
                                    .find({ user: payload.id })
                                    .populate({
                                        path:'community',
                                        populate:{
                                            path:'owner',
                                            model:"User"
                                        }
                                    });
            let communities = [];
            members.forEach((item)=>{
                let obj = {...item.community._doc};
                obj.owner = {
                    id: item.community.owner._id,
                    name: item.community.owner.name,
                }
                communities.push(obj);
            });
    
            res.status(200).json({
                status: true,
                content:{
                    meta:{
                        total: communities.length,
                        pages: (communities.length % 10 == 0 ? (Math.floor(communities.length/10)) : (Math.floor(communities.length/10)+1)),
                        page: 1,
                    },
                    data: (communities.length <= 10 ? communities : communities.slice(0,10)),
                }
            });
        }else{
            res.status(400).json({
                status: false,
                errors:[
                    {
                        message: "User not found.",
                        code: "RESOURCE_NOT_FOUND",
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
            erros:[
                {
                    message:"Something went really bad.",
                    code: "SERVER_ERROR",
                }
            ]
        });
    }
}

module.exports = {
    Create,
    GetAll,
    GetMembers,
    GetMyOwnedCom,
    GetMyJoinedComm,
}