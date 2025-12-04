# DroidWright Script Market 🤖

This is the official repository for community-contributed scripts for **DroidWright**. 
The app uses this repository to populate the "Online" scripts tab.

## 📂 How to Use
Scripts in this repository are automatically indexed in `market_index.json`. 
You can browse the `scripts/` folder manually or use the DroidWright app to download them.

## 🚀 Contributing a Script
We welcome submissions! To add your script to the market:

1. **Fork** this repository.
2. Create your script in the `scripts/` folder.
3. **Important:** Your script MUST include the standard metadata header:
   ```javascript
   // ==DroidScript==
   // @id              my-unique-script-id
   // @name            My Awesome Script
   // @description     Describes what this script does...
   // @author          YourName
   // @version         1.0.0
   // ==/DroidScript==
   
   function droidRun(ctx) {
       // Your code here
   }