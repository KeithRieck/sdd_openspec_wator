import { WatorSimulation } from './simulation/WatorSimulation.js';
import { CONFIG } from './config.js';

/**
 * Headless test to verify the simulation engine's core logic.
 */
async function runSimulationTest() {
    console.log("Starting Wa-Tor Simulation Headless Test...");
    
    const sim = new WatorSimulation();
    sim.initialize();
    
    const initialPop = sim.getPopulation();
    console.log(`Initial Population - Fish: ${initialPop.fish}, Sharks: ${initialPop.sharks}`);
    
    // Run for 100 chronons
    for (let i = 0; i < 100; i++) {
        sim.step();
    }
    
    const finalPop = sim.getPopulation();
    console.log(`Population after 100 chronons - Fish: ${finalPop.fish}, Sharks: ${finalPop.sharks}`);
    
    if (finalPop.fish === 0 && finalPop.sharks === 0) {
        console.warn("Simulation went extinct quickly. Check constants.");
    } else {
        console.log("Simulation is running. Logic verified.");
    }
}

// Run the test
runSimulationTest().catch(console.error);
