const express = require('express')
const request = require('request')
const mongoose = require('mongoose');
const log = console.log

const Story = require('./models/Story')

const app = express()
const port = 3000

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/reing-test',
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
  )
  .then(() => log('MongoDB Connected'))
  .catch(err => log(err));

const populateDb = () => {
    let listOfNews = [];
    Story.find()
        .then(stories => {
            log('STORIES', stories)

            if (stories.length === 0) {
                request.get('http://hn.algolia.com/api/v1/search_by_date?query=nodejs', (err, response, body) => {
                    if (!err && response.statusCode == 200) {

                        listOfNews = JSON.parse(body).hits.map(value => ({
                            story_title: value.story_title,
                            title: value.title,
                            story_url: value.story_url,
                            url: value.url,
                            author: value.author,
                            created_at: value.created_at,
                            objectID: value.objectID,
                            deleted: false
                        }));
                        Story.collection.insert(listOfNews, function (err, docs) {
                            if (err){ 
                                return error(err)
                            } else {
                              log("MultiInsertStory")
                            }
                        });

                    }
                })
            }

        })
        .catch(err => log(err))

}

// cron function
const cron = (ms, fn) => {
    function cb() {
        clearTimeout(timeout)
        timeout = setTimeout(cb, ms)
        fn()
    }
    let timeout = setTimeout(cb, ms)
    return () => {}
}

app.listen(port, () => {
    populateDb()
    cron(60*60*1000, () => log("cron job"))
    log(`Server: PORT ${port} active`)
})