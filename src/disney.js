// Add code here
//will work on a list of movie objs


function bestMovie(data){
// max "imdb_rating"
    const fdata= data.map(function(obj){
        try { return parseFloat(obj.imdb_rating);}
        catch(err){ return 0;} 
    });

    const filtered= fdata.filter(obj => { return isNaN(obj)!==true ; });
    const maxRate = filtered.reduce(function(a, b) {
        return Math.max(a, b);
    });
    const result = data.filter(obj => { return maxRate ===parseFloat(obj.imdb_rating); });
    return result;
}




function getMoviesByActor(data,actorName){
//Returns: an Array of movie titles with specified actor_name
    const result = data.filter(obj => { if (Array.isArray(obj.Starring)){
        return obj.Starring.includes(actorName);} else{ return obj.Starring === actorName;}});
    const titles = result.map(function(a) {return a.title;});
    return titles;
}

function listCriticallyAcclaimedMovies(data) {
//Returns an Array containing the movie title and the metascore
    const arr = data.filter(obj => { return parseFloat(obj.metascore) > 8;});
    const result= arr.map(function(a){return {title:a.title, metascore:a.metascore};});
    return result;
}

function getAverageLength(data) {
//average length (runtime) of movies in the entire dataset; 
//ignore movies without a length or non-numeric length
//"Running time (int)"
    const times =data.map(function(a) {return a['Running time (int)'];});
    const sum= times.reduce(function(a,b){return a+b;},0);
    const avg= sum/times.length;
    return avg;

}


module.exports = {
    bestMovie: bestMovie,
    getMoviesByActor: getMoviesByActor,
    listCriticallyAcclaimedMovies: listCriticallyAcclaimedMovies,
    getAverageLength: getAverageLength
};



