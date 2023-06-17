const line = require("@line/bot-sdk");
const express = require("express");
const axios = require("axios").default;
const dotenv = require("dotenv");

const app = express();

const env = dotenv.config().parsed;
// console.log(env);

const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};

// Create client เป็นการเรียกในฝั่งของ Line มา
const client = new line.Client(lineConfig);

app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    return events.length > 0
      ? await events.map(item => handleEvent(item)) : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

const handleEvent = async (event) => {
    if(event.type !== 'message' || event.message.type !== 'text'){
        return null;
    }
    else if (event.type === 'message'){
        const { data } = await axios.get(`https://${env.RAPID_URL}/words/${event.message.text}/synonyms`,{
            headers: {
                'x-rapidapi-host':env.RAPID_URL,
                'x-rapidapi-key': env.RAPID_KEY
            }
        })
        console.log("Data=>>>>>",data);
        const { synonyms } = data
        let str = ''
        synonyms.forEach((result,i)=> {
            str += synonyms.length -1 !== i ? `${result}\n` : result
        })
        console.log("STR =>>>>>>", str);
        return client.replyMessage(event.replyToken, { type: 'text', text: str });
    }
  
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(PORT);
  console.log(`listening on port ${PORT}`);
});
