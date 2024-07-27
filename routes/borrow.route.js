const express = require('express');

const router = express.Router();

const BorrowController = require('../controllers/borrow.controller');
const authMiddleware = require('../controllers/auth.middleware');


router.post('/', authMiddleware, BorrowController.requestToBorrow);
router.put('/:id', authMiddleware, BorrowController.updateRequestStatus);
router.get('/', authMiddleware, BorrowController.getBorrowingRequest);
router.put('/return/:id', authMiddleware, BorrowController.returnBook);

module.exports = router;