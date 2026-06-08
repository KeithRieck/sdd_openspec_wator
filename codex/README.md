Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/codex/index.html

# Wa-Tor simulations with OpenAI Codex
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used GPT 5.5 model at Medium reasoning level.  At the time of this writing, this is OpenAI's top frontier model.

# Development:
1. First step:
    * `$openspec-propose Create docs for a wa-tor simulation based on the file spec-v001.md`
    * All the new documents add up to just over 500 lines of text.  It takes a while to read through.
2. Second step:
    * `$openspec-apply-change`
    * Codex attempts to run the app in a local server to test it.   This didn't succeed, so I told Codex that I'd test it myself later.
    * The result works, but the speed buttons extend a little off the right of the screen.
    * `The speed buttons are too wide for the given side panel.  Change the 'rebuildButtons' method so it splits these buttons over multiple rows and  displays at most 3 speed buttons per row.`
    * `Change the speed buttons so they are of fixed size, and as narrow as possible.  They should not expand to fill all the horizontal space on each row.`
    * The result works and looks good.  However, the sharks always overpopulate.  Tweaking the shark configurations make for a more interesting simulation.
3. Third step:
    * `$openspec-archive-change`