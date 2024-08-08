const express = require('express');

const router = express.Router();

const BorrowController = require('../controllers/borrow.controller');
const authMiddleware = require('../controllers/auth.middleware');


router.post('/borrow', authMiddleware, BorrowController.requestToBorrow);
router.put('/borrow/:id', authMiddleware, BorrowController.updateRequestStatus);

router.get('/', authMiddleware, BorrowController.getBorrowingRequest);//change to owners requests
router.put('/return/:id', authMiddleware, BorrowController.returnBook);

module.exports = router;
