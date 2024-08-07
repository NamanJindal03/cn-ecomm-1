import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { v4 as uuidv4 } from 'uuid';
import { logger } from "../middlewares/custom_logger.js";
import { winstonLogger } from "../winston.logger.js";
function getAllProducts(req, res){
    console.log(req);
    const filters = req.query;
    logger(req.query);
    winstonLogger.info('first timer!! go easy');
    winstonLogger.error('rjrjogjewofe');
    let allProducts = []
    try{
        allProducts = Product.getAllProducts(filters);
    }
    catch(error){
        return res.status(500).json({status: false, error, message: 'something went wrong'})
    }
    return res.status(200).json({status: true, product: allProducts});
}

function getProduct(){

}

function addProduct(req, res){
    
    const {name, price, description, quantity} = req.body;
    if(!name || !price || !description || !quantity){
        let missingFields = [];
        if(!name) missingFields.push('name');
        if(!price) missingFields.push('price');
        if(!description) missingFields.push('description');
        if(!quantity) missingFields.push('quantity');
        return res.status(400).json({status: false, error: 'failure in adding the product', message:  `${missingFields.toString(',')} product fields needs to be sent`})
    }
    const id = uuidv4();
    try{
        Product.addProduct(id, name, parseFloat(price), description, parseInt(quantity));
    }
    catch(error){
        return res.status(500).json({status: false, error, message: 'something went wrong'})
    }
    return res.status(200).json({status: true, message: 'Product added succesfully'});

}

function rateProduct(req, res){
    const userId = req?.user?.id;
    const productId = req?.params?.productId;
    const user = User.getUserById(userId);
    if(!user){
        return res.status(500).json({status: false, message: 'something went wrong'})
    }
    const {rating} = req.body;
    if(!rating) 
        return res.status(400).json({status: false, message: 'rating is compulsory'})

    Product.addProductRating(productId, userId, rating)
    return res.status(200).json({status: true, message: 'product rated succesfully'});

}

export {getAllProducts, getProduct, addProduct, rateProduct}