const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  users: {
    type: String,
    required: true,
    trim: true,
  },
  id:{
      type:Number,
      required:true,
      unique:true
  },
  email: {
    type: String,
    unique: true,
    default: true,
    trim: true,
    lowercase: true,
    minlength: 7,
    validate(value) {
      if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/))
        throw "email is error";
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value) {
      if (!value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*]){2}/))
        throw "invalid password";
    },
  },
  age: {
    type: Number,
    default: 0,
    min: 0,
  },
  task:
  {
    type: [Number],
    //toString:true,
    default: [],
    unique:true
  }
});

module.exports = mongoose.model("user", userSchema);
