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
import { ProtectedRoute } from '../protected-route/protected-route';

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
          <Route path='/login' element={<ProtectedRoute unAuthOnly><Login /></ProtectedRoute>} />
          <Route path='/register' element={<ProtectedRoute unAuthOnly><Register /></ProtectedRoute>}/>
          <Route path='/forgot-password' element={<ProtectedRoute unAuthOnly><ForgotPassword /></ProtectedRoute>} />
          <Route path='/reset-password' element={<ProtectedRoute unAuthOnly><ResetPassword /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/profile/orders' element={<ProtectedRoute><ProfileOrders /></ProtectedRoute>} />
          <Route path='*' element={<NotFound404 />}/>
          <Route path='/feed/:number' element={<Modal title='' onClose={() => closeModal()}><FeedInfo /></Modal>} />
          <Route path='/ingredients/:id' element={<Modal title='Детали ингредиента' onClose={() => closeModal()}><IngredientDetails /></Modal>} />
          <Route path='/profile/orders/:number' element={<ProtectedRoute><Modal title='' onClose={() => closeModal()}><OrderInfo /></Modal></ProtectedRoute>}  />
        </Routes>
      </div>
  )
}

export default App;
