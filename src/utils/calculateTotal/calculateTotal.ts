export function calculateTotal(amounts: string): number {
    const numbers = amounts
        .split(/[\n,\s]+/)
        .map(a => a.trim())
        .filter(a => a !== "")
        .map(a => parseFloat(a));

    return numbers
        .filter(n => !isNaN(n))
        .reduce((acc, n) => acc + n, 0);
}