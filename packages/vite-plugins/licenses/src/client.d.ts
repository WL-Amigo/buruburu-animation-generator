declare module "virtual:licenses" {
  interface License {
    readonly name: string;
    readonly license: string;
    readonly url: string;
  }
  const Licenses: readonly License[];
  export default Licenses;
}
