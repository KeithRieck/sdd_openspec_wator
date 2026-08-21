/**
 * @file Pure layout computation for all UI regions.
 */

import { UI } from '../config.js';

/**
 * Computes the rectangles for every UI region from the viewport size
 * and grid aspect ratio (design D4, prd-v001.md AC 8, 9, 51, 52).
 *
 * Wide layout (AC 51): stats left, world center, controls right, chart
 * across the bottom. Narrow layout (AC 52, below `narrowThreshold`
 * effective width): stats and controls stack as compact strips above
 * the world; the chart stays at the bottom. The world always preserves
 * the grid aspect ratio and is centered within its region.
 *
 * The function is pure: identical inputs produce identical output
 * (responsive-layout spec, Layout solver purity).
 *
 * @param {number} viewportWidth Current viewport width in pixels.
 * @param {number} viewportHeight Current viewport height in pixels.
 * @param {number} gridWidth Grid width in cells.
 * @param {number} gridHeight Grid height in cells.
 * @returns {{stats: Rect, world: Rect, controls: Rect, chart: Rect,
 *   worldScale: {cell: number, offsetX: number, offsetY: number},
 *   narrow: boolean}} Region rectangles plus world cell scale/offsets.
 */

/**
 * @typedef {Object} Rect
 * @property {number} x Left edge in pixels.
 * @property {number} y Top edge in pixels.
 * @property {number} w Width in pixels.
 * @property {number} h Height in pixels.
 */
export function solveLayout(viewportWidth, viewportHeight, gridWidth, gridHeight) {
  const gridAspect = gridWidth / gridHeight;
  const chartH = Math.max(UI.minChartHeight, Math.round(viewportHeight * UI.chartHeightFraction));
  const chart = { x: 0, y: viewportHeight - chartH, w: viewportWidth, h: chartH };
  const above = viewportHeight - chartH;
  const narrow = viewportWidth < UI.minViewportWidth * 1.35;

  if (narrow) {
    // Stacked reflow: stats strip, controls strip, world fills the rest.
    const stripH = Math.max(64, Math.round(above * 0.12));
    const stats = { x: 0, y: 0, w: viewportWidth, h: stripH };
    const controls = { x: 0, y: stripH, w: viewportWidth, h: stripH };
    const world = { x: 0, y: stripH * 2, w: viewportWidth, h: above - stripH * 2 };
    return { stats, world, controls, chart, worldScale: fitWorld(world, gridWidth, gridHeight), narrow: true };
  }

  const sideW = Math.max(
    UI.minSidePanelWidth,
    Math.round(viewportWidth * UI.sidePanelWidthFraction)
  );
  const stats = { x: 0, y: 0, w: sideW, h: above };
  const controls = { x: viewportWidth - sideW, y: 0, w: sideW, h: above };
  const world = { x: sideW, y: 0, w: viewportWidth - sideW * 2, h: above };
  return { stats, world, controls, chart, worldScale: fitWorld(world, gridWidth, gridHeight), narrow: false };
}

/**
 * Computes the cell size and centering offsets that fit the whole grid
 * into a world rectangle while preserving aspect ratio (AC 8, 52).
 * The cell size is bounded by BOTH the region width over the grid
 * width and the region height over the grid height, so every row and
 * column fits on screen.
 *
 * @param {Rect} world World region rectangle.
 * @param {number} gridWidth Grid width in cells.
 * @param {number} gridHeight Grid height in cells.
 * @returns {{cell: number, offsetX: number, offsetY: number}} Cell size
 *   in pixels plus x/y offsets centering the grid in the region.
 */
function fitWorld(world, gridWidth, gridHeight) {
  const cell = Math.max(1, Math.floor(Math.min(world.w / gridWidth, world.h / gridHeight)));
  const gridW = cell * gridWidth;
  const gridH = cell * gridHeight;
  const offsetX = world.x + Math.floor((world.w - gridW) / 2);
  const offsetY = world.y + Math.floor((world.h - gridH) / 2);
  return { cell, offsetX, offsetY };
}
