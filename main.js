// === MUSIC DATA ===
const musicData = {
    newReleases:[
        {title:"Regret", img:"https://i.postimg.cc/vHKWn07R/51-Bvif-CGm-L-UXNa-N-FMjpg-QL85.jpg", artist:"Sidhu Moose wala", audio:"https://files.catbox.moe/loytir.mp3"},
        
        {title:"Watch out", img:"https://i.postimg.cc/P56K2yMh/Watch-Out-Punjabi-2023-20231112095134-500x500.jpg", artist:"Sidhu Moose wala", audio:"https://files.catbox.moe/ytkn3o.mp3"},
        
        {title:"Syl", img:"https://i.postimg.cc/JnXq7LCn/55994.webp", artist:"Sidhu Moose wala", audio:"https://files.catbox.moe/sw6wcy.mp3"},
        
        {title:"Roti", img:"https://i.postimg.cc/nrYG7Gzm/Roti-Punjabi-2020-20200506103038-500x500.jpg", artist:"Sidhu Moose wala", audio:"https://files.catbox.moe/9jflrl.mp3"},
        
        {title:"So high", img:"https://i.postimg.cc/3J1Zx1Vq/So-High-Punjabi-2017-20220811172517-500x500.jpg", artist:"Sidhu Moose wala", audio:"https://files.catbox.moe/0f8nth.mp3"},
        
        {title:"Who banaya", img:"https://i.postimg.cc/k56Nwm4x/artworks-tj-GUx-I3-Pc4r-E-0-t500x500.jpg", artist:"Emiway bantai", audio:"https://files.catbox.moe/x3j3xg.mp3"},
        
        {title:"machayega", img:"https://i.postimg.cc/0jxp8Kf1/800x800cc.jpg", artist:"Emiway bantai", audio:"https://files.catbox.moe/25d9fw.mp3"},
        
        {title:"indipendent", img:"https://i.postimg.cc/bv7xBBSS/0x1900-000000-80-0-0.jpg", artist:"Emiway bantai", audio:"https://files.catbox.moe/cnqul4.mp3"},
        
        {title:"jallad", img:"https://i.postimg.cc/D0g1mfjs/Jallad-Hindi-2019-20210210204408-500x500.jpg", artist:"Emiway bantai", audio:"https://files.catbox.moe/2rjlrn.mp3"},
        
        {title:"Dubai company", img:"https://i.postimg.cc/HsYQR5n0/0x1900-000000-80-0-0-1.jpg", artist:"Emiway bantai", audio:"https://files.catbox.moe/zvv5d7.mp3"},
        
        {title:"Primium dikhava", img:"https://i.postimg.cc/02VpsQJ9/51-GLORIOUS-DAYS-Hindi-2025-20250930171003-500x500.jpg", artist:"Yo Yo honey Singh", audio:"https://files.catbox.moe/9c02j8.mp3"},
        
        {title:"Bichhudo", img:"https://i.postimg.cc/02VpsQJ9/51-GLORIOUS-DAYS-Hindi-2025-20250930171003-500x500.jpg", artist:"Yo Yo honey Singh", audio:"https://files.catbox.moe/wz4rku.mp3"},
        
        {title:"Naam honey Singh", img:"https://i.postimg.cc/02VpsQJ9/51-GLORIOUS-DAYS-Hindi-2025-20250930171003-500x500.jpg", artist:"Yo Yo honey Singh", audio:"https://files.catbox.moe/h37ldh.mp3"},
        
        {title:"Sikka", img:"https://i.postimg.cc/bJfnTS4Y/Sikka-Punjabi-2025-20250903134326-500x500.jpg", artist:"Yo Yo honey Singh", audio:"https://files.catbox.moe/in01su.mp3"},
        
        {title:"Rap God", img:"https://i.postimg.cc/HnpyGDpq/GLORY-Hindi-2024-20250117161048-500x500.jpg", artist:"Yo Yo honey Singh", audio:"https://files.catbox.moe/ayfha4.mp3"},

        {title:"Trend", img:"hndttps://i.postimg.cc/fywVrKYR/s2.webp", artist:"Sidhu moosw wala", audio:"https://files.catbox.moe/6mix2n.mp3"}
        
        
    ],
    mixesForYou:[
        {title:"Mix 1", img:"https://picsum.photos/200?random=4", artist:"Artist G", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"},
        {title:"Mix 2", img:"https://picsum.photos/200?random=5", artist:"Artist H", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"}
    ],
    artists:[
        {name:"Artist 1", img:"https://picsum.photos/200?random=6"},
        {name:"Artist 2", img:"https://picsum.photos/200?random=7"},
        {name:"Artist 3", img:"https://picsum.photos/200?random=8"}
    ]
};

// === PLAYER STATE ===
let currentPlaylist = musicData.newReleases; // Default playlist
let currentSongIndex = 0;
let isPlaying = false;

// === GREETING ===
function updateGreeting(){
    const greetingEl=document.getElementById('time-greeting');
    const now=new Date();
    const hour=now.getHours();
    let greetingText="";
    if(hour>=5 && hour<12) greetingText="Good Morning 🌞";
    else if(hour>=12 && hour<17) greetingText="Good Afternoon ☀️";
    else if(hour>=17 && hour<21) greetingText="Good Evening 🌙";
    else greetingText="Good Night 🌙";
    greetingText+=" | "+now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    greetingEl.textContent=greetingText;
}
setInterval(updateGreeting,1000);
updateGreeting();

// === POPULATE SECTIONS ===
const content=document.getElementById('content');
function createSection(title, items, type){
    const section=document.createElement('div'); section.classList.add('section');
    const sectionTitle=document.createElement('div'); sectionTitle.classList.add('section-title');
    const h2=document.createElement('h2'); h2.textContent=title;
    sectionTitle.appendChild(h2); section.appendChild(sectionTitle);

    if(type==="playlist") {
        // For New Releases section - use multi-row layout
        if(title === "New Releases") {
            const playlistSection = document.createElement('div');
            playlistSection.classList.add('playlist-section');
            
            const rowsContainer = document.createElement('div');
            rowsContainer.classList.add('playlist-rows-container');
            
            // Split items into rows of 10 songs each
            const rows = [];
            for (let i = 0; i < items.length; i += 10) {
                rows.push(items.slice(i, i + 10));
            }
            
            // Create a row for each group of 10 songs
            rows.forEach((rowItems, rowIndex) => {
                const row = document.createElement('div');
                row.classList.add('playlist-row');
                
                rowItems.forEach((item, index) => {
                    const card=document.createElement('div');
                    card.classList.add('playlist-card');
                    card.innerHTML=`<div class="playlist-img"><img src="${item.img}" alt=""></div><h4>${item.title}</h4><p>${item.artist}</p>`;
                    row.appendChild(card);
                    card.addEventListener('click',()=>{
                        currentPlaylist = items;
                        currentSongIndex = rowIndex * 10 + index;
                        playSong(item);
                    });
                    setTimeout(()=>card.classList.add('show'), Math.random()*300);
                });
                
                rowsContainer.appendChild(row);
            });
            
            playlistSection.appendChild(rowsContainer);
            section.appendChild(playlistSection);
        } 
        // For other playlist sections - use original single row layout
        else {
            const container=document.createElement('div');
            container.classList.add('playlist-container');

            items.forEach((item, index)=>{
                const card=document.createElement('div');
                card.classList.add('playlist-card');
                card.innerHTML=`<div class="playlist-img"><img src="${item.img}" alt=""></div><h4>${item.title}</h4><p>${item.artist}</p>`;
                container.appendChild(card);
                card.addEventListener('click',()=>{
                    currentPlaylist = items;
                    currentSongIndex = index;
                    playSong(item);
                });
                setTimeout(()=>card.classList.add('show'), Math.random()*300);
            });
            section.appendChild(container);
        }
    } else if(type==="artists") {
        const container=document.createElement('div');
        container.classList.add('artists-grid');

        items.forEach(item=>{
            const card=document.createElement('div');
            card.classList.add('artist-card');
            card.innerHTML=`<img src="${item.img}" alt=""><h4>${item.name}</h4>`;
            container.appendChild(card);
        });
        section.appendChild(container);
    }
    
    content.appendChild(section);
}

createSection("New Releases", musicData.newReleases,"playlist");
createSection("Mixes For You", musicData.mixesForYou,"playlist");
createSection("Artists", musicData.artists,"artists");

// === RECENTLY PLAYED ===
let recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed")||"[]");
function updateRecentlyPlayed(){
    const oldSection=document.querySelector('.recently-section');
    if(oldSection) oldSection.remove();
    if(recentlyPlayed.length===0) return;

    const section=document.createElement('div'); section.classList.add('section','recently-section');
    const sectionTitle=document.createElement('div'); sectionTitle.classList.add('section-title');
    const h2=document.createElement('h2'); h2.textContent="Recently Played"; sectionTitle.appendChild(h2);
    section.appendChild(sectionTitle);

    // Keep the original horizontal scrolling for Recently Played
    const container=document.createElement('div'); container.classList.add('playlist-container');
    recentlyPlayed.forEach((song,index)=>{
        const card=document.createElement('div'); card.classList.add('playlist-card');
        setTimeout(()=>card.classList.add('show'), index*100);
        card.innerHTML=`<div class="playlist-img"><img src="${song.img}" alt=""></div><h4>${song.title}</h4><p>${song.artist}</p>`;
        container.appendChild(card);
        card.addEventListener('click',()=>{
            // Find the song in the current playlist
            const songIndex = currentPlaylist.findIndex(s => s.audio === song.audio);
            if (songIndex !== -1) {
                currentSongIndex = songIndex;
            } else {
                // If not found in current playlist, use New Releases as default
                currentPlaylist = musicData.newReleases;
                currentSongIndex = musicData.newReleases.findIndex(s => s.audio === song.audio);
            }
            playSong(song);
        });
    });
    section.appendChild(container);
    content.prepend(section);
}
updateRecentlyPlayed();

// === PLAYER ===
const nowPlayingBar=document.getElementById('nowPlaying');
const playPauseBtn=document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const miniPlayerCover = document.getElementById('miniPlayerCover');
const miniPlayerTitle = document.getElementById('miniPlayerTitle');
const miniPlayerArtist = document.getElementById('miniPlayerArtist');
const seekBar = document.getElementById('seekBar');
const seekBarProgress = document.getElementById('seekBarProgress');
const seekBarHandle = document.getElementById('seekBarHandle');

// Full Player Elements
const fullPlayer = document.getElementById('fullPlayer');
const closeFullPlayerBtn = document.getElementById('closeFullPlayer');
const fullPlayerCover = document.getElementById('fullPlayerCover');
const fullPlayerTitle = document.getElementById('fullPlayerTitle');
const fullPlayerArtist = document.getElementById('fullPlayerArtist');
const fullPlayerPlayPause = document.getElementById('fullPlayerPlayPause');
const fullPlayerPrev = document.getElementById('fullPlayerPrev');
const fullPlayerNext = document.getElementById('fullPlayerNext');
const fullPlayerSeekBar = document.getElementById('fullPlayerSeekBar');
const fullPlayerSeekProgress = document.getElementById('fullPlayerSeekProgress');
const fullPlayerSeekHandle = document.getElementById('fullPlayerSeekHandle');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');

let audio=new Audio();
let isSeeking = false;
let isFullPlayerSeeking = false;

// Navigation state
let navigationStack = ['home']; // Track navigation history

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function playSong(song){
    audio.src=song.audio;
    audio.play();
    isPlaying = true;
    
    // Update mini player
    miniPlayerCover.src=song.img;
    miniPlayerTitle.textContent=song.title;
    miniPlayerArtist.textContent=song.artist||"";
    nowPlayingBar.style.display="flex";
    playPauseBtn.classList.replace('bx-play-circle','bx-pause-circle');
    
    // Update full player
    fullPlayerCover.src = song.img;
    fullPlayerTitle.textContent = song.title;
    fullPlayerArtist.textContent = song.artist || "";
    fullPlayerPlayPause.classList.replace('bx-play-circle','bx-pause-circle');

    recentlyPlayed = recentlyPlayed.filter(s=>s.audio!==song.audio);
    recentlyPlayed.unshift(song);
    if(recentlyPlayed.length>12) recentlyPlayed.pop();
    localStorage.setItem("recentlyPlayed",JSON.stringify(recentlyPlayed));
    updateRecentlyPlayed();
}

// === PLAY/PAUSE ===
function togglePlayPause() {
    if(audio.src){
        if(audio.paused){ 
            audio.play(); 
            playPauseBtn.classList.replace('bx-play-circle','bx-pause-circle'); 
            fullPlayerPlayPause.classList.replace('bx-play-circle','bx-pause-circle');
            isPlaying = true;
        } else { 
            audio.pause(); 
            playPauseBtn.classList.replace('bx-pause-circle','bx-play-circle'); 
            fullPlayerPlayPause.classList.replace('bx-pause-circle','bx-play-circle');
            isPlaying = false;
        }
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);
fullPlayerPlayPause.addEventListener('click', togglePlayPause);

// === NEXT/PREVIOUS BUTTONS ===
function playPreviousSong() {
    if (currentPlaylist.length === 0) return;
    
    currentSongIndex = (currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    const song = currentPlaylist[currentSongIndex];
    playSong(song);
}

function playNextSong() {
    if (currentPlaylist.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
    const song = currentPlaylist[currentSongIndex];
    playSong(song);
}

prevBtn.addEventListener('click', playPreviousSong);
fullPlayerPrev.addEventListener('click', playPreviousSong);

nextBtn.addEventListener('click', playNextSong);
fullPlayerNext.addEventListener('click', playNextSong);

// Auto-play next song when current song ends
audio.addEventListener('ended', () => {
    playNextSong();
});

// === FULL PLAYER ===
function showFullPlayer() {
    fullPlayer.classList.add('show');
    navigationStack.push('fullPlayer');
}

function hideFullPlayer() {
    fullPlayer.classList.remove('show');
    navigationStack.pop(); // Remove full player from navigation stack
}

closeFullPlayerBtn.addEventListener('click', hideFullPlayer);

// Click anywhere on mini player (except controls) to open full player
nowPlayingBar.addEventListener('click', function(e) {
    // Only open full player if not clicking on control buttons
    if (!e.target.closest('.player-controls')) {
        showFullPlayer();
    }
});

// === SEEK BAR FUNCTIONALITY ===
function updateSeekBar() {
    if (!isSeeking && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        seekBarProgress.style.width = `${progress}%`;
        seekBarHandle.style.left = `${progress}%`;
    }
    
    if (!isFullPlayerSeeking && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        fullPlayerSeekProgress.style.width = `${progress}%`;
        fullPlayerSeekHandle.style.left = `${progress}%`;
        
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    }
}

audio.addEventListener('timeupdate', updateSeekBar);

// Seek bar interaction for mini player
seekBar.addEventListener('mousedown', startSeeking);
seekBar.addEventListener('touchstart', startSeeking);

function startSeeking(e) {
    isSeeking = true;
    updateSeekPosition(e);
    
    document.addEventListener('mousemove', updateSeekPosition);
    document.addEventListener('touchmove', updateSeekPosition);
    document.addEventListener('mouseup', stopSeeking);
    document.addEventListener('touchend', stopSeeking);
}

function updateSeekPosition(e) {
    if (!isSeeking) return;
    
    const rect = seekBar.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let position = (clientX - rect.left) / rect.width;
    position = Math.max(0, Math.min(1, position));
    
    const progress = position * 100;
    seekBarProgress.style.width = `${progress}%`;
    seekBarHandle.style.left = `${progress}%`;
    
    if (audio.duration) {
        audio.currentTime = position * audio.duration;
    }
}

function stopSeeking() {
    isSeeking = false;
    document.removeEventListener('mousemove', updateSeekPosition);
    document.removeEventListener('touchmove', updateSeekPosition);
    document.removeEventListener('mouseup', stopSeeking);
    document.removeEventListener('touchend', stopSeeking);
}

// Full player seek bar interaction
fullPlayerSeekBar.addEventListener('mousedown', startFullPlayerSeeking);
fullPlayerSeekBar.addEventListener('touchstart', startFullPlayerSeeking);

function startFullPlayerSeeking(e) {
    isFullPlayerSeeking = true;
    updateFullPlayerSeekPosition(e);
    
    document.addEventListener('mousemove', updateFullPlayerSeekPosition);
    document.addEventListener('touchmove', updateFullPlayerSeekPosition);
    document.addEventListener('mouseup', stopFullPlayerSeeking);
    document.addEventListener('touchend', stopFullPlayerSeeking);
}

function updateFullPlayerSeekPosition(e) {
    if (!isFullPlayerSeeking) return;
    
    const rect = fullPlayerSeekBar.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    let position = (clientX - rect.left) / rect.width;
    position = Math.max(0, Math.min(1, position));
    
    const progress = position * 100;
    fullPlayerSeekProgress.style.width = `${progress}%`;
    fullPlayerSeekHandle.style.left = `${progress}%`;
    
    if (audio.duration) {
        audio.currentTime = position * audio.duration;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }
}

function stopFullPlayerSeeking() {
    isFullPlayerSeeking = false;
    document.removeEventListener('mousemove', updateFullPlayerSeekPosition);
    document.removeEventListener('touchmove', updateFullPlayerSeekPosition);
    document.removeEventListener('mouseup', stopFullPlayerSeeking);
    document.removeEventListener('touchend', stopFullPlayerSeeking);
}

// Show handle on hover
seekBar.addEventListener('mouseenter', () => {
    if (!isSeeking) {
        seekBarHandle.style.opacity = '1';
    }
});

seekBar.addEventListener('mouseleave', () => {
    if (!isSeeking) {
        seekBarHandle.style.opacity = '0';
    }
});

fullPlayerSeekBar.addEventListener('mouseenter', () => {
    if (!isFullPlayerSeeking) {
        fullPlayerSeekHandle.style.opacity = '1';
    }
});

fullPlayerSeekBar.addEventListener('mouseleave', () => {
    if (!isFullPlayerSeeking) {
        fullPlayerSeekHandle.style.opacity = '0';
    }
});

// === BACK BUTTON HANDLING ===
function handleBackButton() {
    if (navigationStack.length > 1) {
        // If we're in full player, close it
        if (navigationStack[navigationStack.length - 1] === 'fullPlayer') {
            hideFullPlayer();
        }
        // If we're on home page, exit the app
        else if (navigationStack.length === 1 && navigationStack[0] === 'home') {
            // Exit app (close window or show exit confirmation)
            if (confirm('Do you want to exit the app?')) {
                window.close(); // This might not work in all browsers
                // Alternative: Redirect to blank page or show exit message
                document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-size:1.5rem;">App Closed</div>';
            }
        }
    }
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    handleBackButton();
});

// Handle Android back button (for mobile apps)
document.addEventListener('backbutton', handleBackButton, false);

// Add event listener for Escape key (for desktop)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        handleBackButton();
    }
});

// Initialize navigation state

window.history.replaceState({page: 'home'}, '', '');


