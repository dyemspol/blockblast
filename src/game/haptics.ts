class HapticsEngine {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public vibrate(pattern: number | number[]) {
    if (!this.enabled || typeof window === 'undefined' || !navigator.vibrate) {
      return;
    }
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration errors
    }
  }

  public pickup() {
    this.vibrate(10);
  }

  public place() {
    this.vibrate(22);
  }

  public clear() {
    this.vibrate([25, 30, 40]);
  }

  public gameOver() {
    this.vibrate([40, 50, 70]);
  }
}

export const haptics = new HapticsEngine();
