//WORKING HERE
async function loopCities(callback) {
    let cities = await makeReq('https://api.teleport.org/api/urban_areas');
    const results = [];
    cities = cities._links["ua:item"];
    for(let i=0; i<cities.length; i++){
        let bool = await callback(cities[i]);
        if(bool){
            results.push(cities[i]);
            console.log(cities[i].name);
        }
    }
    return results;
}


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
    try {
        //loops through all the cities and returns an array of cities with matching names 
        const results = await loopCities(city => city.name.includes(search) ? true : false);
        
        if(results.length === 0){
            console.log("No results.");
        } else if (results.length > 1){
            console.log("Choose an area");
            results.forEach(city => console.log(city));
        } else {
            console.log(results[0].name);
            const score = await getScore(results[0]);
            //find all cities with similar scores
            console.log(score);
            const similarCities = await loopCities((city) => isSimilar(city, score));
            console.log(similarCities);
        }
    } catch(error) {
        console.log(error);
    }
}

async function isSimilar(city, score){
    //await the city's score
    let cScore = await getScore(city);
    //if the score is in the right range, then return true
    if(cScore > (score - 1) && cScore < (score + 1) && cScore != score){
        return true;
    } else {
        return false;
    }
}


async function getScore(cityObj) {
    //given a city object, returns a score
    const link = `${cityObj.href}scores/`
    let score;
        try {
            score = await makeReq(link);
            //get the results from the href   
            return score.teleport_city_score;

        } catch (error) {
            console.log(error);
        }
}   

async function getSimilarScore(score) {
    console.log('Finding similar score: ');
    try {
        let cities = await makeReq('https://api.teleport.org/api/urban_areas');
        //for each ._links["ua:item"] , get the score 
        console.log("Cities "+cities);
        cities.forEach(city => {
            console.log(getScore(city));
            if( getScore(city) > score - 5 && getScore(city) < score + 5){
                console.log("Similar Score: "+city);
            };
        });

    } catch {

    }
}



document.getElementById('submit').addEventListener('click', () =>{
    getUAs(document.getElementById('searchInput').value); 
});



