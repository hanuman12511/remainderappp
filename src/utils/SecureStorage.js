import EncryptedStorage from 'react-native-encrypted-storage';

class SecureStorage {

    save = async (key,value) => {
        try {
          await EncryptedStorage.setItem(key, value)
        } catch (e) {
          console.log("Error in storing in EncryptedStorage",e.message)
        }
        console.log('store data in EncryptedStorage.')
    }

    get = async (key) => {
        try {
          const value = await EncryptedStorage.getItem(key)
          return value
        } catch(e) {
          console.log("Error in reading from EncryptedStorage",e.message)
        }
    }

    remove = async (key) => {
        try {
          await EncryptedStorage.removeItem(key)
        } catch(e) {
          console.log("Error in removing from EncryptedStorage",e.message)
        }
      
        console.log('removed data from EncryptedStorage.')
    }

}

export default new SecureStorage()