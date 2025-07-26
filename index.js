const input=document.querySelector(".inp");
const btn=document.querySelector(".btn-search");
const mList=document.querySelector(".moviesList");
async function movie(){
    try{
        const MovieName=input.value.trim().toLowerCase();
        const response=await fetch(`http://www.omdbapi.com/?s=${MovieName}&apikey=cbb546d7`);//t=moviename u ge exact movie details but s= u get the list of names
        if(!response.ok){
            throw new Error("Couldnt find the movie You were looking for");
        }
        const data=await response.json();
        console.log(data);
        lenItems=data.Search.length;
        console.log(lenItems);//got the no of results
        mList.style.cssText="display:flex; gap:20px; border:5px solid black; flex-wrap:wrap; padding:20px;";
        for(let i=0;i<lenItems;i++){
            const poster=document.createElement("div");
            poster.style.cssText="border:5px solid black;position:relative;height:250px; width:250px; display:flex; flex-direction:column; gap:20px; align-items:center; justify-content:center;";
            const h2=document.createElement("h2");
            h2.style.cssText="position:absolute;z-index:2000; top:200px;";//to ensure h2 is on top of poster and visible
            const h3=document.createElement("h3");
            h3.style.cssText="position:absolute;z-index:2000;top:200px;";//to ensure h3 is on top of poster and visible
            const MoviePoster=document.createElement("img");//now take img from api into mvimg.src="";
            const img=data.Search[i].Poster;
            MoviePoster.src=img;
            MoviePoster.style.cssText="position:absolute; height:250px; width:250px; z-index:1;";//no need for name its already there in movie
            const type=data.Search[i].Type;
            h2.textContent=type;
            const yr=data.Search[i].Year;
            h3.textContent=yr;
            //now my aim is to put movie type and yr inline so use span
            const spans=document.createElement("span");

            poster.appendChild(MoviePoster);
            spans.appendChild(h2);
            spans.appendChild(h3);
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