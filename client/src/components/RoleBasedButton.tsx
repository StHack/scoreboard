import { UserRole } from '@sthack/scoreboard-common'
import { useAuth } from 'hooks/useAuthentication'
import { Button, ButtonProps } from './Button'

type RoleBasedButtonProps = {
  roleRequired: UserRole
}

export function RoleBasedButton({
  roleRequired,
  title,
  disabled,
  ...props
}: RoleBasedButtonProps & ButtonProps) {
  const { roles } = useAuth()

  const isAllowed = roles.includes(roleRequired)
  return (
    <Button
      disabled={disabled || !isAllowed}
      title={
        isAllowed ? title : `${title ?? ''} (⚠️ Requires ${roleRequired} role)`
      }
      {...props}
    />
  )
}
