export interface Package {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface License {
  readonly name: string;
  readonly license: string;
  readonly url: string;
}
