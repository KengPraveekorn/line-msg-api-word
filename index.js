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
      ? await events.map((item) => handleEvent(item))
      : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});

const handleEvent = async (event) => {
  if (event.type !== "message" || event.message.type !== "text") {
    return null;
  } else if (event.type === "message") {
    const url1 = `https://${env.RAPID_URL}/words/${event.message.text}/synonyms`;
    const url2 = `https://${env.RAPID_URL}/words/${event.message.text}/definitions`;

    Promise.all([
      axios.get(url1, {
        headers: {
          "x-rapidapi-host": env.RAPID_URL,
          "x-rapidapi-key": env.RAPID_KEY,
        },
      }),
      axios.get(url2, {
        headers: {
          "x-rapidapi-host": env.RAPID_URL,
          "x-rapidapi-key": env.RAPID_KEY,
        },
      }),
    ]).then((data) => {
      console.log("Data first API", data[0].data.synonyms);
      let i = 0;
      let str1 = "";
      let str2 = "";
      const synonyms = data[0].data.synonyms;
      while (i < synonyms.length && i <= 4) {
        str1 += i + 1 + "." + " " + `${synonyms[i]}\n`;
        i++;
      }
      console.log("STR first API =>>>>>>", str1);

      console.log("Data second API", data[1].data.definitions.map((e) => e.definition));
      const definitions = data[1].data.definitions.map((e) => e.definition);
      str2 += 1 + "." + " " + `${definitions[0]}`;
      console.log("STR second API =>>>>>>", str2);

      const checkNoSyn = ()=>{
        if(!str1){
          return "Word: " + data[0].data.word + "\n" + "•Definition: " + "\n" + str2
        }else{
          return "Word: " + data[0].data.word + "\n" + "•Definition: " + "\n" + str2 + "\n" + "•Synonyms: " + "\n" + str1
        }
      }
      

      return client.replyMessage(event.replyToken, {
        type: "text",
        // text: "Word: " + data[0].data.word + "\n" + "•Definition: " + "\n" + str2 + "\n" + "•Synonyms: " + "\n" + str1
        text: checkNoSyn() 
      });
    });
  }
};

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(PORT);
  console.log(`listening on port ${PORT}`);
});








//  const { data } = await axios.get(
//   `https://${env.RAPID_URL}/words/${event.message.text}/synonyms`,
//   {
//     headers: {
//       "x-rapidapi-host": env.RAPID_URL,
//       "x-rapidapi-key": env.RAPID_KEY,
//     },
//   }
// );

// const { synonyms } = data;
// let str = "";
// synonyms.forEach((result, i) => {
//   // str += synonyms.length - 1 !== i ? (i+1)+ "." + " " +`${result}\n` : result;
//   str += (i+1)+ "." + " " +`${result}\n`
// });
// console.log("STR =>>>>>>", str);

// console.log("Data=>>>>>", data.definitions.map((e)=>e.definition));
    // console.log("Data=>>>>>", data);
    // console.log("Data=>>>>>", firstResponse.definitions.map((e)=>e.definition));

    // let i = 0;
    // let str = "";
    // const synonyms = data.synonyms;
    // while (i < synonyms.length && i <= 4 ) {
    //   str += (i+1)+ "." + " " + `${synonyms[i]}\n`
    //   i++;
    // }
    // console.log("STR =>>>>>>", str);

    // const definitions = firstResponse.definitions.map((e)=>e.definition)
    // str += 1+ "." + " " + `${definitions[0]}`
    // console.log("STR =>>>>>>", str);

    // return client.replyMessage(event.replyToken, { type: "text", text: "Word: "+ data.word + "\n" + "Synonyms: " + "\n" + str});
    // return client.replyMessage(event.replyToken, { type: "text", text: "Word: "+ data.word + "\n" + "definitions: " + "\n" + str});