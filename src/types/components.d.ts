declare module 'react-katex' {
  export interface BlockMathProps {
    math: string;
    inline?: boolean;
  }
  export const BlockMath: React.FC<BlockMathProps>;
  export const InlineMath: React.FC<BlockMathProps>;
}

declare module 'mafs' {
  export interface PointProps {
    x: number;
    y: number;
    color: string | { r: number; g: number; b: number; alpha?: number };
    size?: number;
  }
  export const Point: React.FC<PointProps>;
  export const Mafs: React.FC<any>;
  export const Coordinates: {
    Cartesian: React.FC<any>;
  };
  export const Plot: {
    OfX: React.FC<any>;
    Parametric: React.FC<any>;
  };
  export const Theme: {
    blue: { r: number; g: number; b: number };
    red: { r: number; g: number; b: number };
  };
  export const Text: React.FC<any>;
  export const Transform: React.FC<any>;
  export const Vector: React.FC<any>;
  export const Line: React.FC<any> & {
    Segment: React.FC<any>;
  };
}

declare module 'mathjs' {
  export type MathExpression = string | ((x: number) => number);
  export type EvalFunction = {
    (x: number): number;
    evaluate: (scope: { [key: string]: number }) => number;
  };
  
  export function parse(expr: MathExpression): EvalFunction;
  export function parse(exprs: MathExpression[]): EvalFunction[];
  export function compile(expr: MathExpression): EvalFunction;
}

declare namespace $3Dmol {
  interface GLViewer {
    clear(): void;
    addModel(data: string, format: string): Molecule;
    setStyle(selector: any, style: any): void;
    zoomTo(): void;
    render(): void;
  }

  interface Molecule {
    getFormula(): string;
    getAtomCount(): number;
    getBondCount(): number;
  }

  interface ViewerOptions {
    backgroundColor?: string;
    antialias?: boolean;
    defaultcolors?: any;
  }

  function createViewer(element: HTMLElement, options?: ViewerOptions): GLViewer;
  const rasmolElementColors: any;
} 