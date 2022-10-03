const { Router } = require('express');
const router = Router();

// Route information to connect API
router.get('/', function(req, res){res.status(200).json({ message: 'Connect to our API'})});


module.exports = router;