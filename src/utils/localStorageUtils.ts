export const LOCAL_STORAGE_KEYS = {
    CART_ID: 'cartId',
};



export const setLocalStorageItem = (key: string, value: string): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting localStorage item with key "${key}":`, error);
  }
};

export const getLocalStorageItem = (key: string): string | null => {
  try {
    const serializedValue = localStorage.getItem(key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  } catch (error) {
    console.error(`Error getting localStorage item with key "${key}":`, error);
    return null;
  }
};

export const removeLocalStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item with key "${key}":`, error);
  }
};