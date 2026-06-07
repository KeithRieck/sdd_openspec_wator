Hosted at: 

# Wa-Tor simulations
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

# Development:
1.  First pass:
    * `[$openspec-propose](.codex/skills/openspec-propose/SKILL.md) Create docs for a wa-tor simulation based on the file [`spec-v001.md`](spec-v001.md).`
    * All the new documents add up to just over 500 lines of text.  It takes a while to read through.
2. Second pass:
    * `[$openspec-apply-change](.codex/skills/openspec-apply-change/SKILL.md)`
    * Codex attempts to run the app in a local server to test it.   This didn't succeed, so I told Codex that I'd test it myself later.
    * The result works, but the speed buttons extend a little off the right of the screen.
    * `The speed buttons are too wide for the given side panel.  Change the 'rebuildButtons' method so it splits these buttons over multiple rows and  displays at most 3 speed buttons per row.`
    * `Change the speed buttons so they are of fixed size, and as narrow as possible.  They should not expand to fill all the horizontal space on each row.`
    * The result works and looks good.  However, the sharks always die off, which doesn't make sense.
