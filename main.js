let musicData = {
    newReleases: [],
    mixesForYou: [],
    artists: []
};

// === PLAYER STATE ===
let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaying = false;

// Favorites storage
let favoriteSongs = JSON.parse(localStorage.getItem("favoriteSongs") || "[]");

// Load music data from JSON file
async function loadMusicData() {
    try {
        // NOTE: mg.json is assumed to be in the same directory
        const response = await fetch('mg.json'); 
        if (!response.ok) {
            throw new Error('Failed to load music data');
        }
        musicData = await response.json();
        
        // Initialize current playlist with new releases
        currentPlaylist = musicData.newReleases || [];
        
        // Re-populate sections with loaded data
        populateAllSections();
        
        // Populate library with all songs
        populateLibrary();
        
    } catch (error) {
        console.error('Error loading music data:', error);
        // Fallback to empty data
        musicData = {
            newReleases: [],
            mixesForYou: [],
            artists: []
        };
        currentPlaylist = [];
    }
}

// === GREETING ===
function updateGreeting(){
    const greetingEl=document.getElementById('time-greeting');
    const now=new Date();
    const hour=now.getHours();
    let greetingText="";
    if(hour>=5 && hour<12) greetingText="Good Morning 🌞";
    else if(hour>=12 && hour<17) greetingText="Good Afternoon ☀";
    else if(hour>=17 && hour<21) greetingText="Good Evening 🌙";
    else greetingText="Good Night 🌙";
    greetingText+=" | "+now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    greetingEl.textContent=greetingText;
}
setInterval(updateGreeting,1000);
updateGreeting();

// === PAGE NAVIGATION ===
function showPage(page) {
    // Hide all pages
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('searchPage').style.display = 'none';
    document.getElementById('libraryPage').style.display = 'none';
    
    // Show selected page
    if (page === 'home') {
        document.getElementById('homePage').style.display = 'block';
    } else if (page === 'search') {
        document.getElementById('searchPage').style.display = 'block';
        updateSearchHistoryUI(); // Show history when search page is opened
    } else if (page === 'library') {
        document.getElementById('libraryPage').style.display = 'block';
        updateLibraryUI(); // Refresh library when opened
    }
}

// === POPULATE ALL SECTIONS ===
function populateAllSections() {
    const homePage = document.getElementById('homePage');
    homePage.innerHTML = ''; // Clear existing content
    
    if (musicData.newReleases && musicData.newReleases.length > 0) {
        createSection("New Releases", musicData.newReleases, "playlist", homePage);
    }
    
    if (musicData.mixesForYou && musicData.mixesForYou.length > 0) {
        createSection("Mixes For You", musicData.mixesForYou, "playlist", homePage);
    }
    
    if (musicData.artists && musicData.artists.length > 0) {
        createSection("Artists", musicData.artists, "artists", homePage);
    }
    
    // Remove the old recently played section from home page
    // Now we'll only show it in library
}

