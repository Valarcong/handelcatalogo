
import { useLocation } from "react-router-dom";

export function useVentasNavigation() {
  const location = useLocation();

  function getCurrentSection() {
    const params = new URLSearchParams(location.search);
    return params.get('section') || 'products';
  }

  return {
    section: getCurrentSection()
  };
}
