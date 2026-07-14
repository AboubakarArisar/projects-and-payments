import { useEffect } from "react";
import { BRAND } from "../constant/brand";

// Sets the browser tab title per page, e.g. "Steward — Dashboard".
// Pass no title for the default landing title.
export const useTitle = (title) => {
  useEffect(() => {
    document.title = title
      ? `${BRAND.name} — ${title}`
      : `${BRAND.name} — Projects & Payments`;
  }, [title]);
};

export default useTitle;
