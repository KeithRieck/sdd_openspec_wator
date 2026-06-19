/**
 * Renders the rolling population history chart.
 */
export default class HistoryChart {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.bounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
  }

  layout(x, y, width, height) {
    this.bounds.setTo(x, y, width, height);
  }

  render(history, maxCount) {
    const { x, y, width, height } = this.bounds;
    this.graphics.clear();
    this.graphics.fillStyle(0x001a33, 1);
    this.graphics.fillRect(x, y, width, height);

    if (history.length < 2) return;
    const maxPopulation = maxCount || Math.max(...history.flatMap(sample => [sample.fish, sample.sharks, 1]));
    const chartWidth = width;
    const chartHeight = height;
    const step = chartWidth / Math.max(history.length - 1, 1);

    this.graphics.lineStyle(2, 0x00ff00, 1);
    this.graphics.beginPath();
    history.forEach((sample, index) => {
      const px = x + index * step;
      const py = y + chartHeight * (1 - sample.fish / maxPopulation);
      if (index === 0) this.graphics.moveTo(px, py);
      else this.graphics.lineTo(px, py);
    });
    this.graphics.strokePath();

    this.graphics.lineStyle(2, 0x0000ff, 1);
    this.graphics.beginPath();
    history.forEach((sample, index) => {
      const px = x + index * step;
      const py = y + chartHeight * (1 - sample.sharks / maxPopulation);
      if (index === 0) this.graphics.moveTo(px, py);
      else this.graphics.lineTo(px, py);
    });
    this.graphics.strokePath();
  }
}
