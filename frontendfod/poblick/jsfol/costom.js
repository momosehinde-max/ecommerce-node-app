  
 
 export function prodoct() {
     return fetch('/prodot',
      {method:'GET'})
      .then((dater) => dater.json())
    };




      
    