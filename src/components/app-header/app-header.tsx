import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectGetUser } from '../../services/slices/authSlices';

export const AppHeader: FC = () => {
    const user = useSelector(selectGetUser)

    return <AppHeaderUI userName={user.name} />;
}

