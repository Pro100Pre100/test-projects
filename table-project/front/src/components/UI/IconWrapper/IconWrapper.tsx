import type { IconWrapperProps } from "../../../interface/main";
import './IconWrapper.css'

export default function IconWrapper({ children, ...props }: IconWrapperProps) {

  return (
    <>
      <div className="iconWrapper" {...props}>
        {children}
      </div>
    </>
  )
}

