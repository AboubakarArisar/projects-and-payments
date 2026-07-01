import React from "react";
 import { useCookies } from "react-cookie";

export default function CookieUsingComponent() {
   const [cookies, setCookie] = useCookies();
   setCookie("user", token, { expires: expirationDate });
   cookies.user

  return (
    <React.Fragment>
      CookieUsingComponent
      {}
    </React.Fragment>
  );
}
