# Delta Spec: Fix Extinction Status Display

## Modified Requirements

### Extinction Status Rendering

WHEN the simulation reaches an extinction condition during a running `update()` tick, THEN the system SHALL evaluate extinction state before rendering, so that the status text displays the correct terminal message ("Fish extinct", "Sharks extinct", or "Ecosystem collapsed") in the same frame rather than remaining stuck on "Running".

The system SHALL use the same `check-then-render` ordering in both the natural-tick path (`update()`) and the manual-step path (`handleStep()`).
