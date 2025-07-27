const input=document.querySelector(".inp");
const btn=document.querySelector(".btn-search");
const mList=document.querySelector(".moviesList");
async function movie(){
    try{
        mList.innerHTML="";
        const MovieName=input.value.trim().toLowerCase();
        if(!MovieName){
            alert("Enter movie name first");
        }
        const response=await fetch(`https://www.omdbapi.com/?s=${MovieName}&apikey=cbb546d7`);//t=moviename u ge exact movie details but s= u get the list of names
        if(!response.ok){
            throw new Error("Couldnt find the movie You were looking for");
        }

        const data=await response.json();
        console.log(data);
        if(data.Response==="False"){
            mList.innerHTML=`<p style='color:white;'>${data.Error}</p>`;
        }
        lenItems=data.Search.length;
        console.log(lenItems);//got the no of results
        mList.style.cssText="display:flex; gap:20px;flex-wrap:wrap; padding:20px;";//wrap to allow movies to fill many lines instead of all in one
        for(let i=0;i<lenItems;i++){
            const poster=document.createElement("div");
            poster.style.cssText="position:relative;height:300px; width:250px; display:flex; flex-direction:column; gap:20px; align-items:center; justify-content:center;";
            const mvname=document.createElement("div");
            mvname.style.cssText="position:absolute;z-index:2000;top:260px;left:10px; width:190px;";//to ensure h2 is on top of poster and visible
            const year=document.createElement("div");
            year.style.cssText="position:absolute;z-index:2000;top:260px;left:200px;";//to ensure h3 is on top of poster and visible
            const MoviePoster=document.createElement("img");//now take img from api into mvimg.src="";
            const img=data.Search[i].Poster;
            MoviePoster.src=img;
            MoviePoster.style.cssText="position:absolute; top:0;height:250px; width:250px; z-index:1;";//no need for name its already there in movie
            const title=data.Search[i].Title;
            mvname.textContent=title;
            const yr=data.Search[i].Year;
            year.textContent=yr;
            //now my aim is to put movie type and yr inline so use span
            const spans=document.createElement("span");

            poster.appendChild(MoviePoster);
            spans.appendChild(mvname);
            spans.appendChild(year);
            poster.appendChild(spans);
            mList.appendChild(poster);
        }
    }
    catch(e){
        console.error(e);
    }
}

btn.addEventListener("click",movie);
input.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        movie();
    }
});