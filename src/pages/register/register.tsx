import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { getUser, register, selectGetError, selectIsLoading } from '../../services/slices/authSlices';
import { TRegisterData } from '@api';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch()
  const error = useSelector(selectGetError)
    const isLoading = useSelector(selectIsLoading)

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerData: TRegisterData = {
    email: email,
    name: userName,
    password: password
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(register(registerData))
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
