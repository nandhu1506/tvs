const express = require('express')

const { registerController, loginController, changePasswordController, getAllUsersController, forgotPasswordController, verifyOtpController, resetPasswordController } = require('../controllers/userController')

const { AddticketController, getAllTicketsController, viewTicketController, updateTicketController, replyTicketController, getProjectsController, exportTicketsController } = require('../controllers/ticketController')

const { jwtMiddleware } = require('../Middleware/jwtMiddleware')

const multer = require('../Middleware/multerMiddleware')

const router = new express.Router()

// register
router.post('/register',registerController)

// login
router.post('/login',loginController)

// password change
router.post("/change-password",jwtMiddleware,changePasswordController)

// forgot password
router.post("/forgot-password", forgotPasswordController);

// verify OTP
router.post("/verify-otp", verifyOtpController);

// reset password
router.post("/reset-password", resetPasswordController);

// Add Ticket
router.post("/addticket",jwtMiddleware, multer.array("attachments", 3),AddticketController);

// View All tickets
router.get("/tickets",jwtMiddleware, getAllTicketsController);

//  View ticket
router.get("/view/:id",jwtMiddleware, viewTicketController)

// update ticket
router.put("/view/:id", jwtMiddleware, updateTicketController);

// get all users
router.get("/users", jwtMiddleware, getAllUsersController);

// send replay by user
router.post("/ticket/reply", jwtMiddleware, multer.array("attachments"),replyTicketController );

// get project names
router.get("/projects",jwtMiddleware,getProjectsController)

// export excel
router.get("/export",jwtMiddleware,exportTicketsController);


module.exports = router