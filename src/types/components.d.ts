declare module 'react-katex' {
  export interface BlockMathProps {
    math: string;
    inline?: boolean;
  }
  export const BlockMath: React.FC<BlockMathProps>;
}

declare module 'mafs' {
  export interface PointProps {
    x: number;
    y: number;
    color: string;
    size?: number;
  }
  export const Point: React.FC<PointProps>;
}

declare module 'mathjs' {
  export type MathExpression = string | ((x: number) => number);
  export type EvalFunction = (x: number) => number;
  
  export function parse(expr: MathExpression): EvalFunction;
  export function parse(exprs: MathExpression[]): EvalFunction[];
} 