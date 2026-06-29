import { settings } from "../settings";
import { Order } from "../validation/semantic-validation";
import { NotFound, UnprocessableContent } from "../web/response";
import { prisma } from "./prisma";
import { Item } from "./prisma/client";

export async function isItemNameInUse(userId: number, name: string): Promise<boolean> {
    return (await prisma.item.count({
        where: {
            userId: userId,
            name: name
        }
    })) != 0;
}

export async function createItem(userId: number, name: string): Promise<Item> {
    try {
        return await prisma.item.create({
            data: {
                userId: userId,
                name: name
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function findList(userId: number, page: number | undefined, order: Order | undefined): Promise<{ name: string; checked: boolean; }[]> {
    return prisma.item.findMany({
        select: {
            id: true,
            name: true,
            checked: true
        },
        where: {
            userId: userId
        },
        orderBy: order,
        skip: page != undefined ? page * settings.database.pageSize : undefined,
        take: page != undefined ? settings.database.pageSize : undefined
    });
}

export async function findUncheckedNames(userId: number): Promise<string[]> {
    return (await prisma.item.findMany({
        select: {
            name: true
        },
        where: {
            userId: userId,
            checked: false
        }
    })).map((e: { name: string; }): string => {return e.name});
}

export async function countListPages(userId: number): Promise<number> {
    return Math.ceil(await prisma.item.count({
        where: {
            userId: userId
        }
    }) / settings.database.pageSize);
}

export async function findItem(id: number): Promise<Item> {
    const item: Item | null = await prisma.item.findUnique({
        where: {
            id: id
        }
    });
    if(item == null)
        throw new NotFound();
    return item;
}

export async function updateItemChecked(id: number, checked: boolean): Promise<Item> {
    try {
        return await prisma.item.update({
            data: {
                checked: checked
            },
            where: {
                id: id
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function deleteCheckedItems(userId: number): Promise<{ count: number; }> {
    return await prisma.item.deleteMany({
        where: {
            userId: userId,
            checked: true
        }
    });
}

export async function deleteItem(userId: number, id: number): Promise<Item> {
    return await prisma.item.delete({
        where: {
            userId: userId,
            id: id
        }
    });
}