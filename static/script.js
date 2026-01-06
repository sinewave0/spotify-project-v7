const submitBtn1 = document.querySelector(".submit1");
const chicken1 = document.querySelector("#inputURL1");
const songList1 = document.querySelector(".unordered1");


const submitBtn2 = document.querySelector(".submit2");
const chicken2 = document.querySelector("#inputURL2");
const songList2 = document.querySelector(".unordered2");
const intersectedSongList = document.querySelector(".intersectedItems")

const intersectionButton = document.querySelector(".intersectionButton");

const downloadAllOneBtn = document.querySelector(".downloadAllOne")
const masterDownloader = document.querySelector(".masterDownloader")

var setOneSize; 
var setTwoSize;
var setIntersectionSize;

let uniqueSongs1 = new Set();
let uniqueSongs2 = new Set();
let intersectionSet = new Set();

// submitBtn1.addEventListener("click", async function() {
//     try {

//         const chicken11 = extractPlaylistId(chicken1.value);


//         const response = await fetch(`http://127.0.0.1:8080/fetch_songss?chicken11=${encodeURIComponent(chicken11)}`, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Playlist data:', data);
        
//         songList1.innerHTML = '';
//         data.forEach(item => {
//             const listItem = document.createElement('li');
//             listItem.textContent = item.track.name;
//             songList1.appendChild(listItem);
//             console.log(item.track.name);
//         });

//     } catch (error) {
//         console.error('Error fetching playlist:', error);
//         alert('Error fetching playlist data');
//     }
// });

function extractPlaylistId(inputString){
    inputString = inputString.trim();
    if(inputString.includes("playlist/")){
        inputString = inputString.split("playlist/")[1];
    }
    return inputString;
}

function extractUserId(inputString){
    inputString = inputString.trim();
    if(inputString.includes("user/")){
        inputString = inputString.split("user/")[1];
    }
    return inputString;
}

function findSetintersec(){
    if(uniqueSongs1.size ===0 || uniqueSongs2.size === 0){
        alert("dude we need both sides of the equation to find intersection");
        return;    
    }
    intersectedSongList.innerHTML = '';
    intersectionSet.clear();
    for (const song of uniqueSongs1){
        if (uniqueSongs2.has(song)){
            intersectionSet.add(song);
            const listItem = document.createElement('li');
            listItem.textContent = song;
            intersectedSongList.appendChild(listItem);
        }
    }
    setIntersectionSize = intersectionSet.size;
    console.log(`the total size of the intersection size is ${setIntersectionSize}` );
    console.log(`the common songs are`, Array.from(intersectionSet) );


}


// submitBtn2.addEventListener("click", async function() {
//     try {

//         const chicken22 = extractPlaylistId(chicken2.value);


//         const response = await fetch(`http://127.0.0.1:8080/fetch_songsss?chicken22=${encodeURIComponent(chicken22)}`, {
//             method: 'GET',
//             headers: {
//                 'Accept': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log('Playlist data:', data);
        
//         songList2.innerHTML = '';
//         data.forEach(item => {
//             const listItem = document.createElement('li');
//             listItem.textContent = item.track.name;
//             songList2.appendChild(listItem);
//             console.log(item.track.name);
//         });

//     } catch (error) {
//         console.error('Error fetching playlist:', error);
//         alert('Error fetching playlist data');
//     }
// });