// === CREATE SECTION (Functions for creating dynamic content) ===
function createSection(title, items, type, container){
    const section=document.createElement('div'); 
    section.classList.add('section');
    
    const sectionTitle=document.createElement('div'); 
    sectionTitle.classList.add('section-title');
    
    const h2=document.createElement('h2'); 
    h2.textContent=title;
    sectionTitle.appendChild(h2); 
    section.appendChild(sectionTitle);

    if(type==="playlist") {
        // For New Releases section - use horizontal scrolling rows with Multiple Rows
        if(title === "New Releases") {
            const releasesContainer = document.createElement('div');
            releasesContainer.classList.add('new-releases-container');
            
            // Split items into rows of 10 songs each (up to 30 songs)
            const rows = [];
            for (let i = 0; i < Math.min(items.length, 30); i += 10) {
                rows.push(items.slice(i, i + 10));
            }
            
            // Create a horizontal scrolling row for each group of 10 songs
            rows.forEach((rowItems, rowIndex) => {
                const row = document.createElement('div');
                row.classList.add('new-releases-row');
                
                rowItems.forEach((item, index) => {
                    const card=document.createElement('div');
                    card.classList.add('new-releases-card');
                    card.innerHTML=<div class="new-releases-img"><img src="${item.img}" alt=""></div><h4>${item.title}</h4><p>${item.artist}</p>;
                    row.appendChild(card);
                    card.addEventListener('click',()=>{
                        currentPlaylist = items;
                        currentSongIndex = rowIndex * 10 + index;
                        playSong(item);
                    });
                    setTimeout(()=>card.classList.add('show'), Math.random()*300);
                });
                
                releasesContainer.appendChild(row);
            });
            
            section.appendChild(releasesContainer);
        } 
        // For other playlist sections - use original single row layout
        else {
            const playlistContainer=document.createElement('div');
            playlistContainer.classList.add('playlist-container');

            items.forEach((item, index)=>{
                const card=document.createElement('div');
                card.classList.add('playlist-card');
                card.innerHTML=<div class="playlist-img"><img src="${item.img}" alt=""></div><h4>${item.title}</h4><p>${item.artist}</p>;
                playlistContainer.appendChild(card);
                card.addEventListener('click',()=>{
                    currentPlaylist = items;
                    currentSongIndex = index;
                    playSong(item);
                });
                setTimeout(()=>card.classList.add('show'), Math.random()*300);
            });
            section.appendChild(playlistContainer);
        }
    } else if(type==="artists") {
        const artistsContainer=document.createElement('div');
        artistsContainer.classList.add('artists-grid');

        items.forEach(item=>{
            const card=document.createElement('div');
            card.classList.add('artist-card');
            card.innerHTML=<img src="${item.img}" alt=""><h4>${item.name}</h4>;
            artistsContainer.appendChild(card);
        });
        section.appendChild(artistsContainer);
    }
    
    container.appendChild(section);
}

// === LIBRARY FUNCTIONS ===
function populateLibrary() {
    // Combine all songs from different sections
    const allSongs = [
        ...(musicData.newReleases || []),
        ...(musicData.mixesForYou || [])
    ];
    
    updateLibraryUI(allSongs);
}

function updateLibraryUI(songs = null) {
    const librarySongsList = document.getElementById('librarySongsList');
    librarySongsList.innerHTML = '';
    
    // If no songs provided, get all songs
    if (!songs) {
        songs = [
            ...(musicData.newReleases || []),
            ...(musicData.mixesForYou || [])
        ];
    }
    
    if (songs.length === 0) {
        librarySongsList.innerHTML = '<div class="no-results">No songs found in your library</div>';
        return;
    }
    
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.classList.add('library-song-item');
        
        // Check if this song is currently playing
        const isCurrentSong = audio.src && audio.src.includes(song.audio);
        const playIcon = isCurrentSong && isPlaying ? 'bx-pause' : 'bx-play';
        
        // Check if song is in favorites
        const isFavorite = favoriteSongs.some(fav => fav.audio === song.audio);
        const favoriteIcon = isFavorite ? 'bxs-heart' : 'bx-heart';
        
        songItem.innerHTML = `
            <div class="library-song-img">
                <img src="${song.img}" alt="${song.title}">
            </div>
            <div class="library-song-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <span class="library-song-duration">3:45</span>
            <i class='bx ${favoriteIcon} library-favorite-btn' style="color: ${isFavorite ? '#ff4081' : '#aaa'}; margin-right: 10px;"></i>
            <i class='bx ${playIcon} library-play-btn ${isCurrentSong && isPlaying ? 'playing' : ''}'></i>
        `;
        
        // Add click event to play song
        songItem.addEventListener('click', function(e) {
            if (!e.target.classList.contains('library-play-btn') && !e.target.classList.contains('library-favorite-btn')) {
                currentPlaylist = songs;
                currentSongIndex = index;
                playSong(song);
                updateLibraryPlayButtons(); // Update all play buttons
            }
        });
        
        // Add click event to play button
        const playBtn = songItem.querySelector('.library-play-btn');
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isCurrentSong) {
                // If this is the current song, toggle play/pause
                togglePlayPause();
            } else {
                // If this is a different song, play it
                currentPlaylist = songs;
                currentSongIndex = index;
                playSong(song);
            }
            updateLibraryPlayButtons(); // Update all play buttons
        });
        
        // Add click event to favorite button
        const favoriteBtn = songItem.querySelector('.library-favorite-btn');
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(song);
            updateLibraryUI(songs); // Refresh to show updated favorites
        });
        
        librarySongsList.appendChild(songItem);
    });
}

