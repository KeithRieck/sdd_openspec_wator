/**
 * Phaser-native UI controls for Wa-Tor.
 */
export default class UIControls {
  /**
   * @param {Phaser.Scene} scene
   * @param {function(number):void} onSpeedChange
   * @param {function():void} onPlayPause
   * @param {function():void} onStep
   * @param {function():void} onReset
   */
  constructor(scene, onSpeedChange, onPlayPause, onStep, onReset) {
    this.scene = scene;
    this.onSpeedChange = onSpeedChange;
    this.onPlayPause = onPlayPause;
    this.onStep = onStep;
    this.onReset = onReset;
    this.buttons = {
      play: null,
      step: null,
      reset: null
    };
    this.speedButtons = [];
    this.statusText = null;
    this._createButtons();
  }

  _createButtons() {
    const style = { fontSize: '18px', color: '#ffffff' };
    this.buttons.play = this.scene.add.text(0, 0, 'Play/Pause', style).setInteractive({ useHandCursor: true });
    this.buttons.play.on('pointerdown', this.onPlayPause.bind(this));

    this.buttons.step = this.scene.add.text(0, 0, 'Step', style).setInteractive({ useHandCursor: true });
    this.buttons.step.on('pointerdown', this.onStep.bind(this));

    this.buttons.reset = this.scene.add.text(0, 0, 'Reset', style).setInteractive({ useHandCursor: true });
    this.buttons.reset.on('pointerdown', this.onReset.bind(this));

    const speedValues = [1, 5, 10, 30, 60];
    speedValues.forEach(speed => {
      const btn = this.scene.add.text(0, 0, `${speed}x`, style).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => this.onSpeedChange(speed));
      this.speedButtons.push({ speed, btn });
    });
  }

  setStatus(status) {
    if (!this.statusText) {
      this.statusText = this.scene.add.text(0, 0, status, { fontSize: '18px', color: '#ffffff' });
    } else {
      this.statusText.setText(status);
    }
  }

  setPlayEnabled(enabled) {
    if (enabled) {
      this.buttons.play.setAlpha(1);
      this.buttons.play.setInteractive({ useHandCursor: true });
    } else {
      this.buttons.play.setAlpha(0.5);
      this.buttons.play.disableInteractive();
    }
  }

  setStepEnabled(enabled) {
    if (enabled) {
      this.buttons.step.setAlpha(1);
      this.buttons.step.setInteractive({ useHandCursor: true });
    } else {
      this.buttons.step.setAlpha(0.5);
      this.buttons.step.disableInteractive();
    }
  }

  setSelectedSpeed(selectedSpeed) {
    this.speedButtons.forEach(({ speed, btn }) => {
      btn.setColor(speed === selectedSpeed ? '#ffff00' : '#ffffff');
    });
  }

  layout(left, top, width, height) {
    const padding = 10;
    let y = top + padding;
    this.statusText?.setPosition(left + padding, y);
    y += 32;
    this.buttons.play.setPosition(left + padding, y);
    y += 40;
    this.buttons.step.setPosition(left + padding, y);
    y += 40;
    this.buttons.reset.setPosition(left + padding, y);
    y += 50;
    let x = left + padding;
    this.speedButtons.forEach(({ btn }) => {
      btn.setPosition(x, y);
      x += btn.width + 10;
    });
  }
}
