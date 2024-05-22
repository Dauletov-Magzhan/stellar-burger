import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/ingredientsSlices';
import { closeOrderModalData, fetchOrderBurger, selectOrderModalData, selectOrderRequest } from '../../services/slices/ordersSlices';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch()

  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(selectConstructorItems)

  const orderRequest = useSelector(selectOrderRequest)

  const orderModalData = useSelector(selectOrderModalData)

  const onOrderClick = () => {
    if (constructorItems.bun._id || constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        fetchOrderBurger([
          ...ingredientsIds,
        ])
      );
    };
  };

  const closeOrderModal = () => {
    dispatch(closeOrderModalData())
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price! * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