function updateLibraryPlayButtons() {
    const playButtons = document.querySelectorAll('.library-play-btn');
    playButtons.forEach(btn => {
        btn.classList.remove('bx-play', 'bx-pause', 'playing');
        btn.classList.add('bx-play');
    });
    
    // Update the current playing song button
    if (audio.src && currentPlaylist[currentSongIndex]) {
        const currentSongAudio = currentPlaylist[currentSongIndex].audio;
        const currentSongItems = document.querySelectorAll('.library-song-item');
        
        currentSongItems.forEach(item => {
            const img = item.querySelector('img');
            if (img && img.src.includes(currentPlaylist[currentSongIndex].img)) {
                const playBtn = item.querySelector('.library-play-btn');
                if (playBtn) {
                    playBtn.classList.remove('bx-play', 'bx-pause');
                    playBtn.classList.add(isPlaying ? 'bx-pause' : 'bx-play', 'playing');
                }
            }
        });
    }
}

// === FAVORITES FUNCTIONALITY ===
function toggleFavorite(song) {
    const index = favoriteSongs.findIndex(fav => fav.audio === song.audio);
    
    if (index === -1) {
        // Add to favorites
        favoriteSongs.push(song);
    } else {
        // Remove from favorites
        favoriteSongs.splice(index, 1);
    }
    
    // Save to localStorage
    localStorage.setItem("favoriteSongs", JSON.stringify(favoriteSongs));
}

// === RECENTLY PLAYED ===
let recentlyPlayed = JSON.parse(localStorage.getItem("recentlyPlayed")||"[]");

// === SEARCH HISTORY FUNCTIONS ===
let searchHistory = JSON.parse(localStorage.getItem("searchHistory")||"[]");

function saveSearchHistory() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

function addToSearchHistory(song) {
    // 1. Check if the song is already in history (by audio URL as unique ID)
    searchHistory = searchHistory.filter(s => s.audio !== song.audio);
    
    // 2. Add the new song to the beginning
    searchHistory.unshift({
        title: song.title,
        artist: song.artist,
        img: song.img,
        audio: song.audio
    });
    
    // 3. Keep history length manageable (e.g., max 20 songs)
    if (searchHistory.length > 20) {
        searchHistory.pop();
    }
    
    saveSearchHistory();
    // Update UI if on search page and no search query is active
    if (!searchBox.value) {
        updateSearchHistoryUI();
    }
}

function removeSearchHistoryItem(audioUrl) {
    searchHistory = searchHistory.filter(s => s.audio !== audioUrl);
    saveSearchHistory();
    updateSearchHistoryUI(); // Refresh the list
}

