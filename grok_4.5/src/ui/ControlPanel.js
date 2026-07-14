import { COLORS, LAYOUT, SPEEDS } from '../config.js';

/**
 * Right-side controls: speed row and Play/Pause, Step, Reset.
 * Spec: simulation-ui R4–R7.
 */
export class ControlPanel {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.background = scene.add.graphics();
    this.container.add(this.background);

    this.running = true;
    this.terminal = false;
    this.speed = 10;

    /** @type {null|(() => void)} */
    this.playPauseHandler = null;
    /** @type {null|(() => void)} */
    this.stepHandler = null;
    /** @type {null|(() => void)} */
    this.resetHandler = null;
    /** @type {null|((speed:number) => void)} */
    this.speedHandler = null;

    this.speedButtons = [];
    this.actionButtons = {};

    this.#build();
    this.bounds = { x: 0, y: 0, width: 180, height: 300 };
  }

  #build() {
    const title = this.scene.add.text(0, 0, 'Controls', {
      fontFamily: LAYOUT.fontFamily,
      fontSize: `${LAYOUT.titleFontSize}px`,
      color: '#e8f1ff',
      fontStyle: 'bold'
    });
    this.container.add(title);
    this.title = title;

    for (const speed of SPEEDS) {
      const button = this.#createButton(`${speed}x`, () => {
        if (this.speedHandler) {
          this.speedHandler(speed);
        }
      });
      button.speedValue = speed;
      this.speedButtons.push(button);
      this.container.add(button.container);
    }

    this.actionButtons.playPause = this.#createButton('Pause', () => {
      if (this.playPauseHandler) {
        this.playPauseHandler();
      }
    });
    this.actionButtons.step = this.#createButton('Step', () => {
      if (this.stepHandler) {
        this.stepHandler();
      }
    });
    this.actionButtons.reset = this.#createButton('Reset', () => {
      if (this.resetHandler) {
        this.resetHandler();
      }
    });

    this.container.add(this.actionButtons.playPause.container);
    this.container.add(this.actionButtons.step.container);
    this.container.add(this.actionButtons.reset.container);
  }

  /**
   * @param {string} label
   * @param {() => void} onClick
   */
  #createButton(label, onClick) {
    const g = this.scene.add.graphics();
    const text = this.scene.add.text(0, 0, label, {
      fontFamily: LAYOUT.fontFamily,
      fontSize: `${LAYOUT.bodyFontSize}px`,
      color: '#e8f1ff'
    }).setOrigin(0.5);
    const hit = this.scene.add.zone(0, 0, 10, 10).setOrigin(0).setInteractive({ useHandCursor: true });
    const container = this.scene.add.container(0, 0, [g, text, hit]);

    const button = {
      container,
      graphics: g,
      text,
      hit,
      label,
      enabled: true,
      active: false,
      width: 80,
      height: LAYOUT.buttonHeight,
      speedValue: null
    };

    hit.on('pointerover', () => {
      if (button.enabled) {
        this.#drawButton(button, true);
      }
    });
    hit.on('pointerout', () => {
      this.#drawButton(button, false);
    });
    hit.on('pointerup', () => {
      if (button.enabled) {
        onClick();
      }
    });

    return button;
  }

  /**
   * @param {object} button
   * @param {boolean} hover
   */
  #drawButton(button, hover) {
    const { graphics, width, height, enabled, active } = button;
    graphics.clear();
    let fill = COLORS.button;
    if (!enabled) {
      fill = COLORS.buttonDisabled;
    } else if (active) {
      fill = COLORS.buttonActive;
    } else if (hover) {
      fill = COLORS.buttonHover;
    }
    graphics.fillStyle(fill, 1);
    graphics.lineStyle(1, COLORS.panelBorder, 1);
    graphics.fillRoundedRect(0, 0, width, height, 6);
    graphics.strokeRoundedRect(0, 0, width, height, 6);
    button.text.setAlpha(enabled ? 1 : 0.45);
  }

  /**
   * @param {object} button
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  #layoutButton(button, x, y, width, height) {
    button.width = width;
    button.height = height;
    button.container.setPosition(x, y);
    button.text.setPosition(width / 2, height / 2);
    button.hit.setPosition(0, 0);
    button.hit.setSize(width, height);
    this.#drawButton(button, false);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  setBounds(x, y, width, height) {
    this.bounds = { x, y, width, height };
    this.container.setPosition(x, y);

    this.background.clear();
    this.background.fillStyle(COLORS.panel, 1);
    this.background.lineStyle(1, COLORS.panelBorder, 1);
    this.background.fillRoundedRect(0, 0, width, height, 8);
    this.background.strokeRoundedRect(0, 0, width, height, 8);

    const pad = 12;
    this.title.setPosition(pad, pad);

    const innerW = width - pad * 2;
    const gap = 6;
    const speedW = (innerW - gap * (this.speedButtons.length - 1)) / this.speedButtons.length;
    const speedY = pad + 30;
    this.speedButtons.forEach((button, index) => {
      const bx = pad + index * (speedW + gap);
      this.#layoutButton(button, bx, speedY, speedW, LAYOUT.buttonHeight);
    });

    let actionY = speedY + LAYOUT.buttonHeight + 16;
    const actions = [
      this.actionButtons.playPause,
      this.actionButtons.step,
      this.actionButtons.reset
    ];
    for (const button of actions) {
      this.#layoutButton(button, pad, actionY, innerW, LAYOUT.buttonHeight);
      actionY += LAYOUT.buttonHeight + LAYOUT.buttonGap;
    }

    this.#syncLabels();
  }

  /**
   * @param {boolean} running
   */
  setRunning(running) {
    this.running = running;
    this.#syncLabels();
  }

  /**
   * @param {boolean} terminal
   */
  setTerminal(terminal) {
    this.terminal = terminal;
    this.#syncLabels();
  }

  /**
   * @param {number} speed
   */
  setSpeed(speed) {
    this.speed = speed;
    this.#syncLabels();
  }

  /**
   * @param {() => void} cb
   */
  onPlayPause(cb) {
    this.playPauseHandler = cb;
  }

  /**
   * @param {() => void} cb
   */
  onStep(cb) {
    this.stepHandler = cb;
  }

  /**
   * @param {() => void} cb
   */
  onReset(cb) {
    this.resetHandler = cb;
  }

  /**
   * @param {(speed:number) => void} cb
   */
  onSpeed(cb) {
    this.speedHandler = cb;
  }

  #syncLabels() {
    const play = this.actionButtons.playPause;
    play.text.setText(this.running ? 'Pause' : 'Play');
    play.enabled = !this.terminal;
    this.#drawButton(play, false);

    const step = this.actionButtons.step;
    step.enabled = !this.running && !this.terminal;
    this.#drawButton(step, false);

    this.actionButtons.reset.enabled = true;
    this.#drawButton(this.actionButtons.reset, false);

    for (const button of this.speedButtons) {
      button.active = button.speedValue === this.speed;
      button.enabled = true;
      this.#drawButton(button, false);
    }
  }

  /** Release display objects. */
  destroy() {
    this.container.destroy(true);
  }
}
