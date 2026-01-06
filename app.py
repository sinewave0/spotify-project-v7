from flask import request, jsonify
from flask import Flask
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
from flask_cors import CORS
from flask import render_template
from flask import send_file
import subprocess
load_dotenv()
app = Flask(__name__) 
CORS(app)

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")


def get_token():
    auth_string = client_id + ":" + client_secret 
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes) , "utf-8")

    url ="https://accounts.spotify.com/api/token"
    headers = {
        "Authorization":"Basic "+ auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = post(url, headers= headers, data= data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token 

def get_auth_header(token):
    return {"Authorization":"Bearer "+ token}

def search_for_artist(token, artist_name):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"?q={artist_name}&type=artist&limit=1"
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result) == 0:
        print("No such artisttt exists of such name")
        return None 
    # print(json_result)
    return json_result[0]


def get_all_playlists_from_user(token, user_id):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)
    #print("the result in line 56 iss :@@@@@@@@@@@@@@@@@@@@@@@@@@@@:::::::::::::::", json_result)
    return json_result


    
def get_songs_by_artist(token, artist_id):
    url = f"https://api.spotify.com/v1/artists/{artist_id}/top-tracks?country=US"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    json_result = json.loads(result.content)["tracks"]
    return json_result



def get_playlist_tracks(token, playlist_id):
    # Remove any query parameters from playlist ID
    clean_playlist_id = playlist_id.split('?')[0]
    url = f"https://api.spotify.com/v1/playlists/{clean_playlist_id}/tracks"
    headers = get_auth_header(token)
    result = get(url, headers=headers)
    
    if result.status_code != 200:
        print(f"Error: Could not fetch playlistttt. Status code: {result.status_code}")
        return None
    
    json_result = result.json()
    print("we are at line 74 :")

    if "items" not in json_result:
        print("Error: Invalid playlist ID or no access to this playlistttt")
        return None
        
    return json_result["items"]

def get_top_gods(token, user_id, top =3):
    playlists = get_all_playlists_from_user(token, user_id)
    if not playlists or 'items' not in playlists:
        return []
    god_counts = {}
    for playlist in playlists['items']:
        playlist_id = playlist['id'] 
        tracks = get_playlist_tracks(token, playlist_id)

        if not tracks:
            continue
        for item in tracks:
            if not item or not item.get('track'):
                continue
            track = item['track']

            if(track.get('artists')):
                for artist in track['artists']:
                    artist_name = artist.get('name')
                    if artist_name:
                        god_counts[artist_name] = god_counts.get(artist_name,0) +1
    top_gods = sorted(god_counts.items(), key = lambda x: x[1], reverse=True )[0:top]
    return top_gods

def download_a_single_song(song_name):
    search_query = f"ytsearch1:{song_name}"
    sample_command = ["yt-dlp", "-x", "--audio-format", "m4a", "-o", f"downloads/audio/%(title)s.%(ext)s", search_query]
    try:
        subprocess.run(sample_command,check=True)
        return True 
    except subprocess.CalledProcessError  as e:
        print("the following error occurred:", e)
        return False 
def download_all_songs_from_file():
    with open("all_songs_list.txt", "r") as f:
        for each_line in f:
            song_name = each_line.strip()
            if not song_name:
                continue
            download_a_single_song(song_name)


token = get_token()


print("the token is", token)

# result = search_for_artist(token, "ilayaraja")
# artist_id = result["id"]
# songs = get_songs_by_artist(token,artist_id)


# for idx, song in enumerate(songs):
#     print(f"{idx +1}. {song['name']}")


''' 
playlist_id = "2NFQZ1YzCMayx2weWarOXj"  # Remove the query parameters
songs = get_playlist_tracks(token, playlist_id)

if songs:
    print("\nSongs in this playlist:")
    for idx, item in enumerate(songs):
        track = item["track"]
        artists = ", ".join([artist["name"] for artist in track["artists"]])
        print(f"{idx + 1}. {track['name']} by {artists}")
else:
    print("Could not fetch playlist songs")

'''



@app.route("/fetch_songss", methods=["GET"])
def fetch_songs_from_playlist():
    #hard coding playlist ID for now 
    playlist_id = request.args.get('chicken11')
   
    
    if not playlist_id:
        return jsonify({"error": "the playlist parameter ID is required hereee"}) ,400 
    token= get_token()
    
    songs = get_playlist_tracks(token, playlist_id)
    if songs:
        return jsonify(songs)
    else:
        return jsonify({"error":"Could not fetch any songs for the playlist you provideddd"}),404


@app.route("/fetch_songsss", methods=["GET"])
def fetch_songs_from_playlistt():
    playlist_id = request.args.get('chicken22')
   
    
    if not playlist_id:
        return jsonify({"error": "the playlist parameter ID is required hereee"}) ,400 
    token= get_token()
    
    songs = get_playlist_tracks(token, playlist_id)
    if songs:
        return jsonify(songs)
    else:
        return jsonify({"error":"Could not fetch any songs for the playlist you provideddd"}),404

@app.route("/fetch_god", methods=["GET"])
def fetch_god():
    #fetching all songs from all playlists 
    user_id = request.args.get('panipuri1')

    if not user_id:
        return jsonify({"error": "the user ID is required here"}),400
    token= get_token()
    all_playlist = get_all_playlists_from_user(token, user_id)
    if all_playlist:
        return jsonify(all_playlist)
    else:
        return jsonify({"error": " cannot ftetch shit here im annoyed"})

@app.route("/fetch_top_gods", methods=["GET"])
def fetch_top_gods():
    user_id = request.args.get('rasmalai')
    if not user_id:
        return jsonify({"error": "the user ID is required here"}),400

    token= get_token()
    top_gods = get_top_gods(token, user_id, top = 3)
    return jsonify({
        "top_gods": [{"name": name, "count": count} for name, count in top_gods]
    })

@app.route("/download_all_songs", methods=["GET"])
def download_all_songs():
    user_id = request.args.get("panipuri1")
    # with open("all_songs_list.txt","a") as f:
    all_songs_set = set()
    if not user_id:
        return jsonify({"error": "something is wrong in your new logic"}), 400 
    token = get_token()
    playlists = get_all_playlists_from_user(token, user_id)
    if not playlists or 'items' not in playlists:
        return jsonify({"error": "no playlists  found"}), 404

    with open("all_songs_list.txt", "w") as f:
        for playlist in playlists['items']:
            playlist_id = playlist['id'] 
            tracks = get_playlist_tracks(token, playlist_id)
            if not tracks:
                continue

            for item in tracks:
                if not item or not item.get('track'):
                    continue
                track = item['track']
                track_name = track.get("name")
                if track_name and (track_name not in all_songs_set):
                    all_songs_set.add(track_name)
                    f.write(track_name + "\n")
    return send_file("all_songs_list.txt",as_attachment=True,download_name="all_songs_list.txt")

@app.route("/master_download_all_songs", methods=["POST"])
def master_download_all_songs():
    download_all_songs_from_file()
    return({"status": "downlad is getting tstated"})

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)


