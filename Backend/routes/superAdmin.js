const router = require('express').Router();
const {
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/superAdminController');

const { protect, onlySuperAdmin } = require('../middleware/auth');

//Public
router.post('/login', login);

//Protected (token REQUIRED)
router.use(protect, onlySuperAdmin);

// Direct login
router.post('/login', login);

// CRUD for users
// router.get('/', getAllUsers);
// router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
