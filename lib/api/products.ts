import { Request, Response } from "express";
import { findBrand } from "../database/brand";
import { findCategory } from "../database/category";
import { countProductPages, createProduct, deleteProduct, findProduct, findProducts, updateProduct } from "../database/product";
import { findSupermarket } from "../database/supermarket";
import { getName, getOrder, getProductFilter, getQuantity, getUnitOfMeasurement } from "../validation/semantic-validation";
import { getDecimal, getInt, getObject, getOrUndefined } from "../validation/type-validation";
import { Created, Forbidden, handleException, NoContent, Ok } from "../web/response";
import { validateToken } from "./auth";

export async function getProducts(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const page = getOrUndefined(req.query.page, getInt);
        const order = getOrUndefined(req.query.order, getOrder);
        const filter = getProductFilter(req.query.filter);
        const products = await findProducts(user.id, page, order, filter);
        //TODO: distinct from prices all and min
        //! other table with userId, name and productId
        //! attention to product deletion, update in general
        const pages = await countProductPages(user.id, filter);
        new Ok({ products: products, pages: pages }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postProduct(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const body = getObject(req.body);
        const name = getName(body.name);
        const categoryId = getInt(body.categoryId);
        const brandId = getInt(body.brandId);
        const quantity = getQuantity(body.quantity);
        const itemPrice = getDecimal(body.itemPrice);
        const unitOfMeasurement = getUnitOfMeasurement(body.unitOfMeasurement);
        const supermarketId = getInt(body.supermarketId);
        const category = await findCategory(categoryId);
        const brand = await findBrand(brandId);
        const supermarket = await findSupermarket(supermarketId);
        if(category.userId != user.id || brand.userId != user.id || supermarket.userId != user.id)
            throw new Forbidden();
        const product = await createProduct(user.id, name, categoryId, brandId, quantity, itemPrice, unitOfMeasurement, supermarketId);
        new Created({ id: product.id }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.productId);
        const product = await findProduct(id);
        if(product.userId != user.id)
            throw new Forbidden();
        new Ok({
            name: product.name,
            categoryId: product.categoryId,
            brandId: product.brandId,
            quantity: product.quantity,
            itemPrice: product.itemPrice,
            unitOfMeasurement: product.unitOfMeasurement,
            supermarketId: product.supermarketId
        }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function patchProduct(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.productId);
        const body = getObject(req.body);
        const name = getName(body.name);
        const categoryId = getInt(body.categoryId);
        const brandId = getInt(body.brandId);
        const quantity = getQuantity(body.quantity);
        const itemPrice = getDecimal(body.itemPrice);
        const unitOfMeasurement = getUnitOfMeasurement(body.unitOfMeasurement);
        const supermarketId = getInt(body.supermarketId);
        const product = await findProduct(id);
        const category = await findCategory(categoryId);
        const brand = await findBrand(brandId);
        const supermarket = await findSupermarket(supermarketId);
        if(product.userId != user.id || category.userId != user.id || brand.userId != user.id || supermarket.userId != user.id)
            throw new Forbidden();
        await updateProduct(id, name, categoryId, brandId, quantity, itemPrice, unitOfMeasurement, supermarketId);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function delProduct(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.productId);
        const stock = await findProduct(id);
        if(stock.userId != user.id)
            throw new Forbidden();
        await deleteProduct(id);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}