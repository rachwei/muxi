from flask import Flask, request, jsonify
from quart import Quart, render_template, websocket

import asyncio
import threading

from helpers.rec_engine import train_async, get_recs

app = Quart(__name__)

train_lock = threading.Lock()

@app.route('/train', methods=['post'])
async def train():
    users = request.args.get('users')
    reviews = request.args.get('reviews')
    await train_async(users, reviews)
    return "Training started!"

@app.route('/recommend', methods=['get'])
def recommend():
    user_id = request.args.get('user_id')
    if user_id is None:
        return jsonify({'message': 'User id is None'})
    
    recs = get_recs(user_id)
    return jsonify({"recs": recs})


if __name__ == '__main__':
    app.run(debug=True)