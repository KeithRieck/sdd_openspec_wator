/** Pure responsive geometry calculator for the Phaser interface. */
export class LayoutManager {
  /** Calculate regions for the world, side panels, and history chart. */
  static calculate(viewportWidth, viewportHeight, worldWidth, worldHeight) {
    const narrow = viewportWidth < 900 || viewportWidth < viewportHeight * 0.9;
    const margin = narrow ? 14 : 22;
    const gap = narrow ? 10 : 18;
    const chartHeight = Math.max(105, Math.min(180, viewportHeight * 0.18));
    const contentHeight = Math.max(120, viewportHeight - chartHeight - margin * 2 - gap);

    if (!narrow) {
      const sideWidth = Math.min(210, Math.max(155, viewportWidth * 0.16));
      const controlsWidth = Math.min(235, Math.max(185, viewportWidth * 0.18));
      const world = fitRect(
        margin + sideWidth + gap,
        margin,
        viewportWidth - margin * 2 - sideWidth - controlsWidth - gap * 2,
        contentHeight,
        worldWidth,
        worldHeight,
      );
      return {
        narrow: false,
        stats: { x: margin, y: margin, width: sideWidth, height: contentHeight },
        world,
        controls: { x: viewportWidth - margin - controlsWidth, y: margin, width: controlsWidth, height: contentHeight },
        chart: { x: margin, y: viewportHeight - margin - chartHeight, width: viewportWidth - margin * 2, height: chartHeight },
      };
    }

    const topHeight = Math.min(120, Math.max(88, viewportHeight * 0.12));
    const panelWidth = (viewportWidth - margin * 2 - gap) / 2;
    const world = fitRect(margin, margin + topHeight + gap, viewportWidth - margin * 2, contentHeight - topHeight - gap, worldWidth, worldHeight);
    return {
      narrow: true,
      stats: { x: margin, y: margin, width: panelWidth, height: topHeight },
      controls: { x: margin + panelWidth + gap, y: margin, width: panelWidth, height: topHeight },
      world,
      chart: { x: margin, y: viewportHeight - margin - chartHeight, width: viewportWidth - margin * 2, height: chartHeight },
    };
  }
}

function fitRect(x, y, maxWidth, maxHeight, aspectWidth, aspectHeight) {
  const scale = Math.min(maxWidth / aspectWidth, maxHeight / aspectHeight);
  const width = aspectWidth * scale;
  const height = aspectHeight * scale;
  return { x: x + (maxWidth - width) / 2, y: y + (maxHeight - height) / 2, width, height };
}
