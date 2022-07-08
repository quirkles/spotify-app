import {favoriteFruits, addFruit} from "./index";


describe('main', () => {
    it('should work', function () {
        expect(favoriteFruits.length).toBe(3)
        addFruit('anything')
        expect(favoriteFruits.length).toBe(4)
    });
})
