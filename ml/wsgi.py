
from quart import Quart, render_template, websocket, current_app, request, jsonify
import sys

import asyncio
import threading

from helpers.rec_engine import train_async, get_recs

app = Quart(__name__)

@app.route('/train', methods=['post'])
async def train():
    data = await request.get_json()
    print(data)
    users = data.get('users')
    reviews = data.get('reviews')
    print(users)
    print(reviews)
    print('This is standard output', file=sys.stdout)
    asyncio.create_task(train_async(users, reviews))

    return "Training started!"

@app.route('/recommend', methods=['get'])
def recommend():
    user_id = request.args.get('user_id')
    if user_id is None:
        return jsonify({'message': 'User id is None'})
    
    recs = get_recs(user_id)
    return jsonify(recs)


if __name__ == '__main__':
    app.run(debug=True)