import express from "express"
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controllers/product.controller.js"
import { upload, handleFileUpload } from '../middlewares/upload.js'
import { validate } from '../middlewares/validate.js'
import { addProductValidator, deleteProductValidator, getProductsValidator, updateProductValidator } from "../validators/product.validator.js"
const router = express.Router()

router.post("/addProduct", upload.single('image'), handleFileUpload, validate(addProductValidator), addProduct);
router.put("/updateProduct/:id", upload.single('image'), handleFileUpload, validate(updateProductValidator), updateProduct);
router.delete("/deleteProduct/:id", validate(deleteProductValidator), deleteProduct)
router.get("/getProducts",validate(getProductsValidator), getProducts)

export default router;