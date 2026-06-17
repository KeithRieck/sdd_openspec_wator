Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/codex/index.html

# Wa-Tor simulations with DeepSeek
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used DeepSeek V4 Pro.   I use [OpenCode](https://opencode.ai/) to interface with DeepSeek.

# Development:
1. First step:
    * `/opsx-explore`
    * OpenCode spontaneously reads the `spec-v001.md` file.
    * `Change the shark breed time to 25 and the shark energy gain from eating to 3`
    * `For this project, do not use Phaser Sprites.`
2. Second step:
    * `/opsx-propose`
    * OpenCode suggests that this simulation has a large scope.  It asks if I just want to slice off the simulation engine, or something smaller.   I tell it: `Make the full v1 implementation.`
    * OpenCode generates the usual documents, but it does not create a `spec.md` file.  It apparently thinks that `spec-v001.md` is sufficent.
    * `Create the spec.md file.`
3. Third Step:
    * `/opsx-apply`
    * Based on the DeepSeek portal, it appears that I've only used $0.07 for this project.
4. Fourth Step:
    * `/opsx-archive`

## Next iteration
There was a problem with the resulting code.  After an extinction, the status was left at "Running"

5. Next step:
    * `/opsx-explore Status is not set correctly after an extinction`
    * `/opsx-propose Fix the status problem after extinction`
    * Again, deepseek failed to create a delta `spec.md` file.  I had to prompt it to do so.  All the documents here are very short and are spcific to the code change, not really an update of requirements.
6. Apply step:
    * `/opsx-apply fix-extinction-status-display`
    * The fix was very simple.  Just reverse the order of two lines.