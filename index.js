require("dotenv").config();


require("./model/index")
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Routes Here
const authRoutes = require("./routes/auth");
const communityRoutes = require("./routes/community");
const roleRoutes = require("./routes/role");
const memberRoutes = require("./routes/member");

app.use("/v1/role",roleRoutes);
app.use('/v1/auth',authRoutes);
app.use('/v1/community',communityRoutes);
app.use("/v1/member",memberRoutes);


app.get('*',(req,res)=>{
    res.status(404).json({
        status: false,
        erorrs:[
            {
                message:"Content Not Found",
                code: "404"
            }
        ]
    })
})

const PORT = 8080;
app.listen(PORT,()=>{
    console.log("Listening to the PORT "+PORT);
})