declare module '*.svg?sprite-preact' {
  declare const Comp: import('preact').FunctionalComponent<
    import('preact/compat').PropsWithoutRef<HTMLProps<SVGSVGElement>> & {
      ref?: import('preact').Ref<SVGSVGElement>;
    }
  >;
  export default Comp;
}
