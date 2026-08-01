import { CONFIG } from '../config.js';

/** Phaser-native speed and action control panel. */
export class ControlsPanel {
  /** Create interactive controls and wire callbacks. */
  constructor(scene, callbacks) {
    this.scene = scene;
    this.callbacks = callbacks;
    this.container = scene.add.container(0, 0);
    this.buttons = [];
    this.speedButtons = [];
    this.background = scene.add.graphics();
    this.container.add(this.background);
    this.createButtons();
  }

  /** Render controls for the current playback state. */
  render(bounds, state) {
    this.container.setPosition(bounds.x, bounds.y);
    this.background.clear();
    this.background.fillStyle(CONFIG.colors.panel, 0.94);
    this.background.fillRoundedRect(0, 0, bounds.width, bounds.height, 12);
    this.background.lineStyle(1, CONFIG.colors.panelBorder, 1);
    this.background.strokeRoundedRect(0, 0, bounds.width, bounds.height, 12);

    const pad = 12;
    const speedWidth = Math.max(28, (bounds.width - pad * 2 - 4 * 5) / 5);
    this.speedButtons.forEach((button, index) => {
      button.setSize(speedWidth, 28);
      button.setPosition(pad + index * (speedWidth + 4), 16);
      button.setSelected(state.speed === CONFIG.speedOptions[index]);
    });
    const actionY = 58;
    const actionHeight = 30;
    this.buttons.forEach((button, index) => {
      button.setSize(bounds.width - pad * 2, actionHeight);
      button.setPosition(pad, actionY + index * (actionHeight + 8));
    });
    this.buttons[0].setLabel(state.running ? 'Pause' : 'Play');
    this.buttons[0].setDisabled(state.terminal);
    this.buttons[1].setDisabled(state.running || state.terminal);
    this.buttons[2].setDisabled(false);
  }

  createButtons() {
    CONFIG.speedOptions.forEach((speed) => {
      const button = new PanelButton(this.scene, `${speed}x`, () => this.callbacks.onSpeed(speed));
      this.speedButtons.push(button);
      this.container.add(button.container);
    });
    [['Play', () => this.callbacks.onPlayPause()], ['Step', () => this.callbacks.onStep()], ['Reset', () => this.callbacks.onReset()]].forEach(([label, callback]) => {
      const button = new PanelButton(this.scene, label, callback);
      this.buttons.push(button);
      this.container.add(button.container);
    });
  }
}

class PanelButton {
  constructor(scene, label, callback) {
    this.scene = scene;
    this.label = label;
    this.callback = callback;
    this.container = scene.add.container(0, 0);
    this.background = scene.add.graphics();
    this.text = scene.add.text(0, 0, label, { fontFamily: 'system-ui, sans-serif', fontSize: '13px', color: '#e6f4ff' }).setOrigin(0.5);
    this.container.add([this.background, this.text]);
    this.container.setSize(80, 30).setInteractive({ useHandCursor: true });
    this.container.on('pointerdown', () => { if (!this.disabled) this.callback(); });
    this.container.on('pointerover', () => { if (!this.disabled) this.hover = true; this.draw(); });
    this.container.on('pointerout', () => { this.hover = false; this.draw(); });
    this.width = 80;
    this.height = 30;
    this.disabled = false;
    this.selected = false;
    this.hover = false;
    this.draw();
  }

  setPosition(x, y) { this.container.setPosition(x + this.width / 2, y + this.height / 2); }
  setSize(width, height) { this.width = width; this.height = height; this.container.setSize(width, height); this.draw(); }
  setLabel(label) { this.label = label; this.text.setText(label); }
  setDisabled(disabled) { this.disabled = disabled; this.draw(); }
  setSelected(selected) { this.selected = selected; this.draw(); }

  draw() {
    this.background.clear();
    const color = this.disabled ? CONFIG.colors.disabled : (this.selected ? CONFIG.colors.selected : (this.hover ? CONFIG.colors.panelBorder : 0x123650));
    this.background.fillStyle(color, 1);
    this.background.fillRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, 7);
    this.background.lineStyle(1, CONFIG.colors.panelBorder, 1);
    this.background.strokeRoundedRect(-this.width / 2, -this.height / 2, this.width, this.height, 7);
    this.text.setAlpha(this.disabled ? 0.45 : 1);
  }
}
