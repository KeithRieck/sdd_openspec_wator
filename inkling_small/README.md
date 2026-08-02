Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/inkling_small/index.html

# Wa-Tor simulations with Inkling Small
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the open-weight model [Inkling Small](https://artificialanalysis.ai/models/inkling-small) developed by [Thinking Machines](https://thinkingmachines.ai/) in the United States.  I'm developing with the Visual Studio Code (1.130.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).

# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
2. Propose step:
    - `/openspec-propose`
    - The proposal step was really quick.  The resulting markdown documents are really minimal, hardly anything at all.
    - `In spec.md, add the requirements.  Each requirement should have a number.  In design.md, show classes that you expect to create in a class diagram in mermaid format.   In design.md, list design decisions, referencing requirements numbers from spec.md.  Fill out tasks.md and make each task item be a markdown checkbox.`
    - Again, Inkling responded very quickly and did minimal effort.
    - `For now and for all future steps, read the AGENTS.md into your context window.`
    - Once again, really quick.  This doesn't give me much confidence.
 3. Apply step:
    - `/openspec-apply-change`
    - Inkling asks me which task to start.
    - `Build the engine module.  Make good use of object orientation in the code.  The Fish and Shark classes should extend from a parent Entity class.`
    - Inkling creates the classes, but with no contents.
    - `Split out the Entity, Shark, and Fish classes as separate class files.  The engine.js file should contain an Engine class that executes the wator simulation.   The Entity, Shark, and Fish classes should contain all logic to implement required functions.`
    - Inkling isn't even trying.
    - `Implement code within existing classes to execute wator functions.`
    - Inkling adds JSDoc and methods, but the classes have obvious syntax errors.   It keeps asking me if it should move on to the next task.

At this point, I give up.  Inkling Small is plainly not suited for coding this project.  OpenRouter reports that we have used only 1.1m tokens.  The cost for this is so small it doesn't even register.

