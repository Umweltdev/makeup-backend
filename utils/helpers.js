export const generateRandomNumber = () => {
    let result = '';
    for (let i = 0; i < 8; i++) {
      const digit = Math.floor(Math.random() * 10);
      result += digit;
    }
    return parseInt(result, 10);
  };


  export const generateRandomString = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };