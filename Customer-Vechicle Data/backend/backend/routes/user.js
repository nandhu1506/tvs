const express = require('express');
const { registerUser, loginUser, getUsers, getProfile, updateProfile } = require('../controllers/userController');
const router = express.Router()
const authenticate = require('../middleware/auth')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/view',getUsers)
router.get('/profile', authenticate,getProfile)
router.put('/profile/update', authenticate , updateProfile)

module.exports = router;    