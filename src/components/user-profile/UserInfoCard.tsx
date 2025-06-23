'use client';

import React, { FC, useState } from 'react';
import { useModal } from '../../hooks/useModal';
import { IResponse, IUserInfo } from '@/core/types';
import UserInfoCardView from './UserInfoCardView';
import { updateUserInfo } from '@/actions/user';
import { IUploadedImage, uploadImage } from '@/utils/imageUtils';

interface UserInfoCardProps {
  userInfo?: IUserInfo;
}

const UserInfoCard: FC<UserInfoCardProps> = ({ userInfo }) => {
  const { isOpen, openModal, closeModal } = useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [userInfoState, setUserInfoState] = useState<
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
    setLoading(true);
    const response: IResponse<IUserInfo> = await updateUserInfo(
      userInfoState?.firstName || '',
      userInfoState?.lastName || '',
      userInfoState?.avatar || '',
      userInfo?.userGroupId
    );
    setLoading(false);
    if (response.success) {
      setUserInfoState(response.data);
      closeModal();
    } else {
      console.error(response.message);
    }
  };

  const handleProfileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const image: IUploadedImage = await uploadImage(file);
      setIsUploading(false);
      setUserInfoState((prev) => ({
        ...prev!,
        avatar: image.url,
      }));
    }
  };

  return (
    <UserInfoCardView
      userInfo={userInfoState}
      isOpen={isOpen}
      isUploading={isUploading}
      loading={loading}
      openModal={openModal}
      closeModal={closeModal}
      handleInputChange={handleInputChange}
      handleSave={handleSave}
      handleProfileChange={handleProfileChange}
    />
  );
};

export default UserInfoCard;
