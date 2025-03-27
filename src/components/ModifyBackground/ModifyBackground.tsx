import { FC, PropsWithChildren } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./ModifyBackground.scss";

export const ModifyBackground: FC<PropsWithChildren> = ({ children }) => {
  const { isTransferred } = useAuth();
  
  const bgClass = isTransferred ? "bgImgLogin" : "bgImgMain";

  return <div className={`containerBg ${bgClass}`}>{children}</div>;
};