import { configureStore } from "@reduxjs/toolkit";
import ingredientsSlices, {addIngredient, removeIngredient, moveDownIngredient, moveUpIngredient, selectConstructorItems, selectIngredients, selectIsModalOpened, fetchIngredients} from "../slices/ingredientsSlices";
import { mockBun, mockIngredient, mockStore } from "../mocks/ingredientsSlicesMocks";

const initialStore = () => {
    return configureStore({
        reducer: {
            ingredients: ingredientsSlices,
        },
        preloadedState: {
            ingredients: mockStore
          }
    })
}

describe('Тест ingredientsSlices', () => {
    it('Тест на добавление ингредиента с экшеном "addIngredient"', () => {
        const store = initialStore()
        store.dispatch(addIngredient(mockIngredient))
        store.dispatch(addIngredient(mockBun))
        const constructorItems = selectConstructorItems(store.getState())
        expect(constructorItems.ingredients.length).toBe(4)
        expect(constructorItems.bun.name).toBe('Краторная булка N-200i')
      });

    it('Тест на удаление ингредиента с экшеном "removeIngredient"', () => {
        const store = initialStore()
        const beforeRemove = selectConstructorItems(store.getState()).ingredients.length
        store.dispatch(removeIngredient(mockIngredient))
        const afterRemove = selectConstructorItems(store.getState()).ingredients.length
        expect(beforeRemove).toBe(3)
        expect(afterRemove).toBe(2)
    })

    it('Тест на изменение порядка ингредиента в конструкторе c экшеном "moveDownIngredient"', () => {
        const store = initialStore()
        const moveIngredient = selectConstructorItems(store.getState()).ingredients[0]
        store.dispatch(moveDownIngredient(moveIngredient))
        expect(selectConstructorItems(store.getState()).ingredients[1]).toEqual(moveIngredient)
    })

    it('Тест на изменение порядка ингредиента в конструкторе c экшеном "moveUpIngredient"', () => {
        const store = initialStore()
        const moveIngredient = selectConstructorItems(store.getState()).ingredients[2]
        store.dispatch(moveUpIngredient(moveIngredient))
        expect(selectConstructorItems(store.getState()).ingredients[1]).toEqual(moveIngredient)
    })

    it('Тест селектора "selectIngredients"', () => {
        const store = initialStore()
        const ingredients = selectIngredients(store.getState())
        expect(ingredients).toEqual(mockStore.ingredients)
    })

    it('Тест селектора "selectConstructorItems"', () => {
        const store = initialStore()
        const constructorItems = selectConstructorItems(store.getState())
        expect(constructorItems).toEqual(mockStore.constructorItems)
    })

    it('Тест селектора "selectIsModalOpened"', () => {
        const store = initialStore()
        const isModalOpened = selectIsModalOpened(store.getState())
        expect(isModalOpened).toEqual(mockStore.isModalOpened)
    })

    it('Тест загрузки ингредиентов', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockStore.ingredients),
            })
        ) as jest.Mock;

        const store = initialStore()
        await store.dispatch(fetchIngredients())
        const {ingredients} = store.getState().ingredients
        expect(ingredients).toEqual(mockStore.ingredients)
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })
})
