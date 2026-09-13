/**
 * Responsive layout for the simulation display.
 *
 * One function, {@link computeLayout}, produces every rectangle the UI needs
 * for a given window size. The scene builds its buttons once and then only
 * repositions and resizes them from this output, so the wide and narrow
 * arrangements share a single description (design D8).
 *
 * A wide window places statistics on the left, the world in the center,
 * controls on the right, and the history chart across the bottom
 * (`simulation-ui/world-rendering` §5.1). A narrow window, such as an iPad
 * mini's `744 x 1133` CSS pixels, reflows into stacked regions - a stats strip
 * on top, then the world, then the controls, then the chart - while preserving
 * the world's aspect ratio and keeping every control usable
 * (`simulation-ui/world-rendering` §5.2, §5.3, §5.4).
 */

import { GRID_WIDTH, GRID_HEIGHT, LAYOUT, SPEED_OPTIONS } from '../config.js';

/**
 * @typedef {Object} Rect
 * @property {number} x - Left edge.
 * @property {number} y - Top edge.
 * @property {number} width - Width in pixels.
 * @property {number} height - Height in pixels.
 */

/**
 * Result of laying out the display.
 *
 * @typedef {Object} Layout
 * @property {boolean} narrow - True when the stacked arrangement is in use.
 * @property {Rect} stats - Statistics region.
 * @property {Rect} world - World region; the grid is centered inside it.
 * @property {Rect} controls - Controls region.
 * @property {Rect} chart - History chart region.
 * @property {number} cellSize - Drawn size of one grid cell, in pixels.
 * @property {Rect} gridRect - Actual drawn bounds of the grid inside `world`.
 * @property {Rect[]} speedRects - One rectangle per speed button, left to right.
 * @property {{play: Rect, step: Rect, reset: Rect}} actionRects - Action buttons.
 */

/**
 * Build a rectangle from an origin and a size.
 *
 * @param {number} x - Left edge.
 * @param {number} y - Top edge.
 * @param {number} width - Width in pixels.
 * @param {number} height - Height in pixels.
 * @returns {Rect} The rectangle.
 */
function rect(x, y, width, height) {
    return { x, y, width, height };
}

/**
 * Compute the drawn bounds of the grid inside an available area.
 *
 * The cell size is the largest whole-pixel size that fits, which keeps the
 * grid crisp and preserves its aspect ratio in both arrangements
 * (`simulation-ui/world-rendering` §5.3). The grid is centered in the area so
 * a grid-dimension change scales and centers without UI edits
 * (`world-model` §1.4).
 *
 * @param {Rect} area - Available area for the world.
 * @returns {{cellSize: number, gridRect: Rect}} Cell size and fitted bounds.
 */
function fitGrid(area) {
    const cellSize = Math.max(
        1,
        Math.floor(Math.min(area.width / GRID_WIDTH, area.height / GRID_HEIGHT))
    );
    const width = cellSize * GRID_WIDTH;
    const height = cellSize * GRID_HEIGHT;
    return {
        cellSize,
        gridRect: rect(
            area.x + Math.floor((area.width - width) / 2),
            area.y + Math.floor((area.height - height) / 2),
            width,
            height
        )
    };
}

/**
 * Lay out the speed row as one horizontal row of equal buttons.
 *
 * A single row is required in every arrangement
 * (`simulation-ui/playback-controls` §1.1).
 *
 * @param {Rect} controls - Controls region.
 * @param {number} y - Top edge of the speed row.
 * @param {number} count - Number of speed buttons.
 * @param {number} height - Button height.
 * @returns {Rect[]} One rectangle per button, left to right.
 */
function layoutSpeedRow(controls, y, count, height) {
    const gap = LAYOUT.speedButtonGap;
    const total = controls.width;
    const buttonWidth = Math.floor((total - gap * (count - 1)) / count);
    const rects = [];
    for (let i = 0; i < count; i += 1) {
        rects.push(rect(controls.x + i * (buttonWidth + gap), y, buttonWidth, height));
    }
    return rects;
}

/**
 * Lay out the three action buttons, each on its own row
 * (`simulation-ui/playback-controls` §2.1).
 *
 * @param {Rect} controls - Controls region.
 * @param {number} y - Top edge of the first action button.
 * @returns {{play: Rect, step: Rect, reset: Rect}} Action button rectangles.
 */
function layoutActionButtons(controls, y) {
    const height = LAYOUT.actionButtonHeight;
    const step = height + LAYOUT.actionButtonGap;
    return {
        play: rect(controls.x, y, controls.width, height),
        step: rect(controls.x, y + step, controls.width, height),
        reset: rect(controls.x, y + step * 2, controls.width, height)
    };
}

/**
 * Compute the display layout for a window size.
 *
 * @param {number} width - Window width in CSS pixels.
 * @param {number} height - Window height in CSS pixels.
 * @returns {Layout} Rectangles and scale for every region.
 */
export function computeLayout(width, height) {
    const narrow = width < LAYOUT.narrowBreakpoint;
    const m = LAYOUT.margin;
    const gap = LAYOUT.gap;
    const speedHeight = 34;

    if (!narrow) {
        // Stats | world | controls, with the chart across the bottom.
        const stats = rect(m, m, LAYOUT.statsWidth, height - m * 2 - LAYOUT.chartHeight - gap);
        const controls = rect(
            width - m - LAYOUT.controlsWidth,
            m,
            LAYOUT.controlsWidth,
            height - m * 2 - LAYOUT.chartHeight - gap
        );
        const world = rect(
            stats.x + stats.width + gap,
            m,
            controls.x - (stats.x + stats.width + gap) - gap,
            stats.height
        );
        const chart = rect(m, height - m - LAYOUT.chartHeight, width - m * 2, LAYOUT.chartHeight);

        const speedRects = layoutSpeedRow(controls, controls.y, SPEED_OPTIONS.length, speedHeight);
        const actionRects = layoutActionButtons(
            controls,
            controls.y + speedHeight + LAYOUT.actionButtonGap * 3
        );
        const fitted = fitGrid(world);
        return {
            narrow,
            stats,
            world,
            controls,
            chart,
            cellSize: fitted.cellSize,
            gridRect: fitted.gridRect,
            speedRects,
            actionRects
        };
    }

    // Narrow: stacked - stats strip, world, controls block, chart.
    const stats = rect(m, m, width - m * 2, LAYOUT.narrowStatsHeight);
    const chart = rect(m, height - m - LAYOUT.chartHeight, width - m * 2, LAYOUT.chartHeight);
    const controls = rect(
        m,
        chart.y - gap - LAYOUT.narrowControlsHeight,
        width - m * 2,
        LAYOUT.narrowControlsHeight
    );
    const world = rect(m, stats.y + stats.height + gap, width - m * 2, controls.y - gap - (stats.y + stats.height + gap));

    const speedRects = layoutSpeedRow(controls, controls.y, SPEED_OPTIONS.length, speedHeight);
    const actionRects = layoutActionButtons(
        controls,
        controls.y + speedHeight + LAYOUT.actionButtonGap * 3
    );
    const fitted = fitGrid(world);
    return {
        narrow,
        stats,
        world,
        controls,
        chart,
        cellSize: fitted.cellSize,
        gridRect: fitted.gridRect,
        speedRects,
        actionRects
    };
}
