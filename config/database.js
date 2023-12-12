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
//Here we connect all the database
module.exports = {
    url: process.env.DB_URL+process.env.USER_NAME+":"+process.env.PASSWORD+process.env.CLUSTER+process.env.DB,
    secret: "secret"
}
