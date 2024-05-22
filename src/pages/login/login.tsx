import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { TLoginData } from '@api';
import { useDispatch, useSelector } from '../../services/store';
import { login, selectGetError, selectIsLoading } from '../../services/slices/authSlices';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch()
  const error = useSelector(selectGetError)
  const isLoading = useSelector(selectIsLoading)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginData: TLoginData = {
    email: email,
    password: password
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(login(loginData))
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
