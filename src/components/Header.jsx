import { useContext } from "react";
import { ContextProviderDeclare } from "../store/ContextProvider";
import LoggedHeader from "./LoggedHeader";
import UnLoggedHeader from "./UnLoggedHeader";

const Header=()=>{
  const {token} = useContext(ContextProviderDeclare);
  return (
    <>
      {token ? <LoggedHeader/> : <UnLoggedHeader/>}
    </>
  )
}

export default Header;