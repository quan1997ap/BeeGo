export function getStorageService(storageName){
    return new Promise( (resolve, reject) => {
      let token = localStorage.getItem(storageName);
      if (token !== undefined){
        resolve(token);
      } 
      else{
        resolve( `${storageName} invalid`);
      }
    })
  } 
  
  
export function setStorageService(storageName, data){
  return new Promise( (resolve, reject) => {
    localStorage.setItem(storageName, data);
    resolve('set token success');
  })
  
} 
  
  