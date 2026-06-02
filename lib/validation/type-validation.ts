import { BadRequest } from "../web/response";

export function getObject(raw: unknown): { [index: string]: any; } {
    if(raw == undefined || typeof raw != "object")
        throw new BadRequest();
    return raw;
}

export function getArray(raw: unknown): any[] {
    if(raw == undefined || !Array.isArray(raw))
        throw new BadRequest();
    return raw;
}

export function getBoolean(raw: unknown): boolean {
    if(raw == undefined || typeof raw != "boolean")
        throw new BadRequest();
    return raw;
}

function parseInt(raw: unknown): number {
    const parsed = Number.parseInt(getNonEmptyString(raw));
    if(!Number.isSafeInteger(parsed))
        throw new BadRequest();
    return parsed;
}

export function getInt(raw: unknown): number {
    if(typeof raw == "string")
        return parseInt(raw);
    if(raw == undefined || typeof raw != "number")
        throw new BadRequest();
    if(!Number.isSafeInteger(raw))
        throw new BadRequest();
    return raw;
}

export function getFloat(raw: unknown): number {
    if(raw == undefined || typeof raw != "number" || isNaN(raw))
        throw new BadRequest();
    return raw;
}

export function getString(raw: unknown): string {
    if(raw == undefined || typeof raw != "string")
        throw new BadRequest();
    return raw;
}

export function getNonEmptyString(raw: unknown): string {
    if(raw == undefined || typeof raw != "string")
        throw new BadRequest();
    if(raw.length == 0)
        throw new BadRequest();
    return raw;
}

type ParseFunction<R> = (raw: unknown) => R;

export function getOrNull<T>(raw: unknown, parseFunction: ParseFunction<T>): T | null {
    if(raw === null)
        return null;
    return parseFunction(raw);
}

export function getOrUndefined<T>(raw: unknown, parseFunction: ParseFunction<T>): T | undefined {
    if(raw === undefined)
        return undefined;
    return parseFunction(raw);
}