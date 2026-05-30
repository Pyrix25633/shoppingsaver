import { Supermarket } from "@prisma/client";
import { settings } from "../settings";
import { Order } from "../validation/semantic-validation";
import { NotFound, UnprocessableContent } from "../web/response";
import { prisma } from "./prisma";

export async function isSupermarketNameInUse(userId: number, name: string): Promise<boolean> {
    return (await prisma.supermarket.count({
        where: {
            userId: userId,
            name: name
        }
    })) != 0;
}

export async function createSupermarket(userId: number, name: string): Promise<Supermarket> {
    try {
        return await prisma.supermarket.create({
            data: {
                userId: userId,
                name: name
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function findSupermarkets(userId: number, page: number | undefined, order: Order | undefined): Promise<{ name: string; }[]> {
    return prisma.supermarket.findMany({
        select: {
            id: true,
            name: true
        },
        where: {
            userId: userId
        },
        orderBy: order,
        skip: page != undefined ? page * settings.database.pageSize : undefined,
        take: page != undefined ? settings.database.pageSize : undefined
    });
}

export async function countSupermarketPages(): Promise<number> {
    return Math.ceil(await prisma.supermarket.count() / settings.database.pageSize);
}

export async function findSupermarket(id: number): Promise<Supermarket> {
    const supermarket: Supermarket | null = await prisma.supermarket.findUnique({
        where: {
            id: id
        }
    });
    if(supermarket == null)
        throw new NotFound();
    return supermarket;
}

export async function updateSupermarket(id: number, name: string): Promise<Supermarket> {
    try {
        return await prisma.supermarket.update({
            data: {
                name: name
            },
            where: {
                id: id
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}