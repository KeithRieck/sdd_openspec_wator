# Tasks: Fix Extinction Status Display

## Task Order

---

### 1. [ ] Swap renderAll and checkExtinction in update()

**Depends on:** Nothing

In `src/scenes/SimulationScene.js`, swap the two lines in the `update()` method so `checkExtinction()` runs before `renderAll()`.

Lines to change (currently in `update()` at the end):
```
this.renderAll();
this.checkExtinction();
```

Change to:
```
this.checkExtinction();
this.renderAll();
```

**Verification:** Run the simulation until fish or sharks go extinct naturally. The status line should display the correct extinction message ("Fish extinct", "Sharks extinct", or "Ecosystem collapsed") instead of remaining stuck on "Running".

---

### 2. [ ] Verify Step button path unaffected

**Depends on:** Task 1

Confirm that `handleStep()` at line 283-284 still uses `checkExtinction()` then `renderAll()` and displays correct status after a step-triggered extinction.

**Verification:** Pause simulation, step through until extinction. Status displays correctly.
