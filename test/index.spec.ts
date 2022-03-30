function sum(a: number, b: number) {
    return a + b
}

describe('test my functions', () => {
    it('My sum 1 + 1 is equal to 2', () => {
        expect(sum(1, 1)).toBe(2)
    })
})