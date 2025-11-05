declare module 'webfontloader' {
  interface WebFontConfig {
    google?: {
      families: string[];
    };
    timeout?: number;
    fontactive?: (familyName: string, fvd: string) => void;
    active?: () => void;
  }

  interface WebFont {
    load(config: WebFontConfig): void;
  }

  const WebFont: WebFont;
  export default WebFont;
}

