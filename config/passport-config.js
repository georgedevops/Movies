/**********************************************************************************
 * 
 *  ITE5315 – Project* I declare that this assignment is my own work in accordance with 
 * Humber Academic Policy.* No part of this assignment has been copied manually or electronically 
 * from any other source* (including web sites) or distributed to other students.** 
 * Group member 
 * Name:George Devid John Thekkineth__ Student IDs: _NO1547325___ 
 * Name:Keziah Thomas__ Student IDs: _N01541155___ 
 * Date: __12th December________************************************
 * *********************************************/
// Import required modules and packages
const bcrypt = require("bcrypt");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users");
const jwt = require("jsonwebtoken");

// Function to initialize passport authentication
function initialize(passport) {
  
  // Function to authenticate a user based on email and password
  const authenticateUser = async (email, password, done) => {
    let query = { email: email };
    let user = await User.findOne(query);
    console.log(user);
    console.log("tested")

    // Check if the user exists
    if (user == null) {
      return done(null, false, { message: "No user with that email" });
    }

    try {
      // Compare the provided password with the hashed password in the database
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  // Configure passport to use local strategy with email as the username field
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));

  // Serialize user information into a token
  passport.serializeUser((user, done) => {
    console.log("serilaing")
    done(null, user._id); 
  });

  // Deserialize user from the token
  passport.deserializeUser(async function (userId, done)  {
    try {
      const user = await User.findById(userId);

      console.log("deserilise")
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });
}




module.exports =  initialize;
