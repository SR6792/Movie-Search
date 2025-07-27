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
            poster.style.cssText="position:relative;height:300px; width:200px; display:flex; background:black;flex-direction:column; gap:20px; align-items:center; justify-content:center;";
            const mvname=document.createElement("div");
            mvname.style.cssText="position:absolute;z-index:2000;top:260px;left:10px; width:160px;";//to ensure h2 is on top of poster and visible
            const year=document.createElement("div");
            year.style.cssText="position:absolute;z-index:2000;top:260px;left:160px;";//to ensure h3 is on top of poster and visible
            const MoviePoster=document.createElement("img");//now take img from api into mvimg.src="";
            const img=data.Search[i].Poster;
            MoviePoster.src=img;
            MoviePoster.style.cssText="position:absolute; top:0;height:250px; width:200px; z-index:1;";//no need for name its already there in movie
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
            poster.addEventListener("mouseenter",hover);
            poster.addEventListener("mouseleave",unhover);
            //both hover and unhover done
            function hover(){
                const mv=data.Search[i].Title;
                moreD(poster,mv);
            }
            function unhover(){
                const details=poster.querySelector(".details")
                if(details) details.remove();//removes entire plot etc
            }
        }
        //create a async function to get more details on movies on hover
        async function moreD(post,title){//instead of poster its post
            try{
                //before doing the function dont foreget to check if i have already hovered so as to not append
                if(post.querySelector(".details")) return;//prevents appending checks if i have already hovered
                const response2=await fetch(`https://www.omdbapi.com/?t=${title}&apikey=cbb546d7`);
                const moreData=await response2.json();
                if(!moreData.Plot) return;//check if plot is thwere else reutnrs
                const mdetails=document.createElement("div");
                mdetails.classList.add("details");//gives class name to mdetails
                const plot=document.createElement("div");
                plot.textContent=moreData.Plot;
                mdetails.appendChild(plot);
                mdetails.style.cssText="position:absolute;z-index:2000;top:300px; background:black;";
                post.appendChild(mdetails);
            }
            catch(e){
                console.error(e);
            }
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


