const express = require('express')
const router = express.Router()
const {createUser, loginUser} = require('../controllers/userController')
const {createTodo, readTodo, updateTodo, deleteTodo} = require('../controllers/todoController')
const {authentication} = require('../middleware/auth')

router.post('/createUser', createUser)
router.post('/loginUser', loginUser)

router.post('/createTodo', authentication, createTodo)
router.get('/readTodo', authentication, readTodo)
router.put('/updateTodo', authentication, updateTodo)
router.delete('/deleteTodo', authentication, deleteTodo)

module.exports = router;
