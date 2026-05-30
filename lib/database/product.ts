import { Product, UnitOfMeasurement } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { settings } from "../settings";
import { Order } from "../validation/semantic-validation";
import { NotFound, UnprocessableContent } from "../web/response";
import { prisma } from "./prisma";

const multiplier: number = 1000;

function calculatePrice(quantity: number, unitOfMeasurement: UnitOfMeasurement, itemPrice: Decimal): Decimal {
    if(unitOfMeasurement == UnitOfMeasurement.PIECES) {
        return Decimal.div(itemPrice, quantity);
    }
    return Decimal.mul(Decimal.div(itemPrice, quantity), multiplier);
}

export async function isProductNameInUse(userId: number, name: string): Promise<boolean> {
    return (await prisma.product.count({
        where: {
            userId: userId,
            name: name
        }
    })) != 0;
}

export async function isProductNameValid(userId: number, name: string, brandId: number, supermarketId: number): Promise<boolean> {
    return (await prisma.product.count({
        where: {
            userId: userId,
            name: name,
            brandId: brandId,
            supermarketId: supermarketId
        }
    })) == 0;
}

export async function createProduct(userId: number, name: string, categoryId: number, brandId: number, quantity: number, itemPrice: Decimal, unitOfMeasurement: UnitOfMeasurement, supermarketId: number): Promise<Product> {
    try {
        return await prisma.product.create({
            data: {
                userId: userId,
                name: name,
                brandId: brandId,
                categoryId: categoryId,
                quantity: quantity,
                itemPrice: itemPrice,
                unitOfMeasurement: unitOfMeasurement,
                price: calculatePrice(quantity, unitOfMeasurement, itemPrice),
                supermarketId: supermarketId
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function findProducts(userId: number, page: number | undefined, order: Order | undefined): Promise<{ name: string; }[]> {
    return prisma.product.findMany({
        select: {
            id: true,
            name: true,
            category: {
                select: {
                    name: true
                }
            },
            brand: {
                select: {
                    name: true
                }
            },
            quantity: true,
            itemPrice: true,
            price: true,
            supermarket: {
                select: {
                    name: true
                }
            }
        },
        where: {
            userId: userId
        },
        orderBy: order,
        skip: page != undefined ? page * settings.database.pageSize : undefined,
        take: page != undefined ? settings.database.pageSize : undefined
    });
}

export async function countProductPages(): Promise<number> {
    return Math.ceil(await prisma.product.count() / settings.database.pageSize);
}

export async function findProduct(id: number): Promise<Product> {
    const product: Product | null = await prisma.product.findUnique({
        where: {
            id: id
        }
    });
    if(product == null)
        throw new NotFound();
    return product;
}

export async function updateProduct(id: number, name: string, categoryId: number, brandId: number, quantity: number, itemPrice: Decimal, unitOfMeasurement: UnitOfMeasurement, supermarketId: number): Promise<Product> {
    try {
        return await prisma.product.update({
            data: {
                name: name,
                categoryId: categoryId,
                brandId: brandId,
                quantity: quantity,
                itemPrice: itemPrice,
                unitOfMeasurement: unitOfMeasurement,
                price: calculatePrice(quantity, unitOfMeasurement, itemPrice),
                supermarketId: supermarketId
            },
            where: {
                id: id
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function deleteProduct(id: number): Promise<Product> {
    return prisma.product.delete({
        where: {
            id: id
        }
    });
}