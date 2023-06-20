# Line Bot synonyms and definition system
## Scenario
When input any word to Line chatbot, such as **Regret**, Line chatbot should response to show 5 synonyms and 1 definition of **Regret** in the chat.
## Requirement
 - Develop & deploy the system to any cloud (serverless) such as AWS Lambda, GCP Function, Heroku, or DigitalOcean.
 - Integrate the system with Line Chat Bot API.
 - Integrate the system with Oxford Dictionary API. 
## Example Situation
- The word has definition and synonyms.
  - Input: **Regret**
  - Output:
    - Definition: feel sad
    - Synonyms:
      1. disappointment
      2. grudge
      3. heartache
      4. heartbreak
      5. huff
- The word has only definition.
  - Input: Apple
  - Output:
    - Definition: the tree which bears apples
