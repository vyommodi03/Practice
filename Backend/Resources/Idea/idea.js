let defaultIdeas = ["Go grab a glass of water.",
    "Slowly look all the way left, then right.",
    "Slowly look all the way up, then down.",
    "Close your eyes and take few deep breaths.",
    "Stand from your chair and stretch.",
    "Close your eyes and count your breaths.",
    "Take a moment to smile at being alive."
];

let IdeasArray = new Array();
IdeasArray = JSON.parse(localStorage.getItem("Ideas"));

if(IdeasArray === null){
    IdeasArray = defaultIdeas;
}

let list = document.getElementById("ideaList");

function checkInputText(value,msg) {
    if(value == null || value == ""){
        alert(msg);
        return true;
    }
    return false;
}

function Delete(value){
    let index = -1;
    for(i = 0;i<IdeasArray.length ; i+=1){
        if(IdeasArray[i] === value){
            index = i;
            break;
        }
    }
    if(index != -1){
        list.removeChild(list.childNodes[index]);
        IdeasArray.splice(index,1);
        localStorage.setItem("Ideas",JSON.stringify(IdeasArray));
    }
}

function init () {
    for(i = 0 ; i < IdeasArray.length ; i+=1){
        let tmp = document.createElement("div");
        tmp.id = "idea";
        let nm = document.createElement("p");
        nm.innerHTML = IdeasArray[i];
        tmp.appendChild(nm);
        if(i > defaultIdeas.length - 1 ){
            let but = document.createElement("button");
            // but.id = IdeasArray[i];
            but.type = "button";
            but.className = "btn btn-success";
            but.setAttribute("onclick",`Delete(`+`'`+`${IdeasArray[i]}`+`')`);
            but.innerHTML =  "DELETE";
            tmp.appendChild(but);
        }

        list.appendChild(tmp);
    }
}

let addIdea = document.getElementById("submit");

addIdea.onclick = async() => {
    let userIdea = document.getElementById("htmlIdea").value;
    for(let i=0; i < IdeasArray.length ; i++){
        if(IdeasArray[i] == userIdea){
            alert("Idea already listed");
            return;
        }
    }
    IdeasArray.push(userIdea);
    let tmp = document.createElement("div");
    tmp.id = "idea";
    let nm = document.createElement("p");
    nm.innerHTML = IdeasArray[IdeasArray.length - 1];
    tmp.appendChild(nm);
    let but = document.createElement("button");
    but.id = IdeasArray[IdeasArray.length - 1];
    but.type = "button";
    but.className = "btn btn-danger";
    but.setAttribute("onclick",`Delete(`+`'`+`${IdeasArray[IdeasArray.length - 1]}`+`')`);
    but.innerHTML = "DELETE";
    tmp.appendChild(but);
    list.appendChild(tmp);
    localStorage.setItem("Ideas", JSON.stringify(IdeasArray));

}

init();