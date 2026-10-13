from flask import Flask, render_template, jsonify

app = Flask(__name__)


songs = {

    "Happy": [
        {
            "title": "Happy Vibes",
            "artist": "Moodify Playlist",
            "file": "happy_song.mp3"
        },
        {
            "title": "Good Day",
            "artist": "Moodify Playlist",
            "file": "good_day.mp3"
        }
    ],

    "Calm": [
        {
            "title": "Peaceful Moments",
            "artist": "Moodify Playlist",
            "file": "calm_song.mp3"
        }
    ],

    "Energetic": [
    {
        "title": "Energy Boost",
        "artist": "Moodify Playlist",
        "file": "energy_song.mp3"
    }
],
    "Sad": [
        {
            "title": "Quiet Thoughts",
            "artist": "Moodify Playlist",
            "file": "sad_song.mp3"
        }
    ],

    "Romantic": [
        {
            "title": "Love Vibes",
            "artist": "Moodify Playlist",
            "file": "romantic_song.mp3"
        }
    ],

    "Relaxed": [
        {
            "title": "Late Night",
            "artist": "Moodify Playlist",
            "file": "relaxed_song.mp3"
        }
    ]

}


@app.route("/")
def home():

    return render_template("index.html")


@app.route("/songs/<mood>")
def get_songs(mood):

    return jsonify(
        songs.get(mood, [])
    )


if __name__ == "__main__":

    app.run(debug=True)