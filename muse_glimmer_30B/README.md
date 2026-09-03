Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/muse_glimmer_30B/index.html

# Wa-Tor simulations with Muse Glimmer 30B
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the open weight model [Muse Glimmer 30B](https://artificialanalysis.ai/models/muse-glimmer) on 'High' level.  I'm developing with the Visual Studio Code (1.130.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).


# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - `The code should be object oriented and make good use of Javascript classes. Assume that 'entity records' means objects that are instances of classes that extend from a common entity class, e.g. Shark and Fish may be classes extending Entity.`
2. Propose step:
    - `/openspec-propose`
    - `Add a class diagram to design.md in mermaid format.`
3. Apply step:
    - `/openspec-apply-change`
    - Similar to the problem I saw with the Gemma projects, this model pauses after every few tasks.  I need to tell it to proceed.
    - The PWA icons are missing from the `assets` folder.  
    - `Create a src/main.js file that will configure and create the Phaser.Game object. It should also register the service worker when the page loads.`
    - The code now runs the simulation, but the layout is wrong.  Stats are overlapping the World display.  The controls and population graph are missing.  There is no code for controls.  The renderHistory function is empty.
    - Cost so far is $1.31.
    - `Implement the control buttons.  Implement history rendering.  Change the layout so the stats are left of the world grid, the controls are right of the world grid, and the history chart is below the world grid.`
    - Strangely, fixing this is costing a lot more than the initial build.  VS Code appears to be rereading the Simulation.js over and over.  Just this bug fix has cost $5.31.
4. Archive step:
    - `/openspec-archive-change`

The exercise has cost $6.62, a lot more than the [Muse Spark](../muse_spark_1.2/README.md) effort.  And, it still had problems whenever I pressed Pause or Reset.  Later, I fixed this by hand.

 It looks like _debugging_ with an AI is much more expensive than initial code generation. 