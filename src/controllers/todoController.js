const todoModel = require('../models/todoModel')
const {isValid, isValidObjectId, regexTitle} = require('../validations/validation')

const createTodo = async function(req, res){
    try {
        let data = req.body
        let {userId, title, description, status, isDeleted} = data

        if (!isValid(userId)) {
            return res.status(400).send({ status: false, msg: "please provide userId" })
        }
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "please provide valid userId" })
        }
        let decodedId = req.token.userId
        if (decodedId !== userId) {
            return res.status(403).send({ status: false, msg: "unauthorised access" })
        }
        let checkUser = await userModel.findById(userId)
        if (!checkUser) return res.status(404).send({ status: false, msg: "userId not found" })

        if(!isValid(title)){
            return res.status(400).send({status: false, message: "please provide title in proper format"})
        }
        if(!regexTitle.test(title)){
            return res.status(400).send({status: false, message: "please provide valid title"})
        }

        if(!isValid(description)){
            return res.status(400).send({status: false, message: "please provide description in proper format"})
        }

        if(!isValid(status) || status != "pending" && status != "in progress" && status != "completed"){
            return res.status(400).send({status: false, message: "please provide status in pending, in progress, completed"})
        }

        if(isDeleted == true){
            return res.status(400).send({status: false, message: "you delete the list at the time of creation"})
        }

        const todo = await todoModel.create(data)
        return res.status(201).send({status: true, message: "ToDo List", data: data})

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}


const readTodo = async function(req, res){
    try {
        let data = req.params.userId
        const todo = await todoModel.find(data)
        if(!todo){
            return res.status(404).send({status: false, message: "user not found"})
        }
        return res.status(200).send({status: true, message: "your todo list", data: todo})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

const updateTodo = async function(req, res){
    try {
        let id = req.params.userId
        let data = req.body

        let decodedId = req.token.userId
        if (decodedId !== id) {
            return res.status(403).send({ status: false, msg: "unauthorised access" })
        }

        const checkTodo = await todoModel.findOne({id})
        if(!checkTodo){
            return res.status(404).send({status: false, message: "list not found"})
        }

        if(checkTodo.status == "completed"){
            return res.status(400).send({status: false, message: "task is already completed"})
        }
        
        if(checkTodo.status == "pending"){
            if(data == "completed"){
                const updateList = await todoModel.findOneAndUpdate({userId: id}, {$set: data}, {new: true})
                return res.status(200).send({status: true, message: "todo list is updated", data: updateList})
            }else{
                return res.status(400).send({status: false, message: "either task is completed"})
            }
        }
        if(checkTodo.status == "in progress"){
            if(data == "completed"){
                const updatedList = await todoModel.findOneAndUpdate({userId: id}, {$set: data}, {new: true})
                return res.status(200).send({status: true, message: "todo list is updated", data: updatedList})
            }else{
                return res.status(400).send({status: false, message: "either task is completed"})
            }
        }
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

const deleteTodo = async function(req, res){
    try {
        let id = req.params.userId

        let decodedId = req.token.userId
        if (decodedId !== id) {
            return res.status(403).send({ status: false, msg: "unauthorised access" })
        }

        const checkList = await todoModel.findOne({userId: id, isDeleted: false})
        if(!checkList){
            return res.status(404).send({status: false, message: "todo list not found"})
        }
        const deleteList = await todoModel.findOneAndUpdate({userId: id}, {$set: {isDeleted: true}})
        return res.status(200).send({status: true, message: "todo list deleted successfully"})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}


module.exports = {createTodo, readTodo, updateTodo, deleteTodo}
