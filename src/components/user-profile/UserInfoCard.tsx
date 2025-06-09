'use client';

import React, { FC } from 'react';
import { useModal } from '../../hooks/useModal';
import { IResponse, IUserInfo } from '@/core/types';
import UserInfoCardView from './UserInfoCardView';
import { updateUserInfo } from '@/actions/user';

interface UserInfoCardProps {
  userInfo?: IUserInfo;
}

const UserInfoCard: FC<UserInfoCardProps> = ({ userInfo }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [userInfoState, setUserInfoState] = React.useState<
    IUserInfo | undefined
  >(userInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfoState((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response: IResponse<IUserInfo> = await updateUserInfo(
      userInfoState?.firstName || '',
      userInfoState?.lastName || ''
    );
    if (response.success) {
      setUserInfoState(response.data);
      closeModal();
    } else {
      console.error(response.message);
    }
  };
  return (
    <UserInfoCardView
      userInfo={userInfoState}
      isOpen={isOpen}
      openModal={openModal}
      closeModal={closeModal}
      handleInputChange={handleInputChange}
      handleSave={handleSave}
    />
  );
};

export default UserInfoCard;
