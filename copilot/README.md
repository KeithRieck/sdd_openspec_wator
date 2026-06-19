Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/copilot/index.html

# Wa-Tor simulations with GitHub Copilot
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the GitHub copilot model, using the free tier.  For this, we are using GitHub's "Raptor mini" model, which is a tuned variant of "GPT-5 mini".

# Development:
1. Exploration step:
    - `/opsx-explore I want to create a web app that runs the wa-tor simulation, using the requiremetns from  the spec-v001.md file.`
    - `The result should be object oriented and make good use of Javascript classes.   For instance, sharks and fish are similar entities that inhabit the world.`
    - Copilot went ahead and started creating code, despite the fact that it should have been in 'explore' mode.
    - `You are still in the openspec 'explore' mode. Do not create any code yet. Delete all those new javascript files.`
2. Proposal step:
    - `/opsx-propose`
    - Copilot creates the proposal, design, and tasks documents, but (just like Gemini and Deepseek.) fails to create the specification.  I have to explain to Copilot what it should do:
    - `The 'spec.md' file should be an OpenSpec 'delta spec' which will be updated during the lifetime of this app. It should be under the openspec/specs directory.`
    - The `spec.md` file is finally created.
3. Apply step:
    - `/opsx-apply`
    - Code is generated, including a `test-harness.html` which is the first time I've seen a web page to test the simulation.  However, for the first time, an app is created that doesn't run.  The page is blank.
    - `Within main.js you create a config object which contains a "scene" element which should contain a list of all the game's scenes.  You must add SimulationScene to this list.`
    - `The serviceWorker is not getting started during the window load event.`
    - `Start the serviceWorker in main.js, not index.html`
    - Finally, I have to manually fix `main.js` to load the serviceWorker.   Also, I rewrite `sw.js` entirely.
    - Still, nothing is displaying, and there are no errors on the console.   I ask Copilot to figure it out.  Copilot spends a *long* time trying to figure it out.
    - `In SimulationScene, the statsTexts object puts all four text objects at the same location, so they overlap.  Change this so each text item is on a separate line.`
