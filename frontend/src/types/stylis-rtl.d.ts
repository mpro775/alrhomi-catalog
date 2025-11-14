declare module 'stylis-rtl' {
  interface StylisPlugin {
    (element: any, index: number, children: any[], callback: Function): any;
  }

  const rtl: StylisPlugin;
  export default rtl;
}
