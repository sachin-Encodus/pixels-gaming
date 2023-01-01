const express = require('express');
const router = express.Router();

// import controller
const {  adminMiddleware } = require('../../controllers/auth.controller');
const { readController, updateController } = require('../../controllers/user.controller');

router.get('/user/:id',  readController);
router.put('/user/update',  updateController);
router.put('/admin/update',  adminMiddleware, updateController);

module.exports = router;