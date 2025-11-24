const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
const {isValid, regexName, regexEmail, regexPassword} = require('../validations/validation')

const createUser = async function(req, res){
    try {
        let data = req.body
        let {name, email, password} = data

        if(Object.keys(data).length == 0){
            return res.status(400).send({status: false, message: "please provide some data to create user"})
        }

        if(!isValid(name)){
            return res.status(400).send({ status: false, msg: "please provide name in proper format" })
        }
        if (!regexName.test(name)) {
            return res.status(400).send({ status: false, msg: "please provide valid name" })
        }

        if(!isValid(email)){
            return res.status(400).send({status: false, message: "please provide email in proper format"})
        }
        if(!regexEmail.test(email)){
            return res.status(400).send({status: false, message: "please provide valid email"})
        }
        const duplicateEmail = await userModel.findOne({email})
        if(duplicateEmail){
            return res.status(400).send({status: false, message: "emailId is already registered please provide another emailId"})
        }

        if(!isValid(password)){
            return res.status(400).send({status: false, message: "please provide password in proper format"})
        }
        if(!regexPassword.test(password)){
            return res.status(400).send({status: false, message: "please provide valid password"})
        }

        let user = await userModel.create(data)
        return res.status(201).send({status: true, message: "user created successfully", data: user})

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

const loginUser = async function(req, res){
    try {
        let email = req.body.email
        let password = req.body.password

        if (Object.keys(req.body).length === 0) {
            return res.status(400).send({ status: false, msg: "please provide something to login" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, data: "please enter email" })
        }
        if (!regexEmail.test(email)) {
            return res.status(400).send({ status: false, data: "please enter valid email" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "please enter password" })
        }
        if (!regexPassword.test(password)) {
            return res.status(400).send({ status: false, data: "please enter valid password" })
        }

        const login = await userModel.findOne({ email: email, password: password })

        if (!login) {
            return res.status(404).send({ status: false, message: "email or password is incorrect" })
        } else {
            const token = jwt.sign({
                userId: login._id.toString(),
            }, "digital brain media", { expiresIn: '1d' });
            return res.status(200).send({ status: true, message: "your token", data: token })
        }
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {createUser, loginUser}