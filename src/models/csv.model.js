// models/BugData.js

import mongoose from 'mongoose';

const bugDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // required field
  },
  teamname: {
    type: String,
    required: true, // required field
  },

  courses:[

    {  
        _id:mongoose.Schema.Types.ObjectId,
        courseName:{

        type:String,
        required:true
        }

    }
  ],

  activities:[

    {
        _id:mongoose.Schema.Types.ObjectId,
    activityName:{
        type:String,
        required:true
    }

}

  ],

  bugs: [
    {
      bugid: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      severity: {
        type: String,
        required: true,
      },
      createdDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

const BugData = mongoose.model('BugData', bugDataSchema);

export default BugData;
