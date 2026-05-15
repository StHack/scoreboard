import { keyframes, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { size, space } from 'styled-system'
import { Box } from '../../../../Box'
import { categoryToImg } from '../../../../CategoryImg'
import { IconBreakthrough } from '../../../../Icon'
import { ChallengeCardProps } from '../../../types'

export function ChallengeCard2026({
  challenge,
  currentTeam,
  size = 10,
  score: { achievements },
  onClick,
  ...props
}: ChallengeCardProps) {
  const { name, img, category, isBroken } = challenge
  const isSolved = achievements.some(a => a.teamId === currentTeam?._id)
  const openState: ChallState = isBroken
    ? 'broken'
    : isSolved
      ? 'solved'
      : 'open'

  const theme = useTheme()

  return (
    <CardWrapper
      m="2"
      size={size}
      {...props}
      onClick={onClick}
      type="button"
      className={openState}
      title={
        isBroken
          ? 'This challenge is currently broken'
          : isSolved
            ? `✔ Open challenge "${name}"`
            : `Open challenge "${name}"`
      }
    >
      <Svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path
            id="chall-name-line"
            d="M64.814 744.818h620.372m-620.372 90h620.372M64.814 924.822h620.372"
            fill="none"
            stroke="none"
          />
        </defs>

        <g className="claw horizontal">
          <rect className="vertical" x="212" y="160" width="25" height="80" />
          <BoxPath
            d="M158.336 108.628h136.27a7.152 7.152 0 017.167 7.168v43.886a7.152 7.152 0 01-7.167 7.168h-136.27a7.152 7.152 0 01-7.168-7.168v-43.886a7.152 7.152 0 017.168-7.168z"
            fill="#006df0"
          />
          <g className="clamp">
            <BoxPath
              d="M266.287 285.911a43.083 43.083 0 01-43.083 43.083 43.083 43.083 0 01-43.083-43.083 43.083 43.083 0 0143.083-43.082 43.083 43.083 0 0143.083 43.082z"
              fill="#ffda44"
            />
            <BoxPath
              className="left"
              d="M 176.85687,420.38247 C 165.75975,397.97064 154.66263,375.5588 143.56551,353.14697 158.059,339.30624 172.5525,325.46553 187.04599,311.6248"
              fill="none"
              strokeLinecap="round"
            />

            <foreignObject
              className="prize"
              x="10"
              y="580"
              width="500"
              height="400"
            >
              <Img src={img || categoryToImg(category)} alt={name} />
            </foreignObject>

            <BoxPath
              className="right"
              d="m 273.12807,420.41982 c 11.09712,-22.41183 22.19424,-44.82367 33.29136,-67.2355 -14.49349,-13.84073 -28.98699,-27.68144 -43.48048,-41.52217"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>

        <BoxPath
          d="M34.17 11.799a22.324 22.324 0 00-22.371 22.374v931.654a22.324 22.324 0 0022.37 22.374H965.83a22.324 22.324 0 0022.371-22.374V34.173a22.324 22.324 0 00-22.37-22.374zm32.433 96.275h862.443c3.19 0 5.759 2.57 5.759 5.76v511.648a5.747 5.747 0 01-5.76 5.76H66.604c-3.19 0-5.759-2.569-5.759-5.76V113.834a5.747 5.747 0 015.76-5.76z"
          fill="#bd408b"
        />

        <BoxPath
          className="top"
          d="M257.438 11.651H745.3a6.247 6.247 0 016.261 6.262v42.502a6.247 6.247 0 01-6.26 6.261H257.437a6.247 6.247 0 01-6.261-6.261V17.913a6.247 6.247 0 016.261-6.262z"
          fill={
            {
              solved: theme.colors.gold,
              broken: theme.colors.red,
              open: '#006df0',
            }[openState]
          }
        />

        <BoxPath
          className="bottom-exit"
          d="M776.27 701.634h114.502a22.568 22.568 0 0122.617 22.617V829.39a22.568 22.568 0 01-22.617 22.617H776.269a22.568 22.568 0 01-22.617-22.617V724.25a22.568 22.568 0 0122.617-22.617z"
          fill={
            {
              solved: theme.colors.gold,
              broken: theme.colors.red,
              open: '#006df0',
            }[openState]
          }
        />

        <BoxPath
          className="window"
          d="M66.66 107.154h862.554c3.19 0 5.76 2.57 5.76 5.76V624.54a5.747 5.747 0 01-5.76 5.76H66.66a5.747 5.747 0 01-5.76-5.76V112.914a5.747 5.747 0 015.76-5.76z"
          fill={
            {
              solved: theme.colors.gold,
              broken: theme.colors.black,
              open: '#00ffff4b',
            }[openState]
          }
        />

        {openState === 'solved' && (
          <foreignObject
            className="solved-icon"
            x="100"
            y="150"
            width="800"
            height="450"
          >
            <IconBreakthrough size="100%" />
          </foreignObject>
        )}

        <g className="controller">
          <BoxPath
            d="M697.022 575.278h190.062c7.49 0 13.52 6.03 13.52 13.52v28.484c0 7.49-6.03 13.52-13.52 13.52H697.022a13.49 13.49 0 01-13.52-13.52v-28.484c0-7.49 6.03-13.52 13.52-13.52z"
            fill="#006df0"
          />
          <BoxPath
            d="M825.997 523.54h41.93a7.45 7.45 0 017.466 7.467v36.648a7.45 7.45 0 01-7.467 7.466h-41.93a7.45 7.45 0 01-7.466-7.466v-36.648a7.45 7.45 0 017.467-7.466z"
            fill="#e0e0e2"
          />
          <BoxPath
            d="M741.021 538.534v36.957"
            fill="none"
            strokeWidth="23.412"
          />
          <BoxPath
            d="M777.365 497.41a34.385 34.385 0 01-34.386 34.385 34.385 34.385 0 01-34.385-34.385 34.385 34.385 0 0134.385-34.386 34.385 34.385 0 0134.386 34.386z"
            fill="#d80027"
          />
        </g>

        <text
          // id="chall-name"
          fill={theme.colors.primaryText}
          fontSize="80"
        >
          <textPath xlinkHref="#chall-name-line">{name}</textPath>
        </text>
      </Svg>
    </CardWrapper>
  )
}

type ChallState = 'broken' | 'open' | 'solved'

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  display: block;
`

const Svg = styled.svg`
  width: 100%;
  height: 100%;
  max-width: ${p => p.theme.sizes[9]};
  max-height: ${p => p.theme.sizes[9]};
  overflow: visible;
`
const BoxPath = styled.path`
  stroke: #000;
  stroke-width: 20;
  stroke-dasharray: none;
  stroke-opacity: ${p => p.strokeOpacity ?? 1};
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
`

const ClawMove = keyframes`
  0%, 70% {
    transform: translateX(0);
  }
  85% {
    transform: translateX(500px);
  }
  100% {
    transform: translateX(500px);
  }
`

const ClawDescent = keyframes`
  0% {
    height: 80px;
  }
  25%, 45% {
    height: 300px;
  }
  70%, 100% {
    height: 80px;
  }
`

const ClampDescent = keyframes`
  0% {
    transform: translateY(0);
  }
  25%, 45% {
    transform: translateY(200px);
  }
  70%, 100% {
    transform: translateY(0);
  }
`

const ClampCatchLeft = keyframes`
  0%, 25% {
    transform: rotateZ(0deg);
  }
  45%, 85% {
    transform: rotateZ(-25deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
`

const ClampCatchRight = keyframes`
  0%, 25% {
    transform: rotateZ(0deg);
  }
  45%, 85% {
    transform: rotateZ(25deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
`

const PrizeFall = keyframes`
  0% {
    transform: translateY(0);
  }
  25%, 45% {
    transform: translateY(-200px);
  }
  70%, 85% {
    transform: translateY(-220px)
  }
  100% {
    transform: translateY(0) rotate(20deg);
    transform-origin: center;
  }
`
const WiggleHighlight = keyframes`
  0%, 17.5%, 100% {
    transform: rotateZ(0);
  }
  37.5% {
    transform: translateY(-20px) rotateZ(-15deg);
  }
  50% {
    transform: translateY(-20px) rotateZ(10deg);
  }
  62.5% {
    transform: translateY(-20px) rotateZ(-10deg);
  }
  75% {
    transform: translateY(-20px) rotateZ(6deg);
  }
  87.5% {
    transform: translateY(-20px) rotateZ(-4deg);
  }
`

const CardWrapper = styled(Box)`
  ${space}
  ${size}
  cursor: pointer;
  filter: drop-shadow(-1px 6px 3px rgba(50, 50, 0, 0.5));
  display: flex;
  flex-direction: column;

  &:hover > svg {
    .claw {
      animation: ${ClawMove} 3s ease-in-out both;

      .vertical {
        transform-origin: bottom;
        animation: ${ClawDescent} 3s ease-in-out both;
      }

      .clamp {
        animation: ${ClampDescent} 3s ease-in-out both;

        .left {
          transform-origin: 160px 310px;
          animation: ${ClampCatchLeft} 3s ease-in-out both;
        }

        .right {
          transform-origin: 290px 310px;
          animation: ${ClampCatchRight} 3s ease-in-out both;
        }

        .prize {
          animation: ${PrizeFall} 3s ease-in-out both;
        }
      }
    }
  }

  &:hover .solved-icon {
    transform-origin: center;
    animation: ${WiggleHighlight} 0.82s ease-in-out both;
  }
`
