export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
    let timeoutId: NodeJS.Timeout | undefined;

    return function (this: any, ...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

export function isEmptyObject(object: Record<string, any>): boolean {
    return Object.values(object).every((value) => {
        if (typeof value === "object" && value !== null) {
            return isEmptyObject(value);
        }

        return value === "" || value === null || value === undefined;
    });
}