function updateSearchHistoryUI() {
    const historyList = document.getElementById('historyList');
    const historySection = document.getElementById('searchHistorySection');
    
    historyList.innerHTML = '';

    if (searchBox.value.length > 0) {
        // Hide history when user is typing a query
        historySection.style.display = 'none';
        return;
    }
    
    if (searchHistory.length === 0) {
        historySection.style.display = 'none';
        return;
    }

    historySection.style.display = 'block';

    searchHistory.forEach(song => {
        const item = document.createElement('div');
        item.classList.add('history-item');
        item.dataset.audioUrl = song.audio; // Store URL for removal
        
        item.innerHTML = `
            <div class="history-item-img">
                <img src="${song.img}" alt="${song.title}">
            </div>
            <div class="history-item-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            <i class='bx bx-x history-remove-btn'></i>
        `;
        
        // Add event listener to play song (excluding the remove button)
        item.querySelector('.history-item-info').parentElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('history-remove-btn')) {
                // Find the song in the main music data to get all properties if needed
                const allSongs = [
                    ...(musicData.newReleases || []),
                    ...(musicData.mixesForYou || [])
                ];
                const fullSong = allSongs.find(s => s.audio === song.audio) || song;
                
                // Set current playlist to a dummy list containing only the history song for playback
                currentPlaylist = [fullSong]; 
                currentSongIndex = 0;
                playSong(fullSong);
            }
        });
        
        // Add event listener for removal
        item.querySelector('.history-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the play action
            removeSearchHistoryItem(song.audio);
        });
        
        historyList.appendChild(item);
    });
}

