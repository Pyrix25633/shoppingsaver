import { Request, Response } from "express";
import { countCategoryPages, createCategory, findCategories, findCategory, updateCategory } from "../database/category";
import { getName, getOrder } from "../validation/semantic-validation";
import { getInt, getObject, getOrUndefined } from "../validation/type-validation";
import { Created, Forbidden, handleException, NoContent, Ok } from "../web/response";
import { validateToken } from "./auth";

export async function getCategories(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const page = getOrUndefined(req.query.page, getInt);
        const order = getOrUndefined(req.query.order, getOrder);
        const categories = await findCategories(user.id, page, order);
        const pages = await countCategoryPages(user.id);
        new Ok({ categories: categories, pages: pages }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function postCategory(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const body = getObject(req.body);
        const name = getName(body.name);
        const category = await createCategory(user.id, name);
        new Created({ id: category.id }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getCategory(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.categoryId);
        const category = await findCategory(id);
        if(category.userId != user.id)
            throw new Forbidden();
        new Ok({ name: category.name }).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function patchCategory(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        const id = getInt(req.params.categoryId);
        const body = getObject(req.body);
        const name = getName(body.name);
        const category = await findCategory(id);
        if(category.userId != user.id)
            throw new Forbidden();
        await updateCategory(id, name);
        new NoContent().send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}