Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/gemini/index.html

# Wa-Tor simulations With Gemini
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used Google's [Gemini 3.5 Flash](https://deepmind.google/models/gemini/flash/).  This model is lower-rated (and cheaper) than the models used here for Claude and Codex.  I use [Antigravity](https://antigravity.google/) to interface with Gemini.

# Development:
1. First step:
    * `/opsx:explore`
    * `I want to create a web app that runs the wa-tor simulation.  I want to start based on the spec-v001.md file and use the phaser-game skill conventions.`
    * `For this project, do not use Phaser Sprites.`
    * `Create the BootScene class, but not the PreloaderScene.`
    * Gemini jumped forward and started creating documents before I told it to.
2. Second step:
    * `/opsx:propose`
    * Antigravity and Gemini did not create a `spec.md` file, apparently assuming that `spec-v001.md` was the specification.
3. Third step:
    * `/opsx:apply`
    * Code was generated and Antigravity started testing.  Part way through testing, it announced that my weekly quota had been reached.
4. Fourth step:
    * `/opsx:archive`
    