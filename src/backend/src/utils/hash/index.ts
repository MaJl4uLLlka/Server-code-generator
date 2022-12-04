import { scrypt, randomBytes } from 'crypto';
import { saltLong, keyLength } from '../../config/constants';

export const getHash = (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(saltLong).toString('hex');

    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt + ':' + derivedKey.toString('hex'));
    });
  });
};

export const compare = (password: string, hash: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':');
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      resolve(key === derivedKey.toString('hex'));
    });
  });
};
