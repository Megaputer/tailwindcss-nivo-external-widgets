declare module '*.css' {
  interface IClassNames {
    [className: string]: string;
    use: any;
  }
  const classNames: IClassNames;
  export = classNames;
}
