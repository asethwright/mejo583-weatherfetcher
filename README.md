# Power Outage Tracker

This is a simple fetch app written to query the Duke Energy servers every five minutes to see if there is new outage data. If there is new data, it saves a JSON file and marks a timestamp.

Duke Energy says they provide updates about every five minutes, so that is why I chose that timeframe. I don't see that a smaller timeframe would provide any added amount of meaning to the data.

# First Run

This was developed during the first winter storm in 2016 for North Carolina. I started collecting data at 2PM on Friday, so unfortunately it is not a complete dataset. But weather is expected to continue through the weekend. I suspect that the data will still tell a story.

# Post Storm

My plan is to take this data and parse it into a MongoDB data structure. The data will then be displayed through an Angular SPA and D3.js visualization.
