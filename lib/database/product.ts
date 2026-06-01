import { Product, UnitOfMeasurement } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { settings } from "../settings";
import { Order, PriceVisibility, ProductFilter } from "../validation/semantic-validation";
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

export async function findProductFromName(userId: number, name: string, brandId: number, supermarketId: number): Promise<Product | null> {
    return await prisma.product.findFirst({
        where: {
            userId: userId,
            name: name,
            brandId: brandId,
            supermarketId: supermarketId
        }
    });
}

export async function createProduct(userId: number, name: string, categoryId: number, brandId: number, quantity: number, itemPrice: Decimal, unitOfMeasurement: UnitOfMeasurement, supermarketId: number): Promise<Product> {
    try {
        return await prisma.$transaction(async (): Promise<Product> => {
            try {
                const price = calculatePrice(quantity, unitOfMeasurement, itemPrice);
                const bestPrice = await handlePossibleBestPriceChange(userId, name, price, undefined);
                return await prisma.product.create({
                    data: {
                        userId: userId,
                        name: name,
                        brandId: brandId,
                        categoryId: categoryId,
                        quantity: quantity,
                        itemPrice: itemPrice,
                        unitOfMeasurement: unitOfMeasurement,
                        price: price,
                        bestPrice: bestPrice,
                        supermarketId: supermarketId
                    }
                });
            } catch(e: any) {
                throw e;
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

async function findBestPrice(userId: number, name: string): Promise<Decimal | null> {
    const product = await prisma.product.findFirst({
        where: {
            userId: userId,
            name: name,
            bestPrice: true
        }
    });
    if(product == null)
        return null;
    return product.price;
}

async function findMinPrice(userId: number, name: string, excludeId: number): Promise<Decimal | null> {
    return (await prisma.product.aggregate({
        _min: {
            price: true
        },
        where: {
            id: {
                not: excludeId
            },
            userId: userId,
            name: name
        }
    }))._min.price;
}

export async function findProducts(userId: number, page: number | undefined, order: Order | undefined, filter: ProductFilter): Promise<{ name: string; }[]> {
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
            unitOfMeasurement: true,
            price: true,
            supermarket: {
                select: {
                    name: true
                }
            }
        },
        where: {
            userId: userId,
            categoryId: filter.categoryId,
            name: {
                contains: filter.name
            },
            supermarketId: filter.supermarketId,
            bestPrice: filter.priceVisibility == PriceVisibility.BEST ? true : undefined
        },
        orderBy: order,
        skip: page != undefined ? page * settings.database.pageSize : undefined,
        take: page != undefined ? settings.database.pageSize : undefined
    });
}

export async function countProductPages(userId: number, filter: ProductFilter): Promise<number> {
    return Math.ceil(await prisma.product.count({
        where: {
            userId: userId,
            categoryId: filter.categoryId,
            name: {
                contains: filter.name
            },
            supermarketId: filter.supermarketId,
            bestPrice: filter.priceVisibility == PriceVisibility.BEST ? true : undefined
        }
    }) / settings.database.pageSize);
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

async function handlePossibleBestPriceChange(userId: number, name: string, newPrice: Decimal, excludeId: number | undefined): Promise<boolean> {
    const best = excludeId != undefined ? await findMinPrice(userId, name, excludeId) : await findBestPrice(userId, name);
    if(best == null)
        return true;
    if(best.gt(newPrice)) {
        await updateProductsNotBestPrice(userId, name);
        return true;
    }
    return best.eq(newPrice);
}

async function handleBestPrice(userId: number, oldName: string, oldPrice: Decimal, excludeId: number): Promise<void> {
    const best = await findMinPrice(userId, oldName, excludeId);
    if(best == null)
        return;
    if(best.eq(oldPrice))
        return;
    await prisma.product.updateMany({
        data: {
            bestPrice: true
        },
        where: {
            userId: userId,
            name: oldName,
            price: best
        }
    });
}

export async function updateProduct(old: Product, name: string, categoryId: number, brandId: number, quantity: number, itemPrice: Decimal, unitOfMeasurement: UnitOfMeasurement, supermarketId: number): Promise<Product> {
    try {
        return await prisma.$transaction(async (): Promise<Product> => {
            try {
                const price = calculatePrice(quantity, unitOfMeasurement, itemPrice);
                let bestPrice = old.bestPrice;
                if(name == old.name) {
                    if(price.gt(old.price)) {
                        if(old.bestPrice)
                            bestPrice = await handlePossibleBestPriceChange(old.userId, name, price, old.id);
                        else
                            bestPrice = false;
                    }
                    else if(price.lt(old.price)) {
                        if(old.bestPrice) {
                            await updateProductsNotBestPrice(old.userId, name);
                            bestPrice = true;
                        }
                        else
                            bestPrice = await handlePossibleBestPriceChange(old.userId, name, price, old.id);
                    }
                }
                else {
                    await handleBestPrice(old.userId, old.name, old.price, old.id); //For old name
                    bestPrice = await handlePossibleBestPriceChange(old.userId, name, price, undefined); //For new name
                }
                return await prisma.product.update({
                    data: {
                        name: name,
                        brandId: brandId,
                        categoryId: categoryId,
                        quantity: quantity,
                        itemPrice: itemPrice,
                        unitOfMeasurement: unitOfMeasurement,
                        price: price,
                        bestPrice: bestPrice,
                        supermarketId: supermarketId
                    },
                    where: {
                        id: old.id
                    }
                });
            } catch(e: any) {
                throw e;
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

async function updateProductsNotBestPrice(userId: number, name: string): Promise<void> {
    try {
        await prisma.product.updateMany({
            data: {
                bestPrice: false,
            },
            where: {
                userId: userId,
                name: name
            }
        });
    } catch(e: any) {
        throw new UnprocessableContent();
    }
}

export async function deleteProduct(old: Product): Promise<Product> {
    return await prisma.$transaction(async (): Promise<Product> => {
        await handleBestPrice(old.userId, old.name, old.price, old.id);
        return prisma.product.delete({
            where: {
                id: old.id
            }
        });
    });    
}