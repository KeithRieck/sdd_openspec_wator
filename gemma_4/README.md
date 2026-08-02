Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/gemma_4/index.html

# Wa-Tor simulations with Gemma 4
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the open-weight model [Gemma 4](https://artificialanalysis.ai/models/gemma-4-12b/providers) developed by Google in the United States.  I'm developing with the Visual Studio Code (1.130.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).

# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - `The resulting code should be object oriented and make good use of Javascript classes. Assume that 'entity records' means objects that are instances of classes that extend from a common entity class. `
2. Propose step:
    - `/openspec-propose`
    - `Add a class diagram to design.md in mermaid format.`
 3. Apply step
    - `/openspec-apply-change`
    - Processing is _really_ slow.  At first, it pauses after each task to wait for my response; I have to tell it to stop pausing.
    - The 'main.js' file didn't reference the other modules correclty. I fixed this by hand.
    - Gemma put all three entity classes into one file: `Entity.js`
    - Gemma didn't follow the requirements regarding layout.  It put controls, stats, and population all on the right column.  Also, dynamnic resizing the window does not work.
    - Also, it made the shark and fish circles way too big.  I fix this by hand also.
    - `The auto-pause logic for shark or fix extinction is not working.   See item 37 in the PRD.   Fix the code to pause execution if either the shark or fish populations go to zero.`
 4. Archive step
    - `/openspec-archive-change`
    - This app cost 45 cents to create.
    