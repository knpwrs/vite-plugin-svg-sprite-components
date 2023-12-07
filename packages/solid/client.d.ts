declare module '*.svg?sprite-solid' {
  export default function Comp(
    props: import('solid-js').JSX.IntrinsicElements['svg'],
  ): JSX.Element;
}
