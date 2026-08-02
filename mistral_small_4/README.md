Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/mistral_small_4/index.html

# Wa-Tor simulations with Mistral Small 4
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the open-weight model [Mistral Small 4](https://artificialanalysis.ai/models/mistral-small-4) from France.  I'm developing with the Visual Studio Code (1.130.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).

# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - `The result should be object oriented and make good use of Javascript classes. Assume that 'entity records' means objects that are instances of classes that extend from a common entity class, e.g. Shark and Fish may be classes extending Entity.`
2. Propose step:
    - `/openspec-propose`
    - This time it created a large [`.openspec.yaml`](openspec/changes/create-wa-tor-web-app/.openspec.yaml) file.
    - This time the design contains a lot of code.  Also, it tends towards ASCII art instead of Mermaid diagrams.
    - No `spec.md` file was created.
    - So far, this has cost 16 cents.
3. Apply step:
    - `/openspec-apply-change`
    - The resulting code doesn't work. This code had the most problems of any previous app.
        - `The scene classes each need a constructor that gives them a unique key.`
        - `Within the gameLoop function, remove the code that creates new events.`
        - `Phaser scene objects should have an update function.  Add an update function to SimulationScene.  The gameLoop function should be called from update but not from create.`
        - `The speed controls should determine how many chronons execute per second.  The step control should only be available when the simulation is paused.  The step control should execute exactly one chronon.`
        - Speed is still wrong.  Plus, I had to fix a syntax error in the code.
        - `Change the layout so the controls and history chart do not overlap the simulation canvas.  The simulation canvas should be in the middle.`
        - The layout is still wrong.
    - So far, this has cost 38 cents.
