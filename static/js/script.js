document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       MOOD ELEMENTS
    ============================== */

    const moodCards =
        document.querySelectorAll(".mood-card");

    const songList =
        document.getElementById("song-list");

    const recommendationTitle =
        document.getElementById("recommendation-title");

    const recommendationSubtitle =
        document.getElementById("recommendation-subtitle");
    /* ==============================
       SEARCH
    ============================== */

    const searchInput =
        document.getElementById("song-search");

    const searchButton =
        document.getElementById("search-button");


    /* ==============================
       MUSIC PLAYER
    ============================== */

    const playerTitle =
        document.getElementById("player-title");

    const playerArtist =
        document.getElementById("player-artist");

    const mainPlayButton =
        document.getElementById("main-play-button");

    const previousButton =
        document.getElementById("previous-button");

    const nextButton =
        document.getElementById("next-button");

    const progressBar =
        document.getElementById("progress-bar");

    const currentTime =
        document.getElementById("current-time");

    const duration =
        document.getElementById("duration");

    const volumeBar =
        document.getElementById("volume-bar");


    /* ==============================
       AUDIO
    ============================== */

    let currentSongs = [];

    let currentSongIndex = 0;

    let audio = new Audio();


    /* ==============================
       DISPLAY SONGS
    ============================== */

    function displaySongs(songs) {

        songList.innerHTML = "";

        if (songs.length === 0) {

            songList.innerHTML = `
                <div class="empty-message">
                    🎵 No songs found.
                </div>
            `;

            return;
        }


        songs.forEach(function (song, index) {

            const songCard =
                document.createElement("div");

            songCard.className =
                "song-card";


            songCard.innerHTML = `

                <div class="song-icon">
                    🎵
                </div>

                <div class="song-details">

                    <h3>${song.title}</h3>

                    <p>${song.artist}</p>

                </div>

                <button class="favorite-button">
                    ♡
                </button>

                <button class="song-play-button">
                    ▶
                </button>

            `;


            songList.appendChild(songCard);


            /* ==============================
               FAVORITE BUTTON
            ============================== */

            const favoriteButton =
                songCard.querySelector(
                    ".favorite-button"
                );


            let favorites =
                JSON.parse(
                    localStorage.getItem("favorites")
                ) || [];


            if (
                favorites.some(function (item) {
                    return item.file === song.file;
                })
            ) {

                favoriteButton.textContent =
                    "♥";

            }


            favoriteButton.addEventListener(
                "click",
                function () {

                    let savedFavorites =
                        JSON.parse(
                            localStorage.getItem(
                                "favorites"
                            )
                        ) || [];


                    const alreadyFavorite =
                        savedFavorites.some(
                            function (item) {
                                return item.file === song.file;
                            }
                        );


                    if (alreadyFavorite) {

                        savedFavorites =
                            savedFavorites.filter(
                                function (item) {
                                    return item.file !== song.file;
                                }
                            );

                        favoriteButton.textContent =
                            "♡";

                    }

                    else {

                        savedFavorites.push(song);

                        favoriteButton.textContent =
                            "♥";

                    }


                    localStorage.setItem(
                        "favorites",
                        JSON.stringify(savedFavorites)
                    );


                    displayFavorites();

                }
            );


            /* ==============================
               PLAY BUTTON
            ============================== */

            const playButton =
                songCard.querySelector(
                    ".song-play-button"
                );


            playButton.addEventListener(
                "click",
                function () {

                    currentSongIndex =
                        index;

                    ;
playSong(song)
                }
            );


        });

    }


    /* ==============================
       MOOD SELECTION
    ============================== */

    moodCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                moodCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                const mood =
                    card.querySelector("h3")
                        .textContent
                        .trim();


                recommendationTitle.textContent =
                    mood + " Music For You";


                recommendationSubtitle.textContent =
                    "Songs selected for your "
                    + mood.toLowerCase()
                    + " mood.";


                fetch("/songs/" + mood)

                    .then(function (response) {

                        return response.json();

                    })

                    .then(function (songs) {

                        currentSongs =
                            songs;

                        currentSongIndex =
                            0;

                        displaySongs(songs);

                    })

                    .catch(function (error) {

                        console.error(
                            "Error loading songs:",
                            error
                        );

                        songList.innerHTML = `
                            <div class="empty-message">
                                ⚠️ Unable to load songs.
                            </div>
                        `;

                    });

            }
        );

    });


    /* ==============================
       PLAY SONG
    ============================== */

    function playSong(song) {

        audio.src =
            "/static/songs/" + song.file;


        /* ==============================
           SAVE RECENTLY PLAYED
        ============================== */

        let recentSongs =
            JSON.parse(
                localStorage.getItem(
                    "recentSongs"
                )
            ) || [];


        recentSongs =
            recentSongs.filter(
                function (item) {

                    return item.file !== song.file;

                }
            );


        recentSongs.unshift(song);


        if (recentSongs.length > 5) {

            recentSongs.pop();

        }


        localStorage.setItem(
            "recentSongs",
            JSON.stringify(recentSongs)
        );


        displayRecentSongs();


        /* ==============================
           PLAYER INFORMATION
        ============================== */

        playerTitle.textContent =
            song.title;

        playerArtist.textContent =
            song.artist;


        /* ==============================
           REMOVE OLD ACTIVE STATES
        ============================== */

        document
            .querySelectorAll(".song-card")
            .forEach(function (card) {

                card.classList.remove(
                    "active-song"
                );

                card.classList.remove(
                    "currently-playing"
                );

            });


        /* ==============================
           HIGHLIGHT CURRENT SONG
        ============================== */

        document
            .querySelectorAll(".song-card")
            .forEach(function (card) {

                const title =
                    card.querySelector("h3");

                if (
                    title &&
                    title.textContent === song.title
                ) {

                    card.classList.add(
                        "active-song"
                    );

                    card.classList.add(
                        "currently-playing"
                    );

                }

            });


        /* ==============================
           PLAY AUDIO
        ============================== */

        

        audio.play()
            .then(function () {

                mainPlayButton.textContent = "⏸";

            })
            .catch(function (error) {

                console.error(
                    "Song could not play:",
                    error
                );

                mainPlayButton.textContent = "▶";

            });

    }


    /* ==============================
       PLAY / PAUSE
    ============================== */

    mainPlayButton.addEventListener(
        "click",
        function () {

            if (!audio.src) {

                return;

            }


            if (audio.paused) {

                audio.play();

                mainPlayButton.textContent =
                    "⏸";

            }

            else {

                audio.pause();

                mainPlayButton.textContent =
                    "▶";

            }

        }
    );


    /* ==============================
       AUDIO PROGRESS
    ============================== */

    audio.addEventListener(
        "timeupdate",
        function () {

            if (audio.duration) {

                progressBar.value =
                    (
                        audio.currentTime /
                        audio.duration
                    ) * 100;


                currentTime.textContent =
                    formatTime(
                        audio.currentTime
                    );

            }

        }
    );


    /* ==============================
       AUDIO DURATION
    ============================== */

    audio.addEventListener(
        "loadedmetadata",
        function () {

            duration.textContent =
                formatTime(
                    audio.duration
                );

        }
    );


    /* ==============================
       PROGRESS BAR
    ============================== */

    progressBar.addEventListener(
        "input",
        function () {

            if (audio.duration) {

                audio.currentTime =
                    (
                        progressBar.value / 100
                    ) * audio.duration;

            }

        }
    );


    /* ==============================
       VOLUME
    ============================== */

    volumeBar.addEventListener(
        "input",
        function () {

            audio.volume =
                volumeBar.value;

        }
    );


    /* ==============================
       NEXT SONG
    ============================== */

    nextButton.addEventListener(
        "click",
        function () {

            if (
                currentSongs.length === 0
            ) {

                return;

            }


            currentSongIndex++;


            if (
                currentSongIndex >=
                currentSongs.length
            ) {

                currentSongIndex = 0;

            }


            playSong(
                currentSongs[
                    currentSongIndex
                ]
            );

        }
    );


    /* ==============================
       PREVIOUS SONG
    ============================== */

    previousButton.addEventListener(
        "click",
        function () {

            if (
                currentSongs.length === 0
            ) {

                return;

            }


            currentSongIndex--;


            if (currentSongIndex < 0) {

                currentSongIndex =
                    currentSongs.length - 1;

            }


            playSong(
                currentSongs[
                    currentSongIndex
                ]
            );

        }
    );


    /* ==============================
       AUTO NEXT
    ============================== */

    audio.addEventListener(
        "ended",
        function () {

            if (
                currentSongs.length === 0
            ) {

                return;

            }


            currentSongIndex++;


            if (
                currentSongIndex >=
                currentSongs.length
            ) {

                currentSongIndex = 0;

            }


            playSong(
                currentSongs[
                    currentSongIndex
                ]
            );

        }
    );


    /* ==============================
       SEARCH
    ============================== */

    function searchSongs() {

        const searchText =
            searchInput.value
                .toLowerCase()
                .trim();


        const songCards =
            document.querySelectorAll(
                "#song-list .song-card"
            );


        let visibleSongs = 0;


        songCards.forEach(
            function (card) {

                const title =
                    card.querySelector("h3")
                        .textContent
                        .toLowerCase();


                const artist =
                    card.querySelector("p")
                        .textContent
                        .toLowerCase();


                if (
                    title.includes(searchText) ||
                    artist.includes(searchText)
                ) {

                    card.style.display =
                        "flex";

                    visibleSongs++;

                }

                else {

                    card.style.display =
                        "none";

                }

            }
        );


        let noResults =
            document.getElementById(
                "no-search-results"
            );


        if (
            visibleSongs === 0 &&
            songCards.length > 0
        ) {

            if (!noResults) {

                noResults =
                    document.createElement(
                        "div"
                    );

                noResults.id =
                    "no-search-results";

                noResults.className =
                    "empty-message";

                noResults.textContent =
                    "🎵 No songs found.";

                songList.appendChild(
                    noResults
                );

            }

        }

        else {

            if (noResults) {

                noResults.remove();

            }

        }

    }


    searchButton.addEventListener(
        "click",
        searchSongs
    );


    searchInput.addEventListener(
        "input",
        searchSongs
    );


    /* ==============================
       DISPLAY FAVORITES
    ============================== */

    function displayFavorites() {

        const favoritesList =
            document.getElementById(
                "favorites-list"
            );


        if (!favoritesList) {

            return;

        }


        const favorites =
            JSON.parse(
                localStorage.getItem(
                    "favorites"
                )
            ) || [];


        favoritesList.innerHTML = "";


        if (favorites.length === 0) {

            favoritesList.innerHTML = `
                <div class="empty-message">
                    ❤️ You haven't added any favorite songs yet.
                </div>
            `;

            return;

        }


        favorites.forEach(function (song) {

            const songCard =
                document.createElement("div");


            songCard.className =
                "song-card";


            songCard.innerHTML = `

                <div class="song-icon">
                    🎵
                </div>

                <div class="song-details">

                    <h3>${song.title}</h3>

                    <p>${song.artist}</p>

                </div>

                <button class="song-play-button">
                    ▶
                </button>

            `;


            favoritesList.appendChild(
                songCard
            );


            const playButton =
                songCard.querySelector(
                    ".song-play-button"
                );


            playButton.addEventListener(
                "click",
                function () {

                    playSong(song);

                }
            );

        });

    }


    /* ==============================
       DISPLAY RECENTLY PLAYED
    ============================== */

    function displayRecentSongs() {

        const recentList =
            document.getElementById(
                "recent-list"
            );


        if (!recentList) {

            return;

        }


        const recentSongs =
            JSON.parse(
                localStorage.getItem(
                    "recentSongs"
                )
            ) || [];


        recentList.innerHTML = "";


        if (recentSongs.length === 0) {

            recentList.innerHTML = `
                <div class="empty-message">
                    🕘 No recently played songs yet.
                </div>
            `;

            return;

        }


        recentSongs.forEach(function (song) {

            const songCard =
                document.createElement("div");


            songCard.className =
                "song-card";


            songCard.innerHTML = `

                <div class="song-icon">
                    🎵
                </div>

                <div class="song-details">

                    <h3>${song.title}</h3>

                    <p>${song.artist}</p>

                </div>

                <button class="song-play-button">
                    ▶
                </button>

            `;


            recentList.appendChild(
                songCard
            );


            const playButton =
                songCard.querySelector(
                    ".song-play-button"
                );


            playButton.addEventListener(
                "click",
                function () {

                    playSong(song);

                }
            );

        });

    }


    /* ==============================
       CLEAR FAVORITES
    ============================== */

    const clearFavoritesButton =
        document.getElementById(
            "clear-favorites-button"
        );


    if (clearFavoritesButton) {

        clearFavoritesButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "favorites"
                );

                displayFavorites();

            }
        );

    }


    /* ==============================
       CLEAR RECENT HISTORY
    ============================== */

    const clearRecentButton =
        document.getElementById(
            "clear-recent-button"
        );


    if (clearRecentButton) {

        clearRecentButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "recentSongs"
                );

                displayRecentSongs();

            }
        );

    }


    /* ==============================
       BACK TO TOP
    ============================== */

    const backToTop =
        document.getElementById(
            "back-to-top"
        );


    if (backToTop) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 400) {

                    backToTop.classList.add(
                        "show"
                    );

                }

                else {

                    backToTop.classList.remove(
                        "show"
                    );

                }

            }
        );


        backToTop.addEventListener(
            "click",
            function () {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }


    /* ==============================
       FORMAT TIME
    ============================== */

    function formatTime(seconds) {

        if (isNaN(seconds)) {

            return "0:00";

        }


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remainingSeconds =
            Math.floor(
                seconds % 60
            );


        return (
            minutes +
            ":" +
            remainingSeconds
                .toString()
                .padStart(2, "0")
        );

    }


    /* ==============================
       INITIAL LOAD
    ============================== */

    displayFavorites();

    displayRecentSongs();

});