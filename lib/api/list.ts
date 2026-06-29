import { Request, Response } from "express";
import { countListPages, createItem, deleteCheckedItems, deleteItem, findItem, findList, updateItemChecked } from "../database/item";
import { getName, getOrder } from "../validation/semantic-validation";
import { getInt, getObject, getOrUndefined } from "../validation/type-validation";
import { Created, Forbidden, handleException, NoContent, Ok } from "../web/response";
import { validateToken } from "./auth";

export async function getList(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const page = getOrUndefined(req.query.page, getInt);
        const order = getOrUndefined(req.query.order, getOrder);
        const list = await findList(user.id, page, order);
        const pages = await countListPages(user.id);
        new Ok({ list: list, pages: pages }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postItem(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const body = getObject(req.body);
        const name = getName(body.name);
        const item = await createItem(user.id, name);
        new Created({ id: item.id }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postToggleItem(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.itemId);
        const item = await findItem(id);
        if(item.userId != user.id)
            throw new Forbidden();
        await updateItemChecked(id, !item.checked);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function deleteList(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        await deleteCheckedItems(user.id);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function delItem(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.itemId);
        const item = await findItem(id);
        if(item.userId != user.id)
            throw new Forbidden();
        await deleteItem(user.id, id);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}