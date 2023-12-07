declare module '*.svg?sprite-react' {
  declare const Comp: import('react').ForwardRefExoticComponent<
    Omit<import('react').HTMLProps<SVGSVGElement>, 'ref'> &
      import('react').RefAttributes<SVGSVGElement>
  >;
  export default Comp;
}
