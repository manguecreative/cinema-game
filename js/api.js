const APIKey = '15abdf99fb623409a747e0f158f9ef01';
const BASEURL = "https://api.themoviedb.org/3/";

function getData(url){
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    console.log(
                        "Looks like there was a problem. Status Code: " + response.status
                    );
                    return; //returns undefined!
                }

                // Examine the text in the response
                response.json().then(data => {
                    resolve(data);
                });
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
                reject(err)
            });
    })
}

//A utiliser avec "await" pour le chargement asynchrone
async function getActor(id) {
    console.log("Chargement en cours des datas de l'acteur...");
    const data = await getData(BASEURL+"person/"+id+"?api_key="+APIKey+"&language=us-US");
    //const data = BASEURL+"person/"+id+"?api_key="+APIKey+"&language=fr-FR";
    console.log("Chargement terminé !");
    return data;
}
//A utiliser avec "await" pour le chargement asynchrone
async function getActorMovieDetail(id) {
    console.log("Chargement en cours des datas de l'acteur...");
    const data = await getData(BASEURL+"person/"+id+"/movie_credits"+"?api_key="+APIKey+"&language=us-US");
    //const data = BASEURL+"person/"+id+"?api_key="+APIKey+"&language=fr-FR";
    console.log("Chargement terminé !");
    return data;
}
//A utiliser avec "await" pour le chargement asynchrone
async function getMovie(id) {
    console.log("Chargement en cours des datas du film...");
    const data = await getData(BASEURL+"movie/"+id+"?api_key="+APIKey+"&language=us-US");
    console.log("Chargement terminé !");
    return data;
}

//Zone custom - pour vos propres fonctions


//Fin de zone custom