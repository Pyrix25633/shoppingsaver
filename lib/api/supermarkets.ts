import { Request, Response } from "express";
import { countSupermarketPages, createSupermarket, findSupermarket, findSupermarkets, updateSupermarket } from "../database/supermarket";
import { getName, getOrder } from "../validation/semantic-validation";
import { getInt, getObject, getOrUndefined } from "../validation/type-validation";
import { Created, Forbidden, handleException, NoContent, Ok } from "../web/response";
import { validateToken } from "./auth";

export async function getSupermarkets(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const page = getOrUndefined(req.query.page, getInt);
        const order = getOrUndefined(req.query.order, getOrder);
        const supermarkets = await findSupermarkets(user.id, page, order);
        const pages = await countSupermarketPages();
        new Ok({ supermarkets: supermarkets, pages: pages }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postSupermarket(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const body = getObject(req.body);
        const name = getName(body.name);
        const supermarket = await createSupermarket(user.id, name);
        new Created({ id: supermarket.id }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getSupermarket(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.supermarketId);
        const supermarket = await findSupermarket(id);
        if(supermarket.userId != user.id)
            throw new Forbidden();
        new Ok({ name: supermarket.name }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function patchSupermarket(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.supermarketId);
        const body = getObject(req.body);
        const name = getName(body.name);
        const supermarket = await findSupermarket(id);
        if(supermarket.userId != user.id)
            throw new Forbidden();
        await updateSupermarket(id, name);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}