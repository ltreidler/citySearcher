//import bodyParser from 'body-parser';
// import axios from 'axios';
//import express from 'express';



    console.log('go');
// const getUAs = function(search) {   
//     var request = new XMLHttpRequest()

//     request.open('GET', 'https://api.teleport.org/api/urban_areas', true);
    
//     request.onload = function() {
//         var cities = (JSON.parse(this.response));
        
//         if (request.status >= 200 && request.status < 400) {
//             cities = cities._links["ua:item"];
//             cities.forEach(city => {
//                 (city.name).includes(search) ? console.log(city) : null;
//             });
//         } else {
//             console.log('error');
//         }
//     }
    
//     request.send();
// }



function makeReq(url) {
    let data;

    return new Promise( (resolve, reject) => {
        var request = new XMLHttpRequest()

        request.open('GET', url, true);
        
        request.onload = function() {
            data = (JSON.parse(this.response));
            if (request.status >= 200 && request.status < 400) {
                
                resolve(data);
                return data;
            } else {
                console.log('error');
                reject();
            }
        }  

        request.send(); 

    });
}

async function getUAs(search) {    
    let results = [];
    try {
        let cities = await makeReq('https://api.teleport.org/api/urban_areas');
        cities = cities._links["ua:item"];
        cities.forEach(city => {
            if((city.name).includes(search)){
                results.push(city);
            }
        });
        results.length === 0 ? console.log('No results') : console.log(results);

    } catch(error) {
        console.log(error);
    }
    
}



document.getElementById('submit').addEventListener('click', () =>{
    getUAs(document.getElementById('searchInput').value); 
});



