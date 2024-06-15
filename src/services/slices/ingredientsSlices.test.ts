import { configureStore } from "@reduxjs/toolkit";
import ingredientsSlices, {addIngredient, removeIngredient, moveDownIngredient, moveUpIngredient, selectConstructorItems} from "./ingredientsSlices";
import { mockBun, mockIngredient, mockStore } from "../mocks/ingredientsSlicesMocks";
import { before } from "node:test";


describe('Тесты синхронных экшенов', () => {

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

    it('Тест на изменение порядка ингредиента в конструкторе c экшеном "moveDownIngredient"', () => {
        const store = initialStore()

        const moveIngredient = selectConstructorItems(store.getState()).ingredients[2]
        store.dispatch(moveUpIngredient(moveIngredient))
        expect(selectConstructorItems(store.getState()).ingredients[1]).toEqual(moveIngredient)
    })
})
