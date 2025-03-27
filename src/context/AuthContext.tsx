import { createContext } from "react";
import { IAuthContext } from "../models/index";

export const AuthContext = createContext<IAuthContext | null>(null);
