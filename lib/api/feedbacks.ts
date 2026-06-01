import { Request, Response } from "express";
import { isBrandNameInUse } from "../database/brand";
import { isCategoryNameInUse } from "../database/category";
import { findProductFromName, isProductNameInUse } from "../database/product";
import { isSupermarketNameInUse } from "../database/supermarket";
import { isTempUserEmailInUse, isTempUserUsernameInUse } from "../database/temp-user";
import { isUserEmailInUse, isUserUsernameInUse } from "../database/user";
import { getEmail, getName, getProductName, getUsername } from "../validation/semantic-validation";
import { getInt, getString } from "../validation/type-validation";
import { Ok, handleException } from "../web/response";
import { validateToken } from "./auth";

export async function getRegisterUsernameFeedback(req: Request, res: Response): Promise<void> {
    try {
        let feedback: string;
        try {
            const username = getUsername(req.query.username);
            const inUse = (await isTempUserUsernameInUse(username)) || (await isUserUsernameInUse(username));
            feedback = inUse ? 'Username already taken!' : 'Valid Username';
        } catch(e: any) {
            const username = getString(req.query.username);
            if(username.length < 3)
                feedback = 'Username too short!';
            else if(username.length > 32)
                feedback = 'Username too long!';
            else
                feedback = 'Username contains forbidden Character!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getRegisterEmailFeedback(req: Request, res: Response): Promise<void> {
    try {
        let feedback: string;
        try {
            const email = getEmail(req.query.email);
            const inUse = (await isTempUserEmailInUse(email)) || (await isUserEmailInUse(email));
            feedback = inUse ? 'Email already used' : 'Valid Email';
        } catch(e: any) {
            feedback = 'Invalid Email!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getConfirmUsernameFeedback(req: Request, res: Response): Promise<void> {
    try {
        let feedback: string;
        try {
            const username = getUsername(req.query.username);
            const inUse = await isTempUserUsernameInUse(username);
            feedback = inUse ? 'Valid Username' : 'No unconfirmed Users found with specified Username!';
        } catch(e: any) {
            feedback = 'Invalid Username!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getLoginUsernameFeedback(req: Request, res: Response): Promise<void> {
    try {
        let feedback: string;
        try {
            const username = getUsername(req.query.username);
            const inUse = await isUserUsernameInUse(username);
            feedback = inUse ? 'Valid Username' : 'No Users found with specified Username!';
        } catch(e: any) {
            feedback = 'Invalid Username!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getCategoryNameFeedback(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        let feedback: string;
        try {
            const name = getName(req.query.name);
            const inUse = await isCategoryNameInUse(user.id, name);
            feedback = inUse ? 'Name already used!' : 'Valid Name';
        } catch(e: any) {
            const name = getString(req.query.name);
            if(name.length < 3)
                feedback = 'Name too short!';
            else
                feedback = 'Name too long!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getBrandNameFeedback(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        let feedback: string;
        try {
            const name = getName(req.query.name);
            const inUse = await isBrandNameInUse(user.id, name);
            feedback = inUse ? 'Name already used!' : 'Valid Name';
        } catch(e: any) {
            const name = getString(req.query.name);
            if(name.length < 3)
                feedback = 'Name too short!';
            else
                feedback = 'Name too long!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getSupermarketNameFeedback(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        let feedback: string;
        try {
            const name = getName(req.query.name);
            const inUse = await isSupermarketNameInUse(user.id, name);
            feedback = inUse ? 'Name already used!' : 'Valid Name';
        } catch(e: any) {
            const name = getString(req.query.name);
            if(name.length < 3)
                feedback = 'Name too short!';
            else
                feedback = 'Name too long!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}

export async function getProductNameFeedback(req: Request, res: Response): Promise<void> {
    try {
        const user = await validateToken(req);
        let feedback: string;
        try {
            const name = getProductName(req.query.name);
            const brandId = getInt(req.query.brandId);
            const supermarketId = getInt(req.query.supermarketId);
            const inUse = await isProductNameInUse(user.id, name);
            if(inUse) {
                const product = await findProductFromName(user.id, name, brandId, supermarketId);
                feedback = product == null ? 'Other products with the same name' : 'Product already exists! {productId}:' + product.id;
            }
            else
                feedback = 'Valid Name';
        } catch(e: any) {
            const name = getString(req.query.name);
            if(name.length < 3)
                feedback = 'Name too short!';
            else
                feedback = 'Name too long!';
        }
        new Ok({feedback: feedback}).send(res);
    } catch(e: any) {
        handleException(e, res);
    }
}