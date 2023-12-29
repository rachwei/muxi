import asyncio
import numpy as np
import json

train_semaphore = asyncio.Semaphore(value=1)
user_mapping_url = "../data/user_mapping.json"
unique_songs_url = "../data/unique_songs.json"
matrix_url = "../data/matrix.csv"
similarity_matrix_url = "../data/similarity_matrix.csv"

def select_cols(df):
    return df[["name", "artist", "spotify_id", "danceability", "energy", "loudness", "speechiness", "acousticness", 
                "instrumentalness", "liveness", "valence", "acousticness_artist", "danceability_artist", "energy_artist", 
                "liveness_artist", "speechiness_artist", "valence_artist"]]

async def cosine_similarity(matrix):
    norm = np.linalg.norm(matrix, axis=1)

    zero_norm_indices = np.where(norm == 0)[0]
    norm[norm == 0] = np.finfo(float).eps  # Replace zero norms with a small epsilon

    norm_matrix = matrix / norm[:, np.newaxis]
    similarity_matrix = np.dot(norm_matrix, norm_matrix.T)

    similarity_matrix[zero_norm_indices, :] = 0
    similarity_matrix[:, zero_norm_indices] = 0

    return similarity_matrix

# def store_songs():
    # songs = pd.read_csv("../data/Music.csv")
    # songDF = select_cols(songs)


async def train_async(users, reviews):
    async with train_semaphore:
        user_mapping = {user: index for index, user in enumerate(users)}
        unique_songs = list(set(entry['song_id'] for entry in reviews))
        song_mapping = {song: index for index, song in enumerate(unique_songs)}

        matrix = np.zeros((len(users), len(unique_songs)))

        for review in reviews:
            matrix[user_mapping[review['user_id']]][song_mapping[review['song_id']]] = review['rating']['$numberInt']
        
        similarity_matrix = await cosine_similarity(matrix)
        # save everything
        with open(user_mapping_url, 'w') as json_file:
            json.dump(user_mapping, json_file)
        with open(unique_songs_url, 'w') as json_file:
            json.dump(unique_songs, json_file)
        np.savetxt(matrix_url, matrix, delimiter=',')
        np.savetxt(similarity_matrix_url, similarity_matrix, delimiter=',')
        print("Done!")
        

def get_recs(user_id, k = 10):
    matrix = np.loadtxt(matrix_url, delimiter=',')
    similarity_matrix = np.loadtxt(similarity_matrix_url, delimiter=',')

    with open(user_mapping_url, 'r') as json_file:
        user_mapping = json.load(json_file)
    with open(unique_songs_url, 'r') as json_file:
        unique_songs = json.load(json_file)

    if user_id not in user_mapping:
        return []

    user_index = user_mapping[user_id]
    user_ratings = matrix[user_index] # get user ratings
    weighted_ratings = np.dot(similarity_matrix[user_index], matrix)
    
    unrated_items = np.where(user_ratings == 0)[0] # exclude rated items
    sorted_items = sorted(unrated_items, key=lambda x: weighted_ratings[x], reverse=True) # sort
    indices = sorted_items[:k]
    
    recs = [unique_songs[index] for index in indices]
    return recs

if __name__ == "main":
    print("in the rec engine")