import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { settings } from '../settings';
import { PrismaClient } from "./prisma/client";

const adapter = new PrismaMariaDb({
    host: settings.database.host,
    port: settings.database.port,
    user: settings.database.user,
    password: settings.database.password,
    database: settings.database.name
});

export const prisma = new PrismaClient({ adapter });