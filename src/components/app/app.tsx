import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails, FeedInfo } from '@components';
import { Feed, Login, Register, ForgotPassword, ResetPassword, Profile, ProfileOrders, NotFound404 } from '@pages';

import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchIngredients, closeIsModal } from '../../services/slices/ingredientsSlices';
import { fetchFeeds, fetchOrders } from '../../services/slices/ordersSlices';

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchIngredients())
    dispatch(fetchFeeds())
  }, [])


  const closeModal = () => {
    navigate(-1)
  }

  return (
    <div className={styles.app}>
        <AppHeader />
        <Routes>
        <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />}/>
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/orders' element={<ProfileOrders />} />
            <Route path='*' element={<NotFound404 />}/>
            <Route path='/feed/:number' element={<Modal title='' onClose={() => closeModal()}><FeedInfo /></Modal>} />
            <Route path='/ingredients/:id' element={<Modal title='Детали ингредиента' onClose={() => closeModal()}><IngredientDetails /></Modal>} />
            <Route path='/profile/orders/:number' element={<Modal title='' onClose={() => closeModal()}><OrderInfo /></Modal>}  />
        </Routes>
      </div>
  )
}

export default App;
