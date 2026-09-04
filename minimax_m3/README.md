Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/minimax_m3/index.html

# Wa-Tor simulations with MiniMax-M3
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the Chinese open-weight model [MiniMax-M3](https://artificialanalysis.ai/models/minimax-m3). I'm running it on 'Medium' level.  I'm developing with the Visual Studio Code (1.134.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).


# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - Although I did not OK this, it appears that MiniMax went and read the directory for the Qwen project, which is proactive, but kind of cheating.
    - MiniMax correctly decomposed Entity into Shark and Fish classes already.  
    - `Use only information and files beneath the minimax_m3 directory. Do not consult any other wator projects on the file systems.`
    - `Use the src/ui/PhaserButton.js for the buttons on the ui. Use the image files under the assets directory for the PWA icons.`
    - After adding these two constraints, MiniMax took a **long** time to reconsider everything.  It may have been stuck in a loop; I had to finally stop it.
2. Propose step: Generating Documents
    - `/openspec-propose`
    - This appears to be another model that must be constantly told not to pause and to proceed.
    - The resulting [`design.md`](./openspec/changes/archive/add-wa-tor-simulation/design.md) file contains lots of mermaid diagrams, including a sequence diagram.
3. Apply step: Generating Code
    - `/openspec-apply-change`
4. Archive step:
    - `/openspec-archive-change`
