const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const todoModel = require('../models/todoModel')
const {isValidObjectId}= require('../validations/validation')


const authentication = async function(req, res, next){
    try {
        let token = req.header("x-api-key")
        if(!token){
            return res.status(404).send({status:false, msg: "Token must be present"})
        }
        jwt.verify(token, "digital brain media", (error, decodedToken) => {
            if (error) {
                return res.status(401).send({ status: false, data: "Token is Invalid" })
            }
            else {
                res.setHeader("x-api-key", token)
                req.token = decodedToken
                next()
            }
        })
        
    } catch (error) {
        return res.status(500).send({status: false, msg: error.message})
    }
}


// const authorisation = async function (req, res, next){
//     try {
//         let userId = req.params.userId
//         if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "Please Enter correct Book Id" })

//         let user = await todoModel.findById(userId)
//         if(!user){
//             return res.status(404).send({status: false, msg: "bookId not found"})
//         }
//         if(user){
//             if(req.token.userId != user.userId){
//                 return res.status(403).send({status: false, msg: "User is not authorized to access this data"})
//             }
//         }
//         next()
//     } catch (error) {
//         return res.status(500).send({status: false, msg: error.message})
//     }
// }

module.exports = {authentication}