// === SEARCH FUNCTIONALITY ===
function searchSongs(query) {
    const searchResults = document.getElementById('searchResults');
    const searchHistorySection = document.getElementById('searchHistorySection');
    
    if (!query || query.length < 1) {
        searchResults.style.display = 'none';
        updateSearchHistoryUI(); // Show history when query is cleared
        return;
    }
    
    searchResults.innerHTML = '';
    searchHistorySection.style.display = 'none'; // Hide history while searching
    
    // Get all songs from new releases and mixes
    const allSongs = [
        ...(musicData.newReleases || []),
        ...(musicData.mixesForYou || [])
    ];
    
    // Filter songs based on query (search in title and artist)
    const filteredSongs = allSongs.filter(song => {
        const searchTerm = query.toLowerCase();
        return (
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm)
        );
    });
    
    if (filteredSongs.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No songs found</div>';
    } else {
        filteredSongs.forEach((song, index) => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item');
            resultItem.innerHTML = `
                <div class="search-result-img">
                    <img src="${song.img}" alt="${song.title}">
                </div>
                <div class="search-result-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            resultItem.addEventListener('click', () => {
                currentPlaylist = filteredSongs;
                currentSongIndex = index;
                playSong(song);
                addToSearchHistory(song); // Add searched song to history
            });
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
}

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
    return ${mins}:${secs < 10 ? '0' : ''}${secs};
}

// Prevent body scroll when full player is open
function preventBodyScroll(prevent) {
    if (prevent) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
    }
}

function playSong(song){
    if (!song.audio) {
        console.error('No audio URL provided for song:', song.title);
        return;
    }
    
    audio.src=song.audio;
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
    });
    isPlaying = true;
    
    // Update mini player - FIX: Properly update all elements
    miniPlayerCover.src = song.img;
    miniPlayerTitle.textContent = song.title;
    miniPlayerArtist.textContent = song.artist || "";
    
    // Make sure now playing bar is visible
    nowPlayingBar.style.display = "flex";
    nowPlayingBar.style.opacity = "1";
    nowPlayingBar.style.transform = "translateY(0)";
    
    playPauseBtn.classList.replace('bx-play-circle','bx-pause-circle');
    
    // Update full player
    fullPlayerCover.src = song.img;
    fullPlayerTitle.textContent = song.title;
    fullPlayerArtist.textContent = song.artist || "";
    fullPlayerPlayPause.classList.replace('bx-play','bx-pause');
    fullPlayerPlayPause.classList.add('full-player-play-pause');

    // Update library play buttons
    updateLibraryPlayButtons();

    // Update recently played
    recentlyPlayed = recentlyPlayed.filter(s=>s.audio!==song.audio);
    recentlyPlayed.unshift(song);
    if(recentlyPlayed.length>12) recentlyPlayed.pop();
    localStorage.setItem("recentlyPlayed",JSON.stringify(recentlyPlayed));
}

// === PLAY/PAUSE ===
function togglePlayPause() {
    if(audio.src){
        if(audio.paused){ 
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            }); 
            playPauseBtn.classList.replace('bx-play-circle','bx-pause-circle'); 
            fullPlayerPlayPause.classList.replace('bx-play','bx-pause');
            isPlaying = true;
        } else { 
            audio.pause(); 
            playPauseBtn.classList.replace('bx-pause-circle','bx-play-circle'); 
            fullPlayerPlayPause.classList.replace('bx-pause','bx-play');
            isPlaying = false;
        }
        // Update library play buttons
        updateLibraryPlayButtons();
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
    preventBodyScroll(true);
    // Push a new state to history
    history.pushState({ fullPlayerOpen: true }, "");
}

function hideFullPlayer() {
    fullPlayer.classList.remove('show');
    // Check if 'fullPlayer' is the last item before popping
    if (navigationStack[navigationStack.length - 1] === 'fullPlayer') {
        navigationStack.pop(); 
    }
    preventBodyScroll(false);
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
        seekBarProgress.style.width = ${progress}%;
        seekBarHandle.style.left = ${progress}%;
    }
    
    if (!isFullPlayerSeeking && audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        fullPlayerSeekProgress.style.width = ${progress}%;
        fullPlayerSeekHandle.style.left = ${progress}%;
        
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
    seekBarProgress.style.width = ${progress}%;
    seekBarHandle.style.left = ${progress}%;
    
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
    fullPlayerSeekProgress.style.width = ${progress}%;
    fullPlayerSeekHandle.style.left = ${progress}%;
    
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

// === BOTTOM NAVIGATION ===
const navLinks = document.querySelectorAll('.bottom-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        // Update navigation stack - only push if not already on this page
        const page = this.getAttribute('data-page');
        if (navigationStack[navigationStack.length - 1] !== page) {
             navigationStack.push(page);
        }
       
        // Show the selected page
        showPage(page);
    });
});

// === KEYBOARD FOCUS FIX VARIABLES ===
const searchBox = document.getElementById('searchBox');
const bottomNav = document.querySelector('.bottom-nav');
const content = document.getElementById('content');
const DEFAULT_CONTENT_PADDING = '120px';
const ADJUSTED_CONTENT_PADDING = '50px'; 

// === KEYBOARD FOCUS FIX LOGIC ===
searchBox.addEventListener('focus', () => {
    bottomNav.classList.add('nav-hidden');
    nowPlayingBar.style.bottom = '0px'; 
    content.style.paddingBottom = ADJUSTED_CONTENT_PADDING; 
});

searchBox.addEventListener('blur', () => {
    bottomNav.classList.remove('nav-hidden');
    nowPlayingBar.style.bottom = '70px'; 
    content.style.paddingBottom = DEFAULT_CONTENT_PADDING; 
});


// === SEARCH EVENT LISTENERS ===
document.getElementById('searchBox').addEventListener('input', function(e) {
    searchSongs(e.target.value);
});

document.getElementById('searchIcon').addEventListener('click', function() {
    const query = document.getElementById('searchBox').value;
    searchSongs(query);
});

document.getElementById('searchBox').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const query = document.getElementById('searchBox').value;
        searchSongs(query);
    }
});

// === LIBRARY FILTERS ===
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        applyLibraryFilter(filter);
    });
});

function applyLibraryFilter(filter) {
    let filteredSongs = [];
    
    switch(filter) {
        case 'all':
            filteredSongs = [
                ...(musicData.newReleases || []),
                ...(musicData.mixesForYou || [])
            ];
            break;
        case 'recent':
            filteredSongs = [...recentlyPlayed];
            break;
        case 'favorites':
            filteredSongs = [...favoriteSongs];
            break;
    }
    
    updateLibraryUI(filteredSongs);
}

// === BACK BUTTON HANDLING ===
function handleBackButton() {
    // 1. If search box is focused, blur it first (Hide keyboard/Show bottom nav)
    if (document.activeElement === searchBox) {
        searchBox.blur(); 
        return true; 
    }

    if (navigationStack.length > 1) {
        const currentPage = navigationStack[navigationStack.length - 1];

        // 2. If we're in full player, close it
        if (currentPage === 'fullPlayer') {
            hideFullPlayer();
            return true;
        }

        // 3. If we're on search page or library page, go back to home
        if (currentPage === 'search' || currentPage === 'library') {
            // Remove current page from stack and go to the previous page (which should be 'home')
            navigationStack.pop(); 
            const prevPage = navigationStack[navigationStack.length - 1] || 'home';
            showPage(prevPage);

            // Update bottom nav
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('.bottom-nav a[data-page="home"]').classList.add('active');
            return true;
        }
    }
    
    // 4. If we are on the home page, exit confirmation
    if (navigationStack.length <= 1 || navigationStack[navigationStack.length - 1] === 'home') {
        if (confirm('Do you want to exit the app?')) {
            window.close();
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100dvh;font-size:1.5rem;">App Closed</div>';
        }
        return true; 
    }

    return false; // Back gesture not handled
}

// Handle browser back button
window.addEventListener('popstate', function(event) {
    // ⿡ Agar full player open hai to pehle use close karo
    if (fullPlayer.classList.contains('show')) {
        hideFullPlayer();
        return;
    }
    
    // ⿢ Agar current page search hai to back press par home dikhao
    if (currentPage === 'search' || currentPage === 'library') {
        showPage('home'); // Home page par redirect
        return;
    }
    
    // ⿣ Agar home already hai to normal browser back chalao (exit)
    if (currentPage === 'home') {
        history.back();
    }
});

// Handle Android back button (for mobile apps)
document.addEventListener('backbutton', function() {
    if (!handleBackButton()) {
        if (typeof navigator !== 'undefined' && navigator.app) {
            navigator.app.exitApp();
        }
    }
}, false);

// Add event listener for Escape key (for desktop)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        handleBackButton();
    }
});

// Touch gesture for back navigation (swipe from left edge)
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50; // Minimum swipe distance

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (touchStartX === 0) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Check if it's a horizontal swipe from left edge
    if (touchStartX < 50 && // Started from left edge
        Math.abs(deltaX) > SWIPE_THRESHOLD && // Minimum horizontal distance
        Math.abs(deltaX) > Math.abs(deltaY) && // More horizontal than vertical
        deltaX > 0) { // Swipe to the right (back gesture)
        
        handleBackButton();
    }
    
    // Reset touch start
    touchStartX = 0;
    touchStartY = 0;
});

// Initialize navigation state
window.history.replaceState({page: 'home'}, '', '');

// Load music data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadMusicData();
    // Show home page by default
    showPage('home');
});

/* ====== NEW Helper + Navigation Fix (Spotify Style) START ====== */
let currentPage = 'home'; // Default home page

function showPage(pageName) {
  const homePage = document.getElementById('homePage');
  const searchPage = document.getElementById('searchPage');
  const libraryPage = document.getElementById('libraryPage');

  // Hide all pages first
  if (homePage) homePage.style.display = 'none';
  if (searchPage) searchPage.style.display = 'none';
  if (libraryPage) libraryPage.style.display = 'none';

  // Show target page
  if (pageName === 'home' && homePage) homePage.style.display = 'block';
  if (pageName === 'search' && searchPage) searchPage.style.display = 'block';
  if (pageName === 'library' && libraryPage) libraryPage.style.display = 'block';

  currentPage = pageName;

  // Push page to history
  window.history.pushState({ page: pageName }, '', '');
}

// Handle back button / gestures (Spotify style)
window.addEventListener('popstate', function (event) {
  if (fullPlayer && fullPlayer.classList.contains('show')) {
    hideFullPlayer();
    return;
  }

  if (currentPage === 'search' || currentPage === 'library') {
    showPage('home');
    return;
  }

  if (currentPage === 'home') {
    history.back();
  }
});
/* ====== NEW Helper + Navigation Fix (Spotify Style) END ====== */

