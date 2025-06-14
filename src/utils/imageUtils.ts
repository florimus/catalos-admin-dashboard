export const uploadImage = async (file: File) => {
  const formdata = new FormData();
  formdata.append('image', file, 'Linux Logo iPhone Wallpapers.jpeg');

  const requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  const response = await fetch(
    'https://api.imgbb.com/1/upload?key=4bb427af4a554abf26bd0451a31cde00',
    {
      ...requestOptions,
      headers: {
        Accept: 'application/json',
      },
      redirect: 'follow' as RequestRedirect,
    }
  );
  return response.json().then((data) => {
    if (data.success) {
      return {
        success: true,
        url: data?.data?.url,
        thumbUrl: data?.data?.thumb?.url,
        name: data?.data?.image?.name,
        message: 'Image uploaded successfully',
      };
    }
    return {
      success: false,
      message: data?.message || 'Failed to upload image',
    };
  });
};

export const uploadImages = async (files: File[]) => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return await Promise.all(uploadPromises);
};
