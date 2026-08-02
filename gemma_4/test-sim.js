import { WatorSimulation } from './src/simulation/WatorSimulation.js';
import { CONFIG } from './src/config.js';

async function runTest() {
    console.log('Starting Wa-Tor Simulation Headless Test...');
    
    const sim = new WatorSimulation();
    sim.initialize();
    
    const initialPop = sim.getPopulation();
    console.log(`Initial Population - Fish: ${initialPop.fish}, Sharks: ${initialPop.sharks}`);
    
    if (initialPop.fish === 0 || initialPop.sharks === 0) {
        console.error('Test Failed: Initial population is missing fish or sharks.');
        process.exit(1);
    }

    // Run for 100 steps
    for (let i = 0; i < 100; i++) {
        sim.step();
    }
    
    const finalPop = sim.getPopulation();
    console.log(`Population after 100 steps - Fish: ${finalPop.fish}, Sharks: ${finalPop.sharks}`);
    
    // We just want to see if it runs without crashing and if populations change
    if (finalPop.fish === initialPop.fish && finalPop.sharks === initialPop.sharks) {
        console.warn('Warning: Population did not change. This might be normal for very small/large grids, but suspicious.');
    } else {
        console.log('Test Passed: Simulation state evolved.');
    }
}

runTest().catch(err => {
    console.error('Test crashed:', err);
    process.exit(1);
});
