import { Router } from 'express';
import {
  createProductController,
  listAllProductsController,
  unlistProductController,
  listProductController,
  listAllProductToSellerController,
  listProductByIdController,
  updateProductController,
  deleteProductController,
} from '../controllers/product.controller.js';
import {
  createProductValidator,
  unlistProductValidator,
  listProductValidator,
  updateProductValidator,
  deleteProductValidator,
  
} from '../validators/product.validator.js';
import {
  authenticate,
  authenticateSeller,
} from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.config.js';
const router = Router();

/*
//* @route   POST /api/products
* @desc    Create a new product 
* store image in image kit 
*/
router.post(
  '/',
  authenticate,
  authenticateSeller,
  upload.array('images'),
  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
  },
  createProductValidator,
  createProductController
);

/**
 * get all products
 * /api/product
 * access: public
 */

router.get('/', authenticate, listAllProductsController);

router.get('/:id', authenticate, listProductByIdController);

/**
 * get all products
 * /api/product
 * user:seller
 * all products of seller
 */
router.get(
  '/seller',
  authenticate,
  authenticateSeller,
  listAllProductToSellerController
);
/**
 * method: patch
 * /api/products/unlist/:id
 * acess: private
 * description: unlist a product by its id
 */
router.patch(
  '/unlist/:id',
  authenticate,
  authenticateSeller,
  unlistProductValidator,
  unlistProductController
);

router.patch(
  '/list/:id',
  authenticate,
  authenticateSeller,
  listProductValidator,
  listProductController
);


router.put(
  '/update/:id',
  authenticate,
  authenticateSeller,
  upload.array('images'),
  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
  }
  ,
  updateProductValidator,
  updateProductController
);


router.delete(
  '/delete/:id',
  authenticate,
  authenticateSeller,
  deleteProductValidator,
  deleteProductController
);
export default router;
