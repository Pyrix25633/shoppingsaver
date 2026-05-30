import { Request, Response } from "express";
import { countBrandPages, createBrand, findBrand, findBrands, updateBrand } from "../database/brand";
import { getName, getOrder } from "../validation/semantic-validation";
import { getInt, getObject, getOrUndefined } from "../validation/type-validation";
import { Created, Forbidden, handleException, NoContent, Ok } from "../web/response";
import { validateToken } from "./auth";

export async function getBrands(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const page = getOrUndefined(req.query.page, getInt);
        const order = getOrUndefined(req.query.order, getOrder);
        const brands = await findBrands(user.id, page, order);
        const pages = await countBrandPages();
        new Ok({ brands: brands, pages: pages }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postBrand(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const body = getObject(req.body);
        const name = getName(body.name);
        const brand = await createBrand(user.id, name);
        new Created({ id: brand.id }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getBrand(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.brandId);
        const brand = await findBrand(id);
        if(brand.userId != user.id)
            throw new Forbidden();
        new Ok({ name: brand.name }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function patchBrand(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.brandId);
        const body = getObject(req.body);
        const name = getName(body.name);
        const brand = await findBrand(id);
        if(brand.userId != user.id)
            throw new Forbidden();
        await updateBrand(id, name);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}