submitBtn1.addEventListener("click", async function() {
    try {

        const panipuri1 = extractUserId(chicken1.value);


        const response = await fetch(`http://127.0.0.1:5000/fetch_god?panipuri1=${encodeURIComponent(panipuri1)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Users all playlisttt data:', data);
        
        songList1.innerHTML = '';
        uniqueSongs1.clear();
        for (const playlist of data.items){
            const playlistId = playlist.id; 
            console.log(`fetching songs for playlist ${playlistId} ${playlist.name}`);
            
            const songResponse = await fetch(`http://127.0.0.1:5000/fetch_songss?chicken11=${encodeURIComponent(playlistId)}`);
            if(!songResponse.ok){
                console.warn(`couldnt fetch songs for the playlist ${playlist.name}`);
                continue;
            }
            const songData = await songResponse.json();
            songData.forEach(item =>{
                if(item && item.track && item.track.name && !uniqueSongs1.has(item.track.name)){
                    uniqueSongs1.add(item.track.name)
                    const listItem = document.createElement('li');
                    listItem.textContent = item.track.name;
                    songList1.appendChild(listItem);
                }
            });
        }

        // data.items.forEach(playlist => {
        //     const listItem = document.createElement('li');
        //     listItem.textContent = playlist.id;
        //     songList1.appendChild(listItem);
        //     console.log(playlist.id);
        // });
        console.log(uniqueSongs1);
        setOneSize = Number(uniqueSongs1.size);

        const artistResponse = await fetch(`http://127.0.0.1:5000/fetch_top_gods?rasmalai=${encodeURIComponent(panipuri1)}`);
        if (artistResponse.ok) {
            const artistData = await artistResponse.json();
            const artistList = document.querySelector('.top-artists-1');
            artistList.innerHTML = '';
            
            artistData.top_gods.forEach(artist => {
                const li = document.createElement('li');
                li.textContent = `${artist.name} (${artist.count} tracks)`;
                artistList.appendChild(li);
            });
        }

    } catch (error) {
        console.error('Error fetching users all valueeee:', error);
        alert('Error fetching users all valueee attt 129 data');
    }
    
});

submitBtn2.addEventListener("click", async function() {
    try {

        const panipuri2 = extractUserId(chicken2.value);


        const response = await fetch(`http://127.0.0.1:5000/fetch_god?panipuri1=${encodeURIComponent(panipuri2)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Users all playlisttt data:', data);
        
        songList2.innerHTML = '';
        uniqueSongs2.clear();
        for (const playlist of data.items){
            const playlistId = playlist.id; 
            console.log(`fetching songs for playlist ${playlistId} ${playlist.name}`);
            
            const songResponse = await fetch(`http://127.0.0.1:5000/fetch_songsss?chicken22=${encodeURIComponent(playlistId)}`);
            if(!songResponse.ok){
                console.warn(`couldnt fetch songs for the playlist ${playlist.name}`);
                continue;
            }
            const songData = await songResponse.json();
            songData.forEach(item =>{
                if(item && item.track && item.track.name && !uniqueSongs2.has(item.track.name)){
                    uniqueSongs2.add(item.track.name)
                    const listItem = document.createElement('li');
                    listItem.textContent = item.track.name;
                    songList2.appendChild(listItem);
                }
            });
        }

        // data.items.forEach(playlist => {
        //     const listItem = document.createElement('li');
        //     listItem.textContent = playlist.id;
        //     songList1.appendChild(listItem);
        //     console.log(playlist.id);
        // });
        console.log(uniqueSongs2);
        setTwoSize = Number(uniqueSongs2.size);
        const artistResponse = await fetch(`http://127.0.0.1:5000/fetch_top_gods?rasmalai=${encodeURIComponent(panipuri2)}`);
        if (artistResponse.ok) {
            const artistData = await artistResponse.json();
            const artistList = document.querySelector('.top-artists-2');
            artistList.innerHTML = '';
            
            artistData.top_gods.forEach(artist => {
                const li = document.createElement('li');
                li.textContent = `${artist.name} (${artist.count} tracks)`;
                artistList.appendChild(li);
            });
        }


    } catch (error) {
        console.error('Error fetching users all valueeee:', error);
        alert('Error fetching users all valueee attt 129 data');
    }
    
});

intersectionButton.addEventListener("click", findSetintersec);

downloadAllOneBtn.addEventListener("click", function(){


    const panipuri1 = extractUserId(chicken1.value);
    if(!panipuri1){
        alert("please enter a valid spotigu URL dude")
        return 
    }
    window.location.href = `/download_all_songs?panipuri1=${encodeURIComponent(panipuri1)}`
});

masterDownloader.addEventListener("click", ()=>{
    fetch("http://127.0.0.1:5000/master_download_all_songs", { method: "POST" })
})