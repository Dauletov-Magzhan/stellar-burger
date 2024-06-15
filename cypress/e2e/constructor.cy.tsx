/// <reference types='cypress'/>

const API_URL = 'https://norma.nomoreparties.space/api'

const LOGIN = 'test.stellar.burger@mail.ru'
const PASSWORD = 'TestStellarBurger123'

describe('Проверка списка ингредиентов', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.intercept('GET', `${API_URL}/ingredients`, {
            fixture: 'ingredients.json'
          }).as('getIngredients')
        cy.wait('@getIngredients')
    })

    it('Должен отображать список ингредиентов', () => {
        cy.contains('Булки').should('exist')
        cy.contains('Начинки').should('exist')
        cy.contains('Соусы').should('exist')
        cy.contains('Краторная булка N-200i').should('exist')
        cy.contains('Биокотлета из марсианской Магнолии').should('exist')
        cy.contains('Соус Spicy-X').should('exist')
    })

    it('Должен переключать табы при клике', () => {
        cy.get('.JS5hWmZCChXepOtq58RV > :nth-child(3)').click()
        cy.get('.nwANerpzIt6nknkv21Qj > :nth-child(6) > :nth-child(1)').should('exist')
        cy.get('.JS5hWmZCChXepOtq58RV > :nth-child(2)').click()
        cy.get(':nth-child(4) > :nth-child(1) > .J2V21wcp5ddf6wQCcqXv > .text_type_main-default').should('exist')
        cy.get('.JS5hWmZCChXepOtq58RV > :nth-child(1)').click()
        cy.get(':nth-child(2) > :nth-child(1) > .J2V21wcp5ddf6wQCcqXv > .text_type_main-default').should('exist')
      })

    it('Должен добавлять ингредиенты в конструктор', () => {
        cy.get(':nth-child(2) > :nth-child(1) > .common_button').click()
        cy.contains('Краторная булка N-200i (верх)').should('exist')
        cy.contains('Краторная булка N-200i (низ)').should('exist')
        cy.get(':nth-child(4) > :nth-child(2) > .common_button').click()
        cy.get('.R0Ja10_UixREbmJ6qzGV').contains('Филе Люминесцентного тетраодонтимформа').should('exist')
        cy.get(':nth-child(6) > :nth-child(2) > .common_button').click()
        cy.get('.R0Ja10_UixREbmJ6qzGV').contains('Соус фирменный Space Sauce').should('exist')
    })

    it('Проверка на удаление ингредиента из конструктора', () => {
        cy.get(':nth-child(4) > :nth-child(2) > .common_button').click()
        cy.get('.R0Ja10_UixREbmJ6qzGV').contains('Филе Люминесцентного тетраодонтимформа').should('exist')
        cy.get('.Hf3gHktDVu9C__6KCbWX > .constructor-element > .constructor-element__row > .constructor-element__action > svg').click()
        cy.contains('Выберите начинку').should('exist')
    })
})


describe('Проверяем доступность приложения', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    it('Проверка страниц', () => {
        cy.contains('Лента заказов').click()
        cy.contains('Обновить').should('exist')
        cy.contains('Выполнено за все время:').should('exist')
        
        cy.contains('Конструктор').click()
        cy.contains('Соберите бургер').should('exist')
    })

    it('Открытие и закрытие модалки ингредиента', ()=> {
        cy.get('.nwANerpzIt6nknkv21Qj > :nth-child(2) > :nth-child(1)').click()
        cy.contains('Детали ингредиента').should('exist')
        cy.contains('Краторная булка N-200i').should('exist')
        cy.get('.B0JUjcExseGqzRkCpU1a').should('exist')
        
        cy.get(`[data-cy='button-close']`).click()
        cy.contains('Детали ингредиента').should('not.exist')
        cy.get('.B0JUjcExseGqzRkCpU1a').should('not.exist')
    })

    it('Тест на авторизацию, оформление заказа и вход в профиль', () => {
        cy.visit('/login');
        cy.get(':nth-child(1) > .input__container > .input').type(LOGIN) 
        cy.get(':nth-child(2) > .input__container > .input').type(PASSWORD)
        cy.get('.button').click()
        cy.contains('You should be authorised').should('not.exist')
        
        cy.get(':nth-child(2) > :nth-child(1) > .common_button').click()
        cy.get(':nth-child(4) > :nth-child(2) > .common_button').click()
        cy.get(`[dataCy='buttonOrder']`).click()
        cy.contains('Оформляем заказ...').should('exist')
        cy.contains('Ваш заказ начали готовить', { timeout: 60000 }).should('exist')
        cy.get(`[data-cy='button-close']`).click()

        cy.get('.pkK9BFGHNMQBHMhhStb9 > .EthV0Sfz22gpFO0doxic > .text').click()
        cy.contains('В этом разделе вы можете изменить свои персональные данные').should('exist')
    });
}); 
