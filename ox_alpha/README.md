Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/ox_alpha/index.html

# Wa-Tor simulations with Ox Alpha
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

OpenRouter announced a sale on an "unreleased frontier model" with a codename of "Ox Alpha". This model has a context window of a million tokens and it is created for coding and agentic work. For the next couple of days it will be free. I'm running it on 'High' level.  I'm developing with the Visual Studio Code (1.134.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).


# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - `The result should be object oriented and make good use of Javascript classes. Assume that 'entity records' means objects that are instances of classes that extend from a common entity class, e.g. Shark and Fish may be classes extending Entity.`
2. Propose step:
    - `/openspec-propose`
    - Weirdly, it generated a Mermaid diagram, but didn't properly specify the triple-tick for Markdown interpretation. I fixed this by hand.
3. Apply step:
    - `/opsx-apply`
    - Reasonably quick to generate code.
    - The `SimulationScene.js` file has a bad import statment that kept it from loading.  I also fixed this by hand.
    - `The drawWorld function is called, but o fish or sharks are displayed on the #sym:worldGfx  object.  After 5 chronons, all the sharks die.`
    - `The blue and green circles for sharks and fish are huge, and they extend far beyond the dispaly.  They must be small enough to display the whole world on one screen.`
    - `None of the buttons do anything.  Clicking on a #soes not call the expected function.`