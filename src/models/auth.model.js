import mongoose from "mongoose";


const oneTraceAdmin = mongoose.Schema({


    username:{

        type:String,
        required:true
    },
    password:{

        type:String,
        required:true

    }

})




const LoginData = mongoose.model('loginData', oneTraceAdmin);

export default LoginData;
