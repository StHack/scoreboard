declare module '*.svg' {
  const src: string
  export default src
}

declare module '*.svg?react' {
  import * as React from 'react'
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.png' {
  const src: string
  export default src
}
