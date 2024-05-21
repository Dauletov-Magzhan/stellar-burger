import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlices';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const {id} = useParams<{id: string}>()
  /** TODO: взять переменную из стора */
  const ingredientData = useSelector(selectIngredients).find(item => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
