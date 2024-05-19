import { keyframes } from '@emotion/react'

export const BounceIn = keyframes`
  0% {
    transform: scale3d(0.3, 0.3, 0.3);
  }

  33% {
    transform: scale3d(1.1, 1.1, 1.1);
  }

  66% {
    transform: scale3d(0.9, 0.9, 0.9);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
`

export const FadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export const SlideInRight = keyframes`
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`

export const Flip = keyframes`
	0% {
		transform: perspective(400px) rotateY(0);
		animation-timing-function: ease-out;
	}
	40% {
		transform: perspective(400px) translateZ(150px) rotateY(170deg);
		animation-timing-function: ease-out;
	}
	50% {
		transform: perspective(400px) translateZ(150px) rotateY(190deg) scale(1);
		animation-timing-function: ease-in;
	}
	80% {
		transform: perspective(400px) rotateY(360deg) scale(.95);
		animation-timing-function: ease-in;
	}
	100% {
		transform: perspective(400px) scale(1);
		animation-timing-function: ease-in;
	}
`
