import React, {useState, useEffect} from "react";



function HomeScreen(user) {

    const friends = ["friend1", "friend2", "friend3", "friend4", "friend5"];

    function getFriendsList() {
        var reviews = [];
        for (let friend of friends) {
            reviews.push(friend + " review")
        }

        return reviews;
    }

    return (
        <div>
            <p>hi {user.user.display_name}</p>
            {getFriendsList().map(function(friend, i){
                return <p>{friend}</p>
            })}
        </div>
    );
}

export default HomeScreen;