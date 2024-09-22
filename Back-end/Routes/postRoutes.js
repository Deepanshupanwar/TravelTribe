const express = require('express')
const router = express.Router();
const {submit, searchByDate, searchByLocation, update, deletePost, getAll} = require('../Controllers/postController');
const {requireAuth} = require('../Middlewares/authMiddleware');


//some routes need params which will be added later on

router.post('/submit' ,requireAuth ,submit);
router.get('/get',getAll);
router.put('/edit',requireAuth ,update);
router.delete('/delete', requireAuth ,deletePost);
router.get('/searchByLocation', searchByLocation);
router.get('/searchByDate', searchByDate);

module.exports = router;