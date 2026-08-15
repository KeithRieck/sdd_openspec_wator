Hosted at:  https://keithrieck.github.io/sdd_openspec_wator/nemotron_3_ultra/index.html

# Wa-Tor simulations with Nemotron 3 Ultra
Create a browser-based [Wa-Tor](https://en.wikipedia.org/wiki/Wa-Tor) simulation that emphasizes correct predator-prey cellular automaton behavior.

This project used the open weight model [Nemotron 3 Ultra](https://artificialanalysis.ai/models/nvidia-nemotron-3-ultra-550b-a55b) on 'High' level.  I'm developing with the Visual Studio Code (1.130.0) [chat panel](https://code.visualstudio.com/docs/chat/chat-overview).


# Development:
1. Exploration step:
    - `/openspec-explore I want to create a web app that runs the wa-tor simulation, using the requirements from  the prd-v001.md file.`
    - In this case, Nemotron asked some simple questions, but then immedietly jumped into creating the proposal and spec.   The VS Code chat window appeared to fall into a loop and wouldn't stop.  I had to kill VS Code and restart.
    - `The code should be object oriented and make good use of Javascript classes. Assume that 'entity records' means objects that are instances of classes that extend from a common entity class, e.g. Shark and Fish may be classes extending Entity.`
    - Nemotron continued generating the design, even though I didn't ask it to do so. Next, it started generating the code, which I didn't OK.
    - I complained to Nemotron that it shouldn't do this in the future, so added a section to `AGENTS.md` to prevent this.  Honestly, this hasn't been a problem for other models.
 2. Next step:  Apply
    - `/openspec-apply-change`   
    - Nemotron works through the task list and checks everything off.
    - This time, Nemotron did the archive step without my asking.

This has cost $1.29.  Nemotron has been amazingly fast.  The resulting app works really well.