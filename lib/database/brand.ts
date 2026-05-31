import { Brand } from "@prisma/client";
import { settings } from "../settings";
import { Order } from "../validation/semantic-validation";
import { NotFound, UnprocessableContent } from "../web/response";
import { prisma } from "./prisma";

export async function isBrandNameInUse(userId: number, name: string): Promise<boolean> {
    return (await prisma.brand.count({
        where: {
            userId: userId,
            name: name
        }
    })) != 0;
}

export async function createBrand(userId: number, name: string): Promise<Brand> {
    try {
        return await prisma.brand.create({
            data: {
                userId: userId,
                name: name
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function findBrands(userId: number, page: number | undefined, order: Order | undefined): Promise<{ name: string; }[]> {
    return prisma.brand.findMany({
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

export async function countBrandPages(userId: number): Promise<number> {
    return Math.ceil(await prisma.brand.count({
        where: {
            userId: userId
        }
    }) / settings.database.pageSize);
}

export async function findBrand(id: number): Promise<Brand> {
    const brand: Brand | null = await prisma.brand.findUnique({
        where: {
            id: id
        }
    });
    if(brand == null)
        throw new NotFound();
    return brand;
}

export async function updateBrand(id: number, name: string): Promise<Brand> {
    try {
        return await prisma.brand.update({
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