  
 
 export function prodoct() {
     return fetch('http://localhost:3500/prodot',
      {method:'GET'})
      .then((dater) => dater.json())
    };




      